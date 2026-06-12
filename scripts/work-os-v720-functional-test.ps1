param(
  [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ReportDir = Join-Path $RepoRoot "audit-results"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$ReportPath = Join-Path $ReportDir "v720-prisma-shadow-functional-routes.md"

$Routes = @(
  "/work-os/prisma-shadow-records",
  "/admin/prisma-shadow-records",
  "/api/v1/work-os/v72-shadow-records",
  "/api/v1/work-os/v72-shadow-records/health",
  "/api/v1/work-os/v72-shadow-records/mutations",
  "/api/v1/work-os/v72-shadow-records/rollback",
  "/api/v1/work-os/v72-shadow-records/notifications",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
)

$Lines = @()
$Lines += "# v7.2.3 Prisma Shadow Functional Route Smoke"
$Lines += ""
$Lines += "BaseUrl: $BaseUrl"
$Lines += ""
$Lines += "| Route | Result | HTTP | Bytes |"
$Lines += "|---|---:|---:|---:|"

$Failed = 0
foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 30
    $Bytes = $Response.Content.Length
    Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
    $Lines += "| $Route | PASS | $($Response.StatusCode) | $Bytes |"
  } catch {
    $Failed += 1
    Write-Host "$Route -> FAIL | $($_.Exception.Message)" -ForegroundColor Red
    $Lines += "| $Route | FAIL: $($_.Exception.Message) | 0 | 0 |"
  }
}

$Lines | Set-Content -Path $ReportPath -Encoding UTF8

if ($Failed -gt 0) {
  throw ("v7.2.3 functional route smoke failed: " + $Failed + " route(s). See " + $ReportPath)
}

Write-Host "v7.2.3 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $ReportPath" -ForegroundColor Green
