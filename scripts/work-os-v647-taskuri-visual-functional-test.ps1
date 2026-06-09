param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)
$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets",
  "/taskuri/tickets-notificari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar",
  "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari"
)
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  Write-Host "Checking $url"
  $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($res.StatusCode -lt 200 -or $res.StatusCode -ge 400) { throw "Route failed: $url status $($res.StatusCode)" }
}
Write-Host "v6.4.7 route smoke test passed." -ForegroundColor Green
