param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/workgraph",
  "/api/v1/enterprise/workgraph",
  "/api/v1/enterprise/workgraph-health",
  "/api/v1/enterprise/workgraph-migration-plan",
  "/admin/database",
  "/api/v1/enterprise/database-activation",
  "/taskuri",
  "/enterprise"
)

$results = @()

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    $results += [pscustomobject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }
  } catch {
    $sw.Stop()
    $results += [pscustomobject]@{
      Route = $route
      Status = "ERROR"
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = $false
    }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }
if ($failed.Count -gt 0) {
  throw "WorkGraph readiness test failed for $($failed.Count) route(s)."
}

Write-Host "WorkGraph readiness test passed." -ForegroundColor Green
