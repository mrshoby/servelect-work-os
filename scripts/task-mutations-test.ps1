param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/task-mutations",
  "/admin/release-status",
  "/changelog",
  "/api/v1/enterprise/task-mutations",
  "/api/v1/enterprise/task-mutations-health",
  "/api/v1/enterprise/task-mutations-plan",
  "/api/v1/enterprise/task-mutation-audit",
  "/api/v1/enterprise/release-status",
  "/api/v1/enterprise/product-completion",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/taskuri"
)

Write-Host "SERVELECT WORK OS v2.5 Task Mutations Audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$failed = 0
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $watch = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $watch.Stop()
    $tone = if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) { "Green" } else { "Yellow" }
    Write-Host ("{0} {1}ms {2}" -f $response.StatusCode, $watch.ElapsedMilliseconds, $route) -ForegroundColor $tone
  } catch {
    $watch.Stop()
    $failed++
    Write-Host ("FAIL {0}ms {1} :: {2}" -f $watch.ElapsedMilliseconds, $route, $_.Exception.Message) -ForegroundColor Red
  }
}

if ($failed -gt 0) {
  throw "$failed route(s) failed in v2.5 task mutations audit."
}

Write-Host "OK: v2.5 task mutations routes responded." -ForegroundColor Green
