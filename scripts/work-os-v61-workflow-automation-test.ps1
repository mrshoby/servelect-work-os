param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os/workflow-automation",
  "/work-os/sla-command-center",
  "/work-os/cross-module-task-factory",
  "/work-os/operations-command-center",
  "/admin/workflow-governance",
  "/api/v1/work-os/workflow-automation/rules",
  "/api/v1/work-os/workflow-automation/sla",
  "/api/v1/work-os/workflow-automation/task-factory",
  "/api/v1/work-os/workflow-automation/command-center"
)

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Route failed: $url status $($response.StatusCode)"
  }
  Write-Host "OK $($response.StatusCode)" -ForegroundColor Green
}
