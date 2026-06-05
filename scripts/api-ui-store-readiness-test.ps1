param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/api-ui-store",
  "/api/v1/enterprise/api-ui-store",
  "/api/v1/enterprise/api-ui-store-health",
  "/api/v1/enterprise/api-ui-store-integration-plan",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/admin/task-crud",
  "/taskuri",
  "/proiecte"
)

Write-Host "SERVELECT WORK OS v1.8 API UI Store readiness test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$results = foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
    }
  } catch {
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      Status = 0
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = $false
      Error = $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }
$slow = $results | Where-Object { $_.Ms -gt 3000 }

if ($failed) {
  Write-Host "FAILED routes:" -ForegroundColor Red
  $failed | Format-Table -AutoSize
  exit 1
}

if ($slow) {
  Write-Host "Slow routes > 3000ms:" -ForegroundColor Yellow
  $slow | Format-Table -AutoSize
}

Write-Host "OK: v1.8 API-backed UI store routes respond." -ForegroundColor Green
