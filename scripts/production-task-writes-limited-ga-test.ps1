param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/api/v1/enterprise/production-task-writes-limited-ga",
  "/api/v1/enterprise/production-task-writes-limited-ga-health",
  "/api/v1/enterprise/production-task-writes-limited-ga-waves",
  "/api/v1/enterprise/production-task-writes-limited-ga-monitoring",
  "/api/v1/enterprise/production-task-writes-limited-ga-rollback",
  "/api/v1/enterprise/production-task-writes-limited-ga-plan",
  "/api/v1/tasks/limited-ga"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Route did not return ok=true: $route"
  }
}

Write-Host "Production Task Writes Limited GA Rollout checks passed." -ForegroundColor Green
