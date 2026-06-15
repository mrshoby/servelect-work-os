param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/taskuri/provider-dispatch-ledger-v92",
  "/taskuri/webhook-intake-ledger-v92",
  "/taskuri/task-mutation-pilot-v92",
  "/taskuri/dead-letter-ledger-v92",
  "/taskuri/task-object-model-v92",
  "/taskuri/activity-stream-v92",
  "/admin/provider-ledger-governance-v92",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/health",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/dispatch-ledger",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/webhook-ledger",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/mutation-pilot",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/dead-letter",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/task-object-model",
  "/api/v1/work-os/v92-provider-ledger-task-mutation-pilot/readiness"
)

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null

$rows = @()
$passed = 0

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45
    $bytes = [Text.Encoding]::UTF8.GetByteCount($response.Content)
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300 -and $bytes -gt 20) {
      $passed++
      $rows += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      $rows += "| $route | FAIL | $($response.StatusCode) | $bytes | Non-2xx or empty response |"
    }
  } catch {
    $rows += "| $route | FAIL | 0 | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report = @()
$report += "# v9.2.0 Provider Ledger Task Mutation Pilot Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$report += $rows
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$path = "audit-results\v920-provider-ledger-task-mutation-functional-routes.md"
$report -join "`n" | Set-Content -Path $path -Encoding UTF8

Write-Host "v9.2.0 Provider Ledger Task Mutation smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $(Resolve-Path $path)"

if ($passed -ne $routes.Count) {
  throw "v9.2.0 Provider Ledger Task Mutation smoke failed: $passed / $($routes.Count)"
}
