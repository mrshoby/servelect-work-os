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
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/health",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/routes",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/scores",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/buttons",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/flows",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/density",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/workload",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/readiness"
)

$report = @()
$report += "# v11.0.0 Major Taskuri GoodDay Workspace Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 25
    $bytes = [Text.Encoding]::UTF8.GetByteCount([string]$response.Content)
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      $passed++
      $report += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      $report += "| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected status |"
    }
  } catch {
    $report += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$dir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$path = Join-Path $dir "v1100-major-taskuri-goodday-workspace-functional-routes.md"
$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v11.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $path"
}
Write-Host "v11.0.0 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
