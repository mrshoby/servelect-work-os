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
$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $bytes = $response.RawContentLength
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $result = "PASS"
      $passed++
      $note = "OK"
    } else {
      $result = "FAIL"
      $note = "HTTP $($response.StatusCode)"
    }
    $rows += "| $route | $result | $($response.StatusCode) | $bytes | $note |"
  } catch {
    $rows += "| $route | FAIL | ERR | 0 | $($_.Exception.Message) |"
  }
}
$report = @()
$report += "# v12.0.0 Single Canonical Sidebar Taskuri Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$report += $rows
$report += ""
$report += "Passed: $passed / $($routes.Count)"
New-Item -ItemType Directory -Force -Path (Join-Path (Get-Location) "audit-results") | Out-Null
$path = Join-Path (Join-Path (Get-Location) "audit-results") "v1200-single-canonical-sidebar-taskuri-routes.md"
$report | Set-Content -Path $path -Encoding UTF8
if ($passed -ne $routes.Count) {
  throw "v12.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $path"
}
Write-Host "v12.0.0 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
