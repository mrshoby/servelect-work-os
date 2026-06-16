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
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/health",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/routes",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/scores",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/buttons",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/flows",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/readiness",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/workspace",
  "/api/v1/work-os/v120-single-canonical-sidebar-taskuri/manual-ui"
)

$results = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35
    $bytes = [Text.Encoding]::UTF8.GetByteCount($response.Content)
    $ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    if ($ok) { $passed++ }
    $results += [pscustomobject]@{ Route = $route; Result = if ($ok) { "PASS" } else { "FAIL" }; HTTP = $response.StatusCode; Bytes = $bytes; Note = "OK" }
  } catch {
    $results += [pscustomobject]@{ Route = $route; Result = "FAIL"; HTTP = "ERR"; Bytes = 0; Note = $_.Exception.Message }
  }
}

$dir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$path = Join-Path $dir "v1203-taskuri-route-binding-routes.md"
$report = @("# v12.0.3 Taskuri Route Binding Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
foreach ($row in $results) { $report += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $($row.Note) |" }
$report += ""
$report += "Passed: $passed / $($routes.Count)"
$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) { throw "v12.0.3 route/API smoke failed: $passed / $($routes.Count). Report: $path" }
Write-Host "v12.0.3 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
