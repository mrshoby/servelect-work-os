param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/health",
  "/api/v1/dashboard",
  "/api/v1/projects",
  "/api/v1/tasks",
  "/api/v1/iot/alerts",
  "/api/v1/approvals",
  "/api/v1/search?q=Invertor"
)

foreach ($endpoint in $endpoints) {
  $url = "$BaseUrl$endpoint"
  Write-Host "GET $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method Get
  if (-not $response.ok) {
    throw "Endpoint failed: $endpoint"
  }
  Write-Host "OK" -ForegroundColor Green
}

Write-Host "All SERVELECT API endpoints responded successfully." -ForegroundColor Green
