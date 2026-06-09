param(
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$OutputDir = "audit-results"
)

$ErrorActionPreference = "Stop"
$Routes = @(
  @{ Name = "dashboard"; Path = "/work-os/dashboard" },
  @{ Name = "notifications"; Path = "/notifications" },
  @{ Name = "notification_center"; Path = "/work-os/notification-center" },
  @{ Name = "approvals"; Path = "/work-os/approvals" },
  @{ Name = "search"; Path = "/search" },
  @{ Name = "action_center"; Path = "/action-center" },
  @{ Name = "global_command_api"; Path = "/api/v1/work-os/global-command" },
  @{ Name = "taskuri_overview"; Path = "/taskuri/overview" },
  @{ Name = "taskuri_tickets"; Path = "/taskuri/tickets-notificari" },
  @{ Name = "taskuri_workload"; Path = "/taskuri/workload-aprobari" }
)

$RepoRoot = (Get-Location).Path
$FullOutputDir = Join-Path $RepoRoot $OutputDir
New-Item -ItemType Directory -Force -Path $FullOutputDir | Out-Null
$Rows = @()
$Failed = 0

foreach ($Route in $Routes) {
  $Url = "$BaseUrl$($Route.Path)"
  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 25
    $Bytes = $Response.Content.Length
    $State = if ($Response.StatusCode -eq 200 -and $Bytes -gt 500) { "PASS" } else { "FAIL" }
    if ($State -ne "PASS") { $Failed++ }
    Write-Host "$($Route.Path) -> $State HTTP $($Response.StatusCode) | $Bytes bytes"
    $Rows += [pscustomobject]@{ Name=$Route.Name; Route=$Route.Path; Url=$Url; State=$State; Http=$Response.StatusCode; Bytes=$Bytes; Error="" }
  } catch {
    $Failed++
    Write-Host "$($Route.Path) -> FAIL | $($_.Exception.Message)" -ForegroundColor Red
    $Rows += [pscustomobject]@{ Name=$Route.Name; Route=$Route.Path; Url=$Url; State="FAIL"; Http=0; Bytes=0; Error=$_.Exception.Message }
  }
}

$CsvPath = Join-Path $FullOutputDir "v670-global-command-functional-routes.csv"
$MdPath = Join-Path $FullOutputDir "v670-global-command-functional-routes.md"
$Rows | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8

$Passed = ($Rows | Where-Object { $_.State -eq "PASS" }).Count
$Report = @()
$Report += "# SERVELECT WORK OS v6.7.0 Global Command Functional Route Test"
$Report += ""
$Report += "Generated: $(Get-Date -Format s)"
$Report += "BaseUrl: $BaseUrl"
$Report += "Routes PASS: $Passed / $($Routes.Count)"
$Report += ""
$Report += "| Name | Route | State | HTTP | Bytes | Error |"
$Report += "|---|---|---:|---:|---:|---|"
foreach ($Row in $Rows) {
  $Report += "| $($Row.Name) | $($Row.Route) | $($Row.State) | $($Row.Http) | $($Row.Bytes) | $($Row.Error) |"
}
$Report += ""
$Report += "## Notes"
$Report += "This smoke test validates global Work OS routes introduced in v6.7.0. It does not replace browser-level functional testing."
Set-Content -Path $MdPath -Value ($Report -join "`n") -Encoding UTF8

if ($Failed -gt 0) {
  throw "v6.7 functional route smoke failed: $Failed route(s). See $MdPath"
}

Write-Host "v6.7 global command routes PASS: $Passed / $($Routes.Count)" -ForegroundColor Green
