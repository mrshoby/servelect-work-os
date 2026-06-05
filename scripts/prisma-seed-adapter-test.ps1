param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/prisma-seed-execution",
  "/admin/release-status",
  "/changelog",
  "/api/v1/enterprise/prisma-seed-execution",
  "/api/v1/enterprise/prisma-seed-execution-health",
  "/api/v1/enterprise/repository-adapter-plan",
  "/api/v1/enterprise/release-status",
  "/api/v1/enterprise/release-changelog",
  "/api/v1/enterprise/product-completion",
  "/api/v1/enterprise/next-updates"
)

Write-Host "SERVELECT WORK OS v2.4 Prisma Seed Adapter Test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$failed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    $sw.Stop()
    $ms = [Math]::Round($sw.Elapsed.TotalMilliseconds)
    if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 400) {
      Write-Host "OK $($res.StatusCode) $ms ms $route" -ForegroundColor Green
    } else {
      Write-Host "BAD $($res.StatusCode) $ms ms $route" -ForegroundColor Yellow
      $failed++
    }
  } catch {
    $sw.Stop()
    Write-Host "FAIL $route :: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
  }
}

if ($failed -gt 0) {
  throw "$failed route(s) failed."
}

Write-Host "All v2.4 routes passed." -ForegroundColor Green
