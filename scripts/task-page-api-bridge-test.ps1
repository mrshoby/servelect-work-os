param([string]$BaseUrl = "https://servelect-work-os-web.vercel.app")
$ErrorActionPreference = "Stop"
$routes = @(
  "/admin/task-page-api-bridge",
  "/api/v1/enterprise/task-page-api-bridge",
  "/api/v1/enterprise/task-page-api-bridge-health",
  "/api/v1/enterprise/task-page-api-bridge-contract",
  "/api/v1/enterprise/task-page-api-bridge-plan",
  "/api/v1/tasks",
  "/api/v1/tasks/board-state",
  "/taskuri"
)
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    Write-Host "OK $($res.StatusCode) $($sw.ElapsedMilliseconds)ms $url" -ForegroundColor Green
  } catch {
    $sw.Stop()
    Write-Host "FAIL $($sw.ElapsedMilliseconds)ms $url" -ForegroundColor Red
    throw
  }
}
