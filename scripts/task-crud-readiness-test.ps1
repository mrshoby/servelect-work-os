param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/task-crud",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/api/v1/enterprise/task-crud",
  "/api/v1/enterprise/task-crud-health",
  "/api/v1/enterprise/task-crud-schema"
)

Write-Host "SERVELECT WORK OS v1.7 Task CRUD readiness test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan
Write-Host ""

$results = @()

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    $ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    $results += [pscustomobject]@{ Route = $route; Status = $response.StatusCode; Ms = $sw.ElapsedMilliseconds; OK = $ok }
    $color = if ($ok) { "Green" } else { "Red" }
    Write-Host ("{0,-48} {1,5} {2,6}ms" -f $route, $response.StatusCode, $sw.ElapsedMilliseconds) -ForegroundColor $color
  } catch {
    $sw.Stop()
    $results += [pscustomobject]@{ Route = $route; Status = "ERR"; Ms = $sw.ElapsedMilliseconds; OK = $false }
    Write-Host ("{0,-48} {1,5} {2,6}ms" -f $route, "ERR", $sw.ElapsedMilliseconds) -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor DarkRed
  }
}

Write-Host ""
$failed = $results | Where-Object { -not $_.OK }
if ($failed) {
  Write-Host "FAILED routes:" -ForegroundColor Red
  $failed | Format-Table -AutoSize
  exit 1
}

Write-Host "All v1.7 Task CRUD routes are reachable." -ForegroundColor Green
