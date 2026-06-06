param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook",
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook-health",
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook-runbook",
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook-enablement",
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook-rollback",
  "/api/v1/enterprise/production-task-writes-full-enablement-runbook-plan",
  "/api/v1/tasks/full-enablement"
)

foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  Write-Host "GET $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) {
    throw "Endpoint failed: $url"
  }
  Write-Host "OK $path" -ForegroundColor Green
}

Write-Host "Production task writes full enablement runbook audit passed." -ForegroundColor Green
