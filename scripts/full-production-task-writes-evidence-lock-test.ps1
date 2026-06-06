param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/enterprise/full-production-task-writes-evidence-lock",
  "/api/v1/enterprise/full-production-task-writes-evidence-lock-health",
  "/api/v1/enterprise/full-production-task-writes-evidence-lock-evidence",
  "/api/v1/enterprise/full-production-task-writes-evidence-lock-controls",
  "/api/v1/enterprise/full-production-task-writes-evidence-lock-rollback",
  "/api/v1/enterprise/full-production-task-writes-evidence-lock-plan",
  "/api/v1/tasks/evidence-lock"
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

Write-Host "Full production task writes evidence lock audit passed." -ForegroundColor Green
