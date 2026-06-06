param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/enterprise/unified-work-os-command-center",
  "/api/v1/enterprise/unified-work-os-command-center-health",
  "/api/v1/enterprise/unified-work-os-command-center-modules",
  "/api/v1/enterprise/unified-work-os-command-center-flows",
  "/api/v1/enterprise/unified-work-os-command-center-incidents",
  "/api/v1/enterprise/unified-work-os-command-center-admin-controls",
  "/api/v1/enterprise/unified-work-os-command-center-audit",
  "/api/v1/enterprise/unified-work-os-command-center-automations",
  "/api/v1/enterprise/unified-work-os-command-center-handoff",
  "/api/v1/enterprise/unified-work-os-command-center-roadmap",
  "/api/v1/tasks/unified-command-center",
  "/api/v1/work-os/command-center",
  "/api/v1/work-os/cross-module-operations"
)

Write-Host "SERVELECT WORK OS v4.8 Command Center API Audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Gray

foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  Write-Host "Testing $url" -ForegroundColor Yellow
  $response = Invoke-RestMethod -Uri $url -Method Get
  if (-not $response.ok) {
    throw "Endpoint failed ok check: $path"
  }
  Write-Host "OK $path" -ForegroundColor Green
}

Write-Host "All v4.8 command center endpoints returned ok=true." -ForegroundColor Green
