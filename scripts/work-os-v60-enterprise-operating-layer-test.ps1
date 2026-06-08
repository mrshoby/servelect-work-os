param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os/enterprise-operating-layer",
  "/work-os/accounts-v2",
  "/work-os/team-command",
  "/work-os/role-dashboards",
  "/work-os/notification-center",
  "/admin/enterprise-governance",
  "/api/v1/work-os/enterprise-operating-layer",
  "/api/v1/work-os/enterprise-operating-layer/accounts",
  "/api/v1/work-os/enterprise-operating-layer/notifications",
  "/api/v1/work-os/enterprise-operating-layer/approvals",
  "/api/v1/work-os/enterprise-operating-layer/compliance"
)

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Route failed: $url returned $($response.StatusCode)"
  }
  Write-Host "OK $($response.StatusCode)" -ForegroundColor Green
}

Write-Host "v6.0.0 enterprise operating layer smoke test passed." -ForegroundColor Green
