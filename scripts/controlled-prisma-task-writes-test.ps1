param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/api/v1/enterprise/controlled-prisma-task-writes",
  "/api/v1/enterprise/controlled-prisma-task-writes-health",
  "/api/v1/enterprise/controlled-prisma-task-writes-staging",
  "/api/v1/enterprise/controlled-prisma-task-writes-rollback",
  "/api/v1/enterprise/controlled-prisma-task-writes-plan",
  "/api/v1/tasks/controlled-write"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Route did not return ok=true: $route"
  }
}

Write-Host "Controlled Prisma task writes staging audit passed." -ForegroundColor Green
