param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/real-task-ui-activation",
  "/api/v1/enterprise/real-task-ui-activation",
  "/api/v1/enterprise/real-task-ui-activation-health",
  "/api/v1/enterprise/real-task-ui-activation-contract",
  "/api/v1/enterprise/real-task-ui-activation-plan",
  "/api/v1/tasks",
  "/api/v1/projects"
)

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  Write-Host "$($response.StatusCode) $route" -ForegroundColor Green
}

$createUrl = $BaseUrl.TrimEnd('/') + "/api/v1/tasks"
$body = @{ title = "Smoke test v2.9 API UI"; priority = "Mediu"; status = "De făcut" } | ConvertTo-Json
Write-Host "POST $createUrl" -ForegroundColor Cyan
Invoke-WebRequest -Uri $createUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 30 | Out-Null
Write-Host "Task create smoke test OK" -ForegroundColor Green
