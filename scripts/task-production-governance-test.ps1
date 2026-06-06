param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/enterprise/task-production-governance",
  "/api/v1/enterprise/task-production-governance-health",
  "/api/v1/enterprise/task-production-governance-rbac",
  "/api/v1/enterprise/task-production-governance-audit",
  "/api/v1/tasks/governance"
)

foreach ($endpoint in $endpoints) {
  $url = $BaseUrl.TrimEnd('/') + $endpoint
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Endpoint did not return ok=true: $url"
  }
  Write-Host "OK $endpoint" -ForegroundColor Green
}

Write-Host "Task production governance audit passed." -ForegroundColor Green
