param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$Endpoints = @(
  "/admin/production-task-writes-real-enable-switch",
  "/api/v1/enterprise/production-task-writes-real-enable-switch",
  "/api/v1/enterprise/production-task-writes-real-enable-switch-health",
  "/api/v1/enterprise/production-task-writes-real-enable-switch-gates",
  "/api/v1/enterprise/production-task-writes-real-enable-switch-commands",
  "/api/v1/enterprise/production-task-writes-real-enable-switch-rollback",
  "/api/v1/enterprise/production-task-writes-real-enable-switch-plan",
  "/api/v1/tasks/real-enable-switch"
)

foreach ($Endpoint in $Endpoints) {
  $Url = "$BaseUrl$Endpoint"
  Write-Host "Testing $Url" -ForegroundColor Cyan
  $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
  if ($Response.StatusCode -lt 200 -or $Response.StatusCode -ge 400) {
    throw "Endpoint failed: $Url ($($Response.StatusCode))"
  }
}

Write-Host "v4.5 production task writes real enable switch audit passed." -ForegroundColor Green
