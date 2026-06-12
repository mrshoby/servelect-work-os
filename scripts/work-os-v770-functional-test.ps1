param([string]$BaseUrl = "http://127.0.0.1:3100")
$ErrorActionPreference = "Stop"
$Routes = @(
  "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/admin/workflows", "/admin/custom-fields", "/admin/goodday-observability", "/work-os/goodday-ui-parity", "/work-os/provider-rehearsal", "/work-os/primary-write-dry-run", "/api/v1/work-os/v77-goodday-ui-parity", "/api/v1/work-os/v77-goodday-ui-parity/health", "/api/v1/work-os/v77-goodday-ui-parity/observability"
)
$OutDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
$Report = Join-Path $OutDir "v770-goodday-ui-functional-routes.md"
$Lines = @("# v7.7.0 GoodDay UI Functional Route Smoke", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes |", "|---|---:|---:|---:|")
$Failed = 0
foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 25
    $Bytes = $Response.Content.Length
    $Lines += "| $Route | PASS | $($Response.StatusCode) | $Bytes |"
    Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
  } catch {
    $Failed++
    $Lines += "| $Route | FAIL: $($_.Exception.Message) | 0 | 0 |"
    Write-Host "$Route -> FAIL | $($_.Exception.Message)" -ForegroundColor Red
  }
}
$Lines | Set-Content -Path $Report -Encoding UTF8
if ($Failed -gt 0) { throw ("v7.7.0 functional route smoke failed: " + $Failed + " route(s). See " + $Report) }
Write-Host "v7.7.0 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $Report"
