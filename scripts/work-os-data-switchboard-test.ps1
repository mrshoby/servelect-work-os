param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/work-os/data-switchboard",
  "/admin/work-os-data-switchboard",
  "/api/v1/work-os/data-switchboard"
)

Write-Host "Testing SERVELECT WORK OS v5.7 data switchboard at $BaseUrl" -ForegroundColor Cyan
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Method GET
  Write-Host "$($response.StatusCode) $route" -ForegroundColor Green
}

$mutation = Invoke-WebRequest -Uri "$BaseUrl/api/v1/work-os/data-switchboard/mutations" -UseBasicParsing -Method POST -ContentType "application/json" -Body '{"domain":"tasks","title":"Smoke test shadow mutation","actor":"QA"}'
Write-Host "$($mutation.StatusCode) POST /api/v1/work-os/data-switchboard/mutations" -ForegroundColor Green
