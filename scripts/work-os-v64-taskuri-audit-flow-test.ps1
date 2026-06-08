param(
  [string]$BaseUrl = 'https://servelect-work-os-web.vercel.app'
)

$ErrorActionPreference = 'Stop'
$routes = @(
  '/taskuri',
  '/taskuri/my-work',
  '/taskuri/inbox',
  '/taskuri/tickets',
  '/taskuri/proiecte-active',
  '/taskuri/proiecte-viitoare',
  '/taskuri/proiecte-finalizate',
  '/taskuri/board',
  '/taskuri/tabel',
  '/taskuri/calendar',
  '/taskuri/workload',
  '/api/v1/work-os/taskuri-v64'
)

Write-Host '=== SERVELECT WORK OS v6.4.2 Taskuri route smoke test ===' -ForegroundColor Cyan
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      Write-Host ('PASS ' + $response.StatusCode + ' ' + $route) -ForegroundColor Green
    } else {
      Write-Host ('FAIL ' + $response.StatusCode + ' ' + $route) -ForegroundColor Red
    }
  } catch {
    Write-Host ('FAIL ' + $route + ' :: ' + $_.Exception.Message) -ForegroundColor Red
  }
}
