param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Continue"
$routes = @(
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/tickets-notificari",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/taskuri/automations",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/primary-write-pilot",
  "/admin/production-pilot-readiness",
  "/admin/primary-write-session-provider",
  "/admin/auth-session-audit-outbox",
  "/admin/prisma-audit-outbox-transaction-pilot",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/api/v1/work-os/v80-production-pilot",
  "/api/v1/work-os/v81-primary-write-session-provider",
  "/api/v1/work-os/v82-auth-audit-outbox",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/health",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/prisma-schema",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/transactional-write",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/audit-outbox",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/runtime-proof",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/rollback-replay"
)

$report = @()
$report += "# v8.3.0 Prisma Audit Outbox Transaction Pilot Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += "Passed: PENDING"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"

$passed = 0
foreach ($route in $routes) {
  $url = ($BaseUrl.TrimEnd('/')) + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 45
    $bytes = if ($response.RawContent) { [System.Text.Encoding]::UTF8.GetByteCount($response.RawContent) } else { 0 }
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed += 1
      Write-Host "$route -> PASS HTTP $($response.StatusCode) | $bytes bytes" -ForegroundColor Green
      $report += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      Write-Host "$route -> FAIL HTTP $($response.StatusCode)" -ForegroundColor Red
      $report += "| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected status |"
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)" -ForegroundColor Red
    $report += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report[3] = "Passed: $passed / $($routes.Count)"
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$reportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v830-prisma-audit-outbox-transactional-functional-routes.md"
$report -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "v8.3.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
if ($passed -ne $routes.Count) { exit 1 }
