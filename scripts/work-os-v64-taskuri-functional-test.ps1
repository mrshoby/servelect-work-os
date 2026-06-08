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

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host ('GET ' + $url) -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw ('Route failed: ' + $url + ' status=' + $response.StatusCode)
  }
}

Write-Host 'v6.4 Taskuri functional routes OK.' -ForegroundColor Green
