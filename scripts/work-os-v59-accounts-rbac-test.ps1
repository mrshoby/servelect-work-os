param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Continue"
$routes = @(
  "/my-work",
  "/account/profile",
  "/account/settings",
  "/account/security",
  "/account/notifications",
  "/team/workload",
  "/team/tasks",
  "/admin/users",
  "/admin/users/u1",
  "/admin/roles",
  "/admin/permissions",
  "/admin/departments",
  "/admin/teams",
  "/admin/audit-log",
  "/work-os/goodday-compliance",
  "/api/v1/work-os/accounts",
  "/api/v1/work-os/team",
  "/api/v1/work-os/rbac",
  "/api/v1/work-os/goodday-compliance"
)

Write-Host "SERVELECT WORK OS v5.9 smoke test" -ForegroundColor Cyan
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    Write-Host "OK $($response.StatusCode) $route" -ForegroundColor Green
  } catch {
    Write-Host "FAIL $route :: $($_.Exception.Message)" -ForegroundColor Red
  }
}
