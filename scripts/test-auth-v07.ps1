param(
  [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "Testing SERVELECT WORK OS v0.7 auth endpoints against $BaseUrl" -ForegroundColor Cyan

$endpoints = @(
  "/api/v1/auth/session",
  "/api/v1/auth/users",
  "/api/v1/auth/permissions"
)

foreach ($endpoint in $endpoints) {
  Write-Host "GET $endpoint" -ForegroundColor Yellow
  Invoke-RestMethod -Uri "$BaseUrl$endpoint" -Method Get | ConvertTo-Json -Depth 6
}

Write-Host "POST /api/v1/auth/authorize" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BaseUrl/api/v1/auth/authorize" -Method Post -ContentType "application/json" -Body '{"permission":"admin:manage"}' | ConvertTo-Json -Depth 6
