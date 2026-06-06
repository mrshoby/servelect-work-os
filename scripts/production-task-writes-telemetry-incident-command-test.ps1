param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command",
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command-health",
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command-telemetry",
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command-incidents",
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command-rollback",
  "/api/v1/enterprise/production-task-writes-telemetry-incident-command-plan",
  "/api/v1/tasks/production-telemetry"
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

Write-Host "Production task writes telemetry and incident command audit passed." -ForegroundColor Green
