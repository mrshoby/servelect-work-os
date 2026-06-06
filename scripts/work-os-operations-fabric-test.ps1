param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/admin/work-os-operations-fabric",
  "/admin/work-os-operations-fabric-data-bridge",
  "/admin/work-os-operations-fabric-automation-ops",
  "/admin/work-os-operations-fabric-incident-command",
  "/admin/work-os-operations-fabric-executive-readiness",
  "/api/v1/enterprise/work-os-operations-fabric-health",
  "/api/v1/enterprise/work-os-operations-fabric-modules",
  "/api/v1/enterprise/work-os-operations-fabric-connectors",
  "/api/v1/enterprise/work-os-operations-fabric-flows",
  "/api/v1/enterprise/work-os-operations-fabric-contracts",
  "/api/v1/enterprise/work-os-operations-fabric-automations",
  "/api/v1/enterprise/work-os-operations-fabric-incidents",
  "/api/v1/enterprise/work-os-operations-fabric-risks",
  "/api/v1/enterprise/work-os-operations-fabric-rbac",
  "/api/v1/enterprise/work-os-operations-fabric-runbooks",
  "/api/v1/enterprise/work-os-operations-fabric-commands",
  "/api/v1/enterprise/work-os-operations-fabric-executive",
  "/api/v1/enterprise/work-os-operations-fabric-roadmap",
  "/api/v1/work-os/operations-fabric",
  "/api/v1/work-os/cross-module-data-bridge",
  "/api/v1/tasks/operations-fabric"
)

foreach ($path in $paths) {
  $url = $BaseUrl.TrimEnd("/") + $path
  Write-Host "GET $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Bad status $($response.StatusCode) for $url"
  }
  Write-Host "OK $($response.StatusCode)" -ForegroundColor Green
}

Write-Host "v4.9 Work OS operations fabric smoke test passed." -ForegroundColor Green
