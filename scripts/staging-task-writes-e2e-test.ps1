param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/api/v1/enterprise/staging-task-writes-e2e",
  "/api/v1/enterprise/staging-task-writes-e2e-health",
  "/api/v1/enterprise/staging-task-writes-e2e-rollback",
  "/api/v1/enterprise/staging-task-writes-e2e-parity",
  "/api/v1/enterprise/staging-task-writes-e2e-plan",
  "/api/v1/tasks/staging-e2e"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Route did not return ok=true: $route"
  }
}

Write-Host "Staging Task Writes E2E validation and rollback drill passed." -ForegroundColor Green
