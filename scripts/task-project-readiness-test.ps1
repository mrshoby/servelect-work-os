param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/task-projects",
  "/api/v1/enterprise/task-project-persistence",
  "/api/v1/enterprise/task-project-health",
  "/api/v1/enterprise/task-project-schema",
  "/api/v1/enterprise/task-project-migration-plan",
  "/taskuri",
  "/proiecte",
  "/admin/auth-rbac",
  "/admin/database",
  "/admin/workgraph"
)

Write-Host "SERVELECT WORK OS v1.6 Task & Project Persistence readiness test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$results = foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    [PSCustomObject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Ms = $sw.ElapsedMilliseconds
      Ok = ([int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400)
    }
  } catch {
    $sw.Stop()
    [PSCustomObject]@{
      Route = $route
      Status = "ERR"
      Ms = $sw.ElapsedMilliseconds
      Ok = $false
      Error = $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }
if ($failed) {
  Write-Host "Unele rute au picat." -ForegroundColor Red
  exit 1
}

Write-Host "Toate rutele v1.6 au raspuns OK." -ForegroundColor Green
