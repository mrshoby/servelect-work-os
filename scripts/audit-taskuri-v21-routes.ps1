param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Continue"
$routes = @(
  "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets",
  "/taskuri/tickets-notificari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar",
  "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari"
)
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$rows = @("# V21 Taskuri Route Audit", "", "BaseUrl: $BaseUrl", "", "| Route | HTTP | v20 runtime absent | v21 marker present | PASS/FAIL |", "|---|---:|---:|---:|---|")
$pass = 0
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $html = $res.Content
    $noV20 = $html -notmatch "v20 GoodDay runtime|V200GoodDayCompleteInteractionLayer|Provider canary|Provider pilot"
    $hasV21 = $html -match "v21.0.0|single Taskuri workspace|data-v21-taskuri-single-shell"
    $ok = $res.StatusCode -ge 200 -and $res.StatusCode -lt 400 -and $noV20 -and $hasV21
    if ($ok) { $pass++ }
    $rows += "| $route | $($res.StatusCode) | $noV20 | $hasV21 | $(if($ok){'PASS'}else{'FAIL'}) |"
  } catch {
    $rows += "| $route | ERR | false | false | FAIL: $($_.Exception.Message) |"
  }
}
$path = "audit-results\v21-taskuri-route-audit.md"
$rows | Set-Content $path -Encoding UTF8
Write-Host "v21 route audit: $pass / $($routes.Count) passed. Report: $path"
if ($pass -ne $routes.Count) { exit 1 }
