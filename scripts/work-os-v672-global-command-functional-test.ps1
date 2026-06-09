param(
  [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"

$Routes = @(
  "/work-os/dashboard",
  "/notifications",
  "/work-os/notification-center",
  "/work-os/approvals",
  "/search",
  "/action-center",
  "/api/v1/work-os/global-command",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/workload-aprobari"
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
$AuditDir = Join-Path $RepoRoot "audit-results"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$ReportPath = Join-Path $AuditDir "v672-global-command-functional-routes.md"

$Lines = @()
$Lines += "# SERVELECT WORK OS v6.7.2 Global Command Functional Routes"
$Lines += ""
$Lines += "BaseUrl: $BaseUrl"
$Lines += ""
$Lines += "| Route | Status | Bytes / Error |"
$Lines += "|---|---:|---|"

$Failed = 0

foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri "$BaseUrl$Route" -UseBasicParsing -TimeoutSec 20
    $Bytes = $Response.Content.Length
    Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
    $Lines += "| $Route | PASS $($Response.StatusCode) | $Bytes bytes |"
  } catch {
    $Failed++
    $Message = $_.Exception.Message.Replace("|", "/")
    Write-Host "$Route -> FAIL | $Message" -ForegroundColor Red
    $Lines += "| $Route | FAIL | $Message |"
  }
}

$Lines += ""
$Lines += "Routes PASS: $($Routes.Count - $Failed) / $($Routes.Count)"
Set-Content -Path $ReportPath -Encoding UTF8 -Value $Lines

if ($Failed -gt 0) {
  throw "v6.7.2 functional route smoke failed: $Failed route(s). See $ReportPath"
}

Write-Host "v6.7.2 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $ReportPath" -ForegroundColor Cyan
