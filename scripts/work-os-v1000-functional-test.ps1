param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/inbox",
  "/taskuri/tickets",
  "/taskuri/tickets-notificari",
  "/taskuri/proiecte-active",
  "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/table",
  "/taskuri/calendar",
  "/taskuri/calendar-gantt",
  "/taskuri/workload",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/taskuri/automations",
  "/api/v1/work-os/v100-goodday-ui-functional-parity",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/health",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/routes",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/scores",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/buttons",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/flows",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/readiness"
)

$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35
    $ok = ($response.StatusCode -eq 200)
    if ($ok) { $passed++ }
    $rows += [pscustomobject]@{ Route = $route; Result = if ($ok) { "PASS" } else { "FAIL" }; HTTP = $response.StatusCode; Bytes = $response.RawContentLength; Note = "OK" }
  } catch {
    $rows += [pscustomobject]@{ Route = $route; Result = "FAIL"; HTTP = "ERR"; Bytes = 0; Note = $_.Exception.Message }
  }
}

$report = @()
$report += "# v10.0.0 Major GoodDay UI Functional Parity Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($row in $rows) { $report += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $($row.Note) |" }
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$outDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$path = Join-Path $outDir "v1000-goodday-ui-functional-parity-routes.md"
$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) { throw "v10.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $path" }
Write-Host "v10.0.0 Major GoodDay UI Functional Parity smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
