param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/enterprise/prisma-task-mutation-shadow-audit",
  "/api/v1/enterprise/prisma-task-mutation-shadow-audit-health",
  "/api/v1/enterprise/prisma-task-mutation-shadow-audit-plan",
  "/api/v1/tasks/mutation-shadow-audit"
)

foreach ($endpoint in $endpoints) {
  $url = $BaseUrl.TrimEnd("/") + $endpoint
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method Get
  if (-not $response.ok) {
    throw "Endpoint did not return ok=true: $endpoint"
  }
  $response | ConvertTo-Json -Depth 20
}

Write-Host "v3.4.0 Prisma task mutation shadow audit endpoints passed." -ForegroundColor Green
