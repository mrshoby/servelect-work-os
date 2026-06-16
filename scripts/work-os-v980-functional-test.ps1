param(
  [string]$BaseUrl = "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app"
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
  "/api/v1/work-os/v98-goodday-ui-content-function-parity",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/health",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/tasks",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/tickets",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/saved-views",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/workload",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/readiness",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/button-audit",
  "/api/v1/work-os/v98-goodday-ui-content-function-parity/flow-audit"
)

$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    $bytes = $response.Content.Length
    $ok = $status -ge 200 -and $status -lt 300 -and $bytes -gt 50
    if ($ok) { $passed++ }
    $rows += [pscustomobject]@{ Route=$route; Result= if ($ok) { "PASS" } else { "FAIL" }; HTTP=$status; Bytes=$bytes; Note= if ($ok) { "OK" } else { "Unexpected status/size" } }
  } catch {
    $rows += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP="ERR"; Bytes=0; Note=$_.Exception.Message }
  }
}

$report = @()
$report += "# v9.8.0 GoodDay UI Content Function Parity Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($row in $rows) { $report += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $($row.Note -replace '\|','/') |" }
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$outDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$path = Join-Path $outDir "v980-goodday-ui-content-function-parity-functional-routes.md"
$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  Write-Host "v9.8.0 functional route/API smoke failed: $passed / $($routes.Count)"
  Write-Host "Report: $path"
  exit 1
}
Write-Host "v9.8.0 GoodDay UI Content Function Parity smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
