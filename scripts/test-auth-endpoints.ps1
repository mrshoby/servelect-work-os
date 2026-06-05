param(
  [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "Testing auth endpoints for $BaseUrl" -ForegroundColor Cyan

$session = Invoke-RestMethod "$BaseUrl/api/v1/auth/session"
$users = Invoke-RestMethod "$BaseUrl/api/v1/auth/users"
$permissions = Invoke-RestMethod "$BaseUrl/api/v1/auth/permissions"

Write-Host "Session:" -ForegroundColor Green
$session | ConvertTo-Json -Depth 8

Write-Host "Users:" -ForegroundColor Green
$users | ConvertTo-Json -Depth 8

Write-Host "Permissions:" -ForegroundColor Green
$permissions | ConvertTo-Json -Depth 8
