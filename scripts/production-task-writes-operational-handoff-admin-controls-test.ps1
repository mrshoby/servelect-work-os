param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls",
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls-health",
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls-handoff",
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls-controls",
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls-runbook",
  "/api/v1/enterprise/production-task-writes-operational-handoff-admin-controls-plan",
  "/api/v1/tasks/operational-handoff"
)

Write-Host "SERVELECT WORK OS v4.7 operational handoff audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

foreach ($endpoint in $endpoints) {
  $url = "$BaseUrl$endpoint"
  Write-Host "GET $url" -ForegroundColor Yellow
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Endpoint did not return ok=true: $endpoint"
  }
  Write-Host "OK $endpoint" -ForegroundColor Green
}

Write-Host "All v4.7 operational handoff endpoints passed." -ForegroundColor Green
