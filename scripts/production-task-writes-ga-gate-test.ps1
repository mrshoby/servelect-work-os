param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/api/v1/enterprise/production-task-writes-ga-gate",
  "/api/v1/enterprise/production-task-writes-ga-gate-health",
  "/api/v1/enterprise/production-task-writes-ga-gate-evidence",
  "/api/v1/enterprise/production-task-writes-ga-gate-go-no-go",
  "/api/v1/enterprise/production-task-writes-ga-gate-rollback",
  "/api/v1/enterprise/production-task-writes-ga-gate-rollout",
  "/api/v1/tasks/production-ga"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Route did not return ok=true: $route"
  }
}

Write-Host "Production Task Writes General Availability Gate checks passed." -ForegroundColor Green
