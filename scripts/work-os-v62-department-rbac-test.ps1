param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os/department-command",
  "/work-os/department-task-routing",
  "/work-os/department-workload",
  "/work-os/department-approvals",
  "/admin/departments-v2",
  "/api/v1/work-os/departments",
  "/api/v1/work-os/departments/tasks?userId=u3",
  "/api/v1/work-os/departments/approvals",
  "/api/v1/work-os/departments/visibility?userId=u6&taskId=T-PRD-007",
  "/api/v1/work-os/departments/completion-status"
)

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host "Checking $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Route failed: $url status $($response.StatusCode)"
  }
}

Write-Host "V6.2 department RBAC smoke test passed." -ForegroundColor Green
