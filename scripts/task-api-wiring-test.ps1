param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/task-api-wiring",
  "/admin/release-status",
  "/changelog",
  "/api/v1/enterprise/task-api-wiring",
  "/api/v1/enterprise/task-api-wiring-health",
  "/api/v1/enterprise/task-ui-api-contract",
  "/api/v1/enterprise/task-api-wiring-plan",
  "/api/v1/enterprise/release-status",
  "/api/v1/enterprise/product-completion",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/taskuri"
)

Write-Host "SERVELECT WORK OS v2.6 task API wiring smoke test" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

$results = foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $sw = [Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    [pscustomobject]@{ Route = $route; Status = $response.StatusCode; Ms = $sw.ElapsedMilliseconds; Ok = $true }
  } catch {
    $sw.Stop()
    [pscustomobject]@{ Route = $route; Status = "ERR"; Ms = $sw.ElapsedMilliseconds; Ok = $false; Error = $_.Exception.Message }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok -or $_.Status -ge 400 }
if ($failed) {
  throw "v2.6 smoke test failed for one or more routes."
}

Write-Host "OK: v2.6 task API wiring routes responded." -ForegroundColor Green
