param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/inline-persistence-v96",
  "/taskuri/command-palette-actions-v96",
  "/taskuri/gantt-conflict-review-v96",
  "/taskuri/notification-routing-v96",
  "/taskuri/saved-view-persistence-v96",
  "/taskuri/task-change-audit-v96",
  "/taskuri/manager-gate-inbox-v96",
  "/admin/taskuri-persistence-governance-v96",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/health",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/persistence-adapter",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/command-actions",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/gantt-conflicts",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/notifications",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/saved-views",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/audit",
  "/api/v1/work-os/v96-live-inline-persistence-command-gantt/readiness"
)

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report = @("# v9.6.0 Live Inline Persistence Command Gantt Functional Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $bytes = $response.RawContentLength
    if ($response.StatusCode -eq 200) {
      $passed++
      $report += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      $report += "| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected status |"
    }
  } catch {
    $report += "| $route | FAIL | 0 | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}
$report += ""
$report += "Passed: $passed / $($routes.Count)"
New-Item -ItemType Directory -Force -Path (Join-Path (Get-Location) "audit-results") | Out-Null
$path = Join-Path (Join-Path (Get-Location) "audit-results") "v960-live-inline-persistence-command-gantt-functional-routes.md"
$report | Set-Content -Path $path -Encoding UTF8
Write-Host "v9.6.0 Live Inline Persistence Command Gantt smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $(Resolve-Path $path)"
if ($passed -ne $routes.Count) { exit 1 }

