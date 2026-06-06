param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/admin/production-task-writes-post-enable-monitoring-sla-dashboard",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard-health",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard-sla",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard-signals",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard-incidents",
  "/api/v1/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard-runbook",
  "/api/v1/tasks/post-enable-monitoring"
)

foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) {
    throw "Unexpected status $($response.StatusCode) for $url"
  }
  Write-Host "OK $($response.StatusCode)" -ForegroundColor Green
}

Write-Host "v4.6 post-enable monitoring SLA audit passed." -ForegroundColor Green
