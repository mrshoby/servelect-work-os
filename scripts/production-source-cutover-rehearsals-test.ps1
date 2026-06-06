param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/admin/production-source-cutover-rehearsals",
  "/admin/production-source-cutover-rehearsals-domain-map",
  "/admin/production-source-cutover-rehearsals-adapter-registry",
  "/admin/production-source-cutover-rehearsals-contracts",
  "/admin/production-source-cutover-rehearsals-parity-drills",
  "/api/v1/enterprise/production-source-cutover-rehearsals-health",
  "/api/v1/enterprise/production-source-cutover-rehearsals-domains",
  "/api/v1/enterprise/production-source-cutover-rehearsals-adapters",
  "/api/v1/enterprise/production-source-cutover-rehearsals-parity",
  "/api/v1/work-os/source-cutover",
  "/api/v1/tasks/source-cutover",
  "/api/v1/projects/source-cutover",
  "/api/v1/stock/source-cutover",
  "/api/v1/pontaj/source-cutover",
  "/api/v1/audit/source-cutover"
)

foreach ($path in $paths) {
  $url = $BaseUrl.TrimEnd('/') + $path
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) {
    throw "Failed $url with status $($response.StatusCode)"
  }
  Write-Host "OK $($response.StatusCode) $path" -ForegroundColor Green
}

Write-Host "v5.1.0 production source cutover rehearsal audit passed." -ForegroundColor Green
