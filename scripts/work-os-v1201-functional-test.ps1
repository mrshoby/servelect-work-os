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

$rows = New-Object System.Collections.Generic.List[string]
$rows.Add("# v12.0.1 Single Sidebar Route Export Fix Route/API Test")
$rows.Add("")
$rows.Add("BaseUrl: $BaseUrl")
$rows.Add("")
$rows.Add("| Route | Result | HTTP | Bytes | Note |")
$rows.Add("|---|---:|---:|---:|---|")

$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45
    $bytes = [Text.Encoding]::UTF8.GetByteCount($response.Content)
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed++
      $rows.Add("| $route | PASS | $($response.StatusCode) | $bytes | OK |")
    } else {
      $rows.Add("| $route | FAIL | $($response.StatusCode) | $bytes | HTTP status |")
    }
  } catch {
    $message = ($_.Exception.Message -replace "\|", "/")
    $rows.Add("| $route | FAIL | ERR | 0 | $message |")
  }
}

$rows.Add("")
$rows.Add("Passed: $passed / $($routes.Count)")

$reportDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$reportPath = Join-Path $reportDir "v1201-route-export-fix-routes.md"
$rows | Set-Content -LiteralPath $reportPath -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v12.0.1 route/API smoke failed: $passed / $($routes.Count). Report: $reportPath"
}

Write-Host "v12.0.1 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
