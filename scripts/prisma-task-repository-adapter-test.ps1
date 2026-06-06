param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/admin/prisma-task-repository-adapter",
  "/api/v1/enterprise/prisma-task-repository-adapter",
  "/api/v1/enterprise/prisma-task-repository-adapter-health",
  "/api/v1/enterprise/prisma-task-repository-adapter-plan",
  "/api/v1/tasks/repository-mode"
)

foreach ($endpoint in $endpoints) {
  $url = $BaseUrl.TrimEnd("/") + $endpoint
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  Write-Host "  HTTP $($response.StatusCode)" -ForegroundColor Green
}
