param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/auth-rbac",
  "/api/v1/enterprise/auth-rbac",
  "/api/v1/enterprise/auth-rbac-health",
  "/api/v1/enterprise/permission-matrix",
  "/admin/users",
  "/unauthorized"
)

Write-Host "SERVELECT WORK OS v1.5 Auth/RBAC readiness test" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

$results = foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    $sw.Stop()
    [pscustomobject]@{ Route = $route; Status = [int]$response.StatusCode; Ms = $sw.ElapsedMilliseconds; Ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400 }
  } catch {
    $sw.Stop()
    [pscustomobject]@{ Route = $route; Status = "ERR"; Ms = $sw.ElapsedMilliseconds; Ok = $false; Error = $_.Exception.Message }
  }
}

$results | Format-Table -AutoSize

if ($results | Where-Object { -not $_.Ok }) {
  throw "Auth/RBAC readiness test failed."
}

Write-Host "Auth/RBAC readiness test passed." -ForegroundColor Green
