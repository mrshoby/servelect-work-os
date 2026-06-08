param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/work-os/prisma-cutover",
  "/work-os/seed-parity",
  "/work-os/mutation-audit",
  "/work-os/rollback-center",
  "/admin/work-os-prisma-cutover",
  "/api/v1/work-os/prisma-cutover",
  "/api/v1/work-os/prisma-cutover/status",
  "/api/v1/work-os/prisma-cutover/parity",
  "/api/v1/work-os/prisma-cutover/mutations",
  "/api/v1/work-os/prisma-cutover/rollback"
)

Write-Host "SERVELECT WORK OS v5.8 smoke test" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    Write-Host "OK $($response.StatusCode) $route" -ForegroundColor Green
  } catch {
    Write-Host "FAIL $route" -ForegroundColor Red
    throw
  }
}

Write-Host "v5.8 smoke test passed." -ForegroundColor Green
