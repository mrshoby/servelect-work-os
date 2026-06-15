param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
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
  "/admin/database-adapter-dispatch-worker",
  "/admin/enterprise-department-suite",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/work-os/database-adapter-dispatch-worker",
  "/work-os/enterprise-department-suite",
  "/api/v1/work-os/v80-production-pilot",
  "/api/v1/work-os/v81-primary-write-session-provider",
  "/api/v1/work-os/v82-auth-audit-outbox",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot",
  "/api/v1/work-os/v84-database-adapter-dispatch-worker",
  "/api/v1/work-os/v85-enterprise-department-suite",
  "/api/v1/work-os/v85-enterprise-department-suite/health",
  "/api/v1/work-os/v85-enterprise-department-suite/session-adapter",
  "/api/v1/work-os/v85-enterprise-department-suite/rls-policy-proof",
  "/api/v1/work-os/v85-enterprise-department-suite/department-write-scopes",
  "/api/v1/work-os/v85-enterprise-department-suite/bulk-actions",
  "/api/v1/work-os/v85-enterprise-department-suite/goodday-parity-workspace",
  "/api/v1/work-os/v85-enterprise-department-suite/provider-runtime",
  "/api/v1/work-os/v85-enterprise-department-suite/rbac-drill",
  "/api/v1/work-os/v85-enterprise-department-suite/runtime-proof"
)

$passed = 0
$rows = @()
Write-Host "# v8.5.0 Enterprise Department Suite Functional Route/API Test"
Write-Host "BaseUrl: $BaseUrl"

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 40
    $bytes = $response.RawContentLength
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed += 1
      Write-Host "$route -> PASS HTTP $($response.StatusCode) | $bytes bytes"
      $rows += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      Write-Host "$route -> FAIL HTTP $($response.StatusCode)"
      $rows += "| $route | FAIL | $($response.StatusCode) | $bytes | Non-2xx |"
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)"
    $rows += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report = @()
$report += "# v8.5.0 Enterprise Department Suite Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += "Passed: $passed / $($routes.Count)"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$report += $rows

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$ReportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v850-enterprise-department-suite-functional-routes.md"
$report -join "`n" | Set-Content -Path $ReportPath -Encoding UTF8

Write-Host "v8.5.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $ReportPath"

if ($passed -ne $routes.Count) {
  exit 1
}
exit 0
