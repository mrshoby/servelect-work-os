param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/enterprise/persistent-task-audit-rbac",
  "/api/v1/enterprise/persistent-task-audit-rbac-health",
  "/api/v1/enterprise/persistent-task-audit-rbac-rbac",
  "/api/v1/enterprise/persistent-task-audit-rbac-audit",
  "/api/v1/enterprise/persistent-task-audit-rbac-plan",
  "/api/v1/tasks/audit-rbac"
)

Write-Host "SERVELECT WORK OS v3.6 audit/RBAC test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

foreach ($endpoint in $endpoints) {
  $url = "$BaseUrl$endpoint"
  Write-Host "Testing $url" -ForegroundColor Yellow
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Endpoint did not return ok=true: $endpoint"
  }
  Write-Host "OK $endpoint" -ForegroundColor Green
}

Write-Host "All v3.6 audit/RBAC endpoints passed." -ForegroundColor Green
