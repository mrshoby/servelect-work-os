param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/api/v1/enterprise/production-task-writes-canary",
  "/api/v1/enterprise/production-task-writes-canary-health",
  "/api/v1/enterprise/production-task-writes-canary-rings",
  "/api/v1/enterprise/production-task-writes-canary-rollback",
  "/api/v1/enterprise/production-task-writes-canary-plan",
  "/api/v1/tasks/production-canary"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Route did not return ok=true: $route"
  }
}

Write-Host "Production Task Writes Canary Activation checks passed." -ForegroundColor Green
