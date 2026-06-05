param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/task-board-drawer",
  "/admin/release-status",
  "/changelog",
  "/api/v1/enterprise/task-board-drawer",
  "/api/v1/enterprise/task-board-drawer-health",
  "/api/v1/enterprise/task-board-drawer-contract",
  "/api/v1/enterprise/task-board-drawer-plan",
  "/api/v1/tasks/board-state",
  "/api/v1/enterprise/release-status",
  "/api/v1/enterprise/product-completion"
)

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    Write-Host ("OK {0} {1}ms {2}" -f $res.StatusCode, $sw.ElapsedMilliseconds, $route) -ForegroundColor Green
  } catch {
    $sw.Stop()
    Write-Host ("FAIL {0}ms {1}" -f $sw.ElapsedMilliseconds, $route) -ForegroundColor Red
    throw
  }
}
