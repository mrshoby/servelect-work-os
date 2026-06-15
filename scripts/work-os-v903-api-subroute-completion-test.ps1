param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/api/v1/work-os/v90-production-pilot-cutover/health",
  "/api/v1/work-os/v90-production-pilot-cutover/production-pilot-cutover",
  "/api/v1/work-os/v90-production-pilot-cutover/live-provider-dispatch",
  "/api/v1/work-os/v90-production-pilot-cutover/signed-webhook-hardening",
  "/api/v1/work-os/v90-production-pilot-cutover/webhook-replay-protection",
  "/api/v1/work-os/v90-production-pilot-cutover/provider-secret-env-check",
  "/api/v1/work-os/v90-production-pilot-cutover/action-required",
  "/api/v1/work-os/v90-production-pilot-cutover/workload-capacity",
  "/api/v1/work-os/v90-production-pilot-cutover/hierarchy-map",
  "/api/v1/work-os/v90-production-pilot-cutover/cross-module-activity",
  "/api/v1/work-os/v90-production-pilot-cutover/rollback-drill",
  "/api/v1/work-os/v90-production-pilot-cutover/manager-approval-gates",
  "/api/v1/work-os/v90-production-pilot-cutover/pixel-diff-release-gates",
  "/api/v1/work-os/v90-production-pilot-cutover/goodday-parity-delta",
  "/api/v1/work-os/v90-production-pilot-cutover/release-readiness"
)

$results = @()
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30
    $bytes = if ($response.Content) { [System.Text.Encoding]::UTF8.GetByteCount($response.Content) } else { 0 }
    $results += [pscustomobject]@{ Route = $route; Result = "PASS"; HTTP = [int]$response.StatusCode; Bytes = $bytes; Note = "OK" }
  } catch {
    $status = 0
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { $status = [int]$_.Exception.Response.StatusCode }
    $results += [pscustomobject]@{ Route = $route; Result = "FAIL"; HTTP = $status; Bytes = 0; Note = $_.Exception.Message }
  }
}

$passed = @($results | Where-Object { $_.Result -eq "PASS" }).Count
$report = @()
$report += "# v9.0.3 API Subroute Completion Functional Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($r in $results) {
  $note = ($r.Note -replace "\|", "/")
  $report += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $note |"
}
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$reportDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$reportPath = Join-Path $reportDir "v903-api-subroute-completion-functional-routes.md"
$report -join "`n" | Set-Content -Path $reportPath -Encoding UTF8

Write-Host "v9.0.3 API subroute completion smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"

if ($passed -ne $routes.Count) {
  throw "v9.0.3 API subroute completion smoke failed: $passed / $($routes.Count)"
}
