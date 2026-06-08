param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os",
  "/work-os/persistent-records",
  "/work-os/status",
  "/api/v1/work-os/persistent-records",
  "/api/v1/work-os/status"
)

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Route failed: $url ($($response.StatusCode))"
  }
  Write-Host "OK $($response.StatusCode)" -ForegroundColor Green
}
