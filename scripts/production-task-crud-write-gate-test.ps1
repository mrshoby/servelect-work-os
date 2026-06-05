param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/production-task-crud",
  "/api/v1/enterprise/production-task-crud",
  "/api/v1/enterprise/production-task-crud-health",
  "/api/v1/enterprise/production-task-crud-write-gate",
  "/api/v1/enterprise/production-task-crud-plan",
  "/api/v1/tasks/write-gate",
  "/admin/release-status",
  "/changelog"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Route failed: $url status $($response.StatusCode)"
  }
  Write-Host "OK $($response.StatusCode) $route" -ForegroundColor Green
}

Write-Host "All v3.0 production task CRUD write-gate checks passed." -ForegroundColor Green
