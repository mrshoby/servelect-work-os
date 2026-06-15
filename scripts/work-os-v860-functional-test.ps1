param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

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
  "/taskuri/enterprise-control-room",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/primary-write-pilot",
  "/admin/production-pilot-readiness",
  "/admin/primary-write-session-provider",
  "/admin/auth-session-audit-outbox",
  "/admin/prisma-audit-outbox-transaction-pilot",
  "/admin/database-adapter-dispatch-worker",
  "/admin/enterprise-department-suite",
  "/admin/auth-rls-department-pilot",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/work-os/database-adapter-dispatch-worker",
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/api/v1/work-os/v80-production-pilot",
  "/api/v1/work-os/v81-primary-write-session-provider",
  "/api/v1/work-os/v82-auth-audit-outbox",
  "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot",
  "/api/v1/work-os/v84-database-adapter-dispatch-worker",
  "/api/v1/work-os/v85-enterprise-department-suite",
  "/api/v1/work-os/v86-auth-rls-department-pilot",
  "/api/v1/work-os/v86-auth-rls-department-pilot/health",
  "/api/v1/work-os/v86-auth-rls-department-pilot/auth-runtime",
  "/api/v1/work-os/v86-auth-rls-department-pilot/prisma-rls",
  "/api/v1/work-os/v86-auth-rls-department-pilot/department-pilot-writes",
  "/api/v1/work-os/v86-auth-rls-department-pilot/bulk-transaction-pilot",
  "/api/v1/work-os/v86-auth-rls-department-pilot/goodday-command-center",
  "/api/v1/work-os/v86-auth-rls-department-pilot/provider-dispatch-runtime",
  "/api/v1/work-os/v86-auth-rls-department-pilot/task-workflow-hardening",
  "/api/v1/work-os/v86-auth-rls-department-pilot/reporting-and-proof",
  "/api/v1/work-os/v86-auth-rls-department-pilot/screenshot-quality-gates"
)

$report = New-Object System.Collections.Generic.List[string]
$report.Add("# v8.6.0 Auth RLS Department Pilot Functional Route/API Test")
$report.Add("")
$report.Add("BaseUrl: $BaseUrl")
$report.Add("")
$report.Add("| Route | Result | HTTP | Bytes | Note |")
$report.Add("|---|---:|---:|---:|---|")

$passed = 0

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $headers = @{}
    if ($env:VERCEL_AUTOMATION_BYPASS_SECRET) {
      $headers["x-vercel-protection-bypass"] = $env:VERCEL_AUTOMATION_BYPASS_SECRET
    }

    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers $headers -TimeoutSec 40
    $bytes = [System.Text.Encoding]::UTF8.GetByteCount($response.Content)

    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed++
      Write-Host "$route -> PASS HTTP $($response.StatusCode) | $bytes bytes"
      $report.Add("| $route | PASS | $($response.StatusCode) | $bytes | OK |")
    } else {
      Write-Host "$route -> FAIL HTTP $($response.StatusCode)"
      $report.Add("| $route | FAIL | $($response.StatusCode) | $bytes | Non-2xx |")
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)"
    $report.Add("| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |")
  }
}

$summary = "v8.6.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host $summary
$report.Insert(4, "Passed: $passed / $($routes.Count)")
$report.Insert(5, "")

$reportDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$reportPath = Join-Path $reportDir "v860-auth-rls-department-pilot-functional-routes.md"
$report -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "Report: $reportPath"

if ($passed -ne $routes.Count) {
  exit 1
}
