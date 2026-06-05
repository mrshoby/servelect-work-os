param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/",
  "/taskuri",
  "/proiecte",
  "/enterprise",
  "/admin/performance",
  "/admin/database",
  "/admin/workgraph",
  "/admin/auth-rbac",
  "/admin/task-projects",
  "/admin/task-crud",
  "/admin/api-ui-store",
  "/admin/ui-task-store",
  "/admin/beta-stabilization",
  "/api/v1/tasks",
  "/api/v1/projects",
  "/api/v1/enterprise/beta-stabilization",
  "/api/v1/enterprise/beta-health",
  "/api/v1/enterprise/beta-route-audit",
  "/api/v1/enterprise/beta-release-checklist"
)

$results = @()

foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 25 -UseBasicParsing
    $sw.Stop()
    $results += [pscustomobject]@{
      Route = $route
      StatusCode = [int]$response.StatusCode
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = ([int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400)
    }
  } catch {
    $sw.Stop()
    $results += [pscustomobject]@{
      Route = $route
      StatusCode = 0
      Ms = [int]$sw.ElapsedMilliseconds
      Ok = $false
      Error = $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { -not $_.Ok }
$slow = $results | Where-Object { $_.Ms -gt 2500 }

if ($failed.Count -gt 0) {
  Write-Host "\nFAILED ROUTES:" -ForegroundColor Red
  $failed | Format-Table -AutoSize
  exit 1
}

if ($slow.Count -gt 0) {
  Write-Host "\nSLOW ROUTES (>2500ms):" -ForegroundColor Yellow
  $slow | Format-Table -AutoSize
}

Write-Host "\nBeta stabilization smoke test completed." -ForegroundColor Green
