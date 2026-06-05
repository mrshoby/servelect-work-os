param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/db-provider",
  "/api/v1/enterprise/db-provider",
  "/api/v1/enterprise/db-provider-health",
  "/api/v1/enterprise/db-provider-runtime-plan",
  "/api/v1/enterprise/prisma-runtime-checklist",
  "/api/v1/tasks",
  "/api/v1/projects"
)

Write-Host "SERVELECT WORK OS v2.1 DB Provider Runtime audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$results = foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 25
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      StatusCode = [int]$response.StatusCode
      Ms = $sw.ElapsedMilliseconds
      Ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }
  } catch {
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      StatusCode = 0
      Ms = $sw.ElapsedMilliseconds
      Ok = $false
      Error = $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }
if ($failed) {
  throw "DB Provider Runtime audit failed for $($failed.Count) route(s)."
}

Write-Host "DB Provider Runtime audit passed." -ForegroundColor Green
