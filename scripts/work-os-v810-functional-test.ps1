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
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/api/v1/work-os/v80-production-pilot",
  "/api/v1/work-os/v81-primary-write-session-provider",
  "/api/v1/work-os/v81-primary-write-session-provider/health",
  "/api/v1/work-os/v81-primary-write-session-provider/session-acl",
  "/api/v1/work-os/v81-primary-write-session-provider/primary-write-queue",
  "/api/v1/work-os/v81-primary-write-session-provider/provider-runtime",
  "/api/v1/work-os/v81-primary-write-session-provider/reconciliation",
  "/api/v1/work-os/v81-primary-write-session-provider/rollback-verify"
)

$headers = @{}
if ($env:VERCEL_AUTOMATION_BYPASS_SECRET) {
  $headers["x-vercel-protection-bypass"] = $env:VERCEL_AUTOMATION_BYPASS_SECRET
}

$results = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -TimeoutSec 35
    $bytes = $response.RawContentLength
    if (-not $bytes) { $bytes = ($response.Content | Out-String).Length }
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed++
      Write-Host "$route -> PASS HTTP $($response.StatusCode) | $bytes bytes" -ForegroundColor Green
      $results += [pscustomobject]@{ Route=$route; Result="PASS"; HTTP=$response.StatusCode; Bytes=$bytes; Note="OK" }
    } else {
      Write-Host "$route -> FAIL HTTP $($response.StatusCode)" -ForegroundColor Red
      $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=$response.StatusCode; Bytes=$bytes; Note="Unexpected status" }
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)" -ForegroundColor Red
    $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP="ERR"; Bytes=0; Note=$_.Exception.Message }
  }
}

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report = @()
$report += "# v8.1.0 Primary Write Session Provider Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += "Passed: $passed / $($routes.Count)"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($r in $results) {
  $note = ($r.Note -replace "\|", "/")
  $report += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $note |"
}
$report | Set-Content "audit-results\v810-primary-write-session-functional-routes.md" -Encoding UTF8
$report | Set-Content "docs\V8_1_0_FUNCTIONAL_TEST_REPORT.md" -Encoding UTF8
Write-Host "v8.1.0 functional route/API smoke passed: $passed / $($routes.Count)"
if ($passed -ne $routes.Count) { exit 1 }
