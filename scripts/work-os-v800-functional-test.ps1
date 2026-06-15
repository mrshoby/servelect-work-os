param(
  [string]$BaseUrl = "http://localhost:3000",
  [int]$TimeoutSec = 45
)

$ErrorActionPreference = "Stop"
$base = $BaseUrl.TrimEnd("/")
$headers = @{}
if ($env:VERCEL_AUTOMATION_BYPASS_SECRET) {
  $headers["x-vercel-protection-bypass"] = $env:VERCEL_AUTOMATION_BYPASS_SECRET
  $headers["x-vercel-set-bypass-cookie"] = "true"
}

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
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/api/v1/work-os/v80-production-pilot",
  "/api/v1/work-os/v80-production-pilot/health",
  "/api/v1/work-os/v80-production-pilot/acl-evaluation",
  "/api/v1/work-os/v80-production-pilot/mutation-guard",
  "/api/v1/work-os/v80-production-pilot/rollback-drill",
  "/api/v1/work-os/v80-production-pilot/provider-readiness"
)

$results = @()
foreach ($route in $routes) {
  $url = "$base$route"
  try {
    $response = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -TimeoutSec $TimeoutSec
    $ok = [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400
    $status = if ($ok) { "PASS" } else { "FAIL" }
    Write-Host "$route -> $status HTTP $($response.StatusCode) | $($response.RawContentLength) bytes"
    $results += [pscustomobject]@{ Route=$route; Result=$status; HTTP=$response.StatusCode; Bytes=$response.RawContentLength; Note="OK" }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)" -ForegroundColor Red
    $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP="ERR"; Bytes=0; Note=$_.Exception.Message }
  }
}

$passed = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$total = $results.Count
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
$report = @()
$report += "# v8.0.0 Production Pilot Functional Route/API Test"
$report += ""
$report += "BaseUrl: $base"
$report += "Passed: $passed / $total"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($row in $results) {
  $note = ($row.Note -replace "\|", "/")
  $report += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $note |"
}
$path = Join-Path (Get-Location) "audit-results\v800-production-pilot-functional-routes.md"
$report -join "`n" | Set-Content -Path $path -Encoding UTF8
Write-Host "v8.0.0 functional route/API smoke passed: $passed / $total"
Write-Host "Report: $path"
if ($passed -ne $total) { exit 1 }
