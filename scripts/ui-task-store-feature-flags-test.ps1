param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/ui-task-store",
  "/api/v1/enterprise/ui-task-store-flags",
  "/api/v1/enterprise/ui-task-store-health",
  "/api/v1/enterprise/ui-task-store-integration-plan",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/taskuri",
  "/proiecte"
)

Write-Host "SERVELECT WORK OS v1.9 UI Task Store Feature Flags audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

$results = @()

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()

    $results += [pscustomobject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Ms = $sw.ElapsedMilliseconds
      Ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }

    Write-Host ("OK {0} {1}ms {2}" -f $response.StatusCode, $sw.ElapsedMilliseconds, $route) -ForegroundColor Green
  } catch {
    $sw.Stop()

    $results += [pscustomobject]@{
      Route = $route
      Status = 0
      Ms = $sw.ElapsedMilliseconds
      Ok = $false
      Error = $_.Exception.Message
    }

    Write-Host ("FAIL {0}ms {1} :: {2}" -f $sw.ElapsedMilliseconds, $route, $_.Exception.Message) -ForegroundColor Red
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }

if ($failed.Count -gt 0) {
  throw "UI Task Store Feature Flags audit failed on $($failed.Count) route(s)."
}

Write-Host "Audit OK." -ForegroundColor Green
