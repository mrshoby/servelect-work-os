param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/prisma-shadow",
  "/admin/task-completeness",
  "/api/v1/enterprise/prisma-shadow",
  "/api/v1/enterprise/prisma-shadow-health",
  "/api/v1/enterprise/prisma-shadow-plan",
  "/api/v1/enterprise/task-functionality-status",
  "/api/v1/tasks",
  "/api/v1/projects"
)

Write-Host "SERVELECT WORK OS v2.3 Prisma Shadow Mode Audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$results = @()

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $start = Get-Date

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $elapsed = [int]((Get-Date) - $start).TotalMilliseconds
    $results += [pscustomobject]@{
      route = $route
      status = [int]$response.StatusCode
      ms = $elapsed
      ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }
    Write-Host ("OK {0} {1}ms {2}" -f $response.StatusCode, $elapsed, $route) -ForegroundColor Green
  } catch {
    $elapsed = [int]((Get-Date) - $start).TotalMilliseconds
    $results += [pscustomobject]@{
      route = $route
      status = 0
      ms = $elapsed
      ok = $false
      error = $_.Exception.Message
    }
    Write-Host ("FAIL {0}ms {1} :: {2}" -f $elapsed, $route, $_.Exception.Message) -ForegroundColor Red
  }
}

$failed = $results | Where-Object { -not $_.ok }

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
$results | Format-Table -AutoSize

if ($failed.Count -gt 0) {
  throw "Audit failed: $($failed.Count) routes failed."
}

Write-Host "All v2.3 routes passed." -ForegroundColor Green
