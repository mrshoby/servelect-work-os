param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/inbox",
  "/taskuri/tickets",
  "/taskuri/tickets-notificari",
  "/taskuri/proiecte-active",
  "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/table",
  "/taskuri/calendar",
  "/taskuri/calendar-gantt",
  "/taskuri/workload",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/taskuri/automations",
  "/api/v1/work-os/v100-goodday-ui-functional-parity",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/health",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/routes",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/scores",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/buttons",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/flows",
  "/api/v1/work-os/v100-goodday-ui-functional-parity/readiness"
)

$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30
    $bytes = if ($response.Content) { $response.Content.Length } else { 0 }
    $status = [int]$response.StatusCode
    if ($status -ge 200 -and $status -lt 400) {
      $result = "PASS"
      $passed++
      $note = "OK"
    } else {
      $result = "FAIL"
      $note = "HTTP $status"
    }
  } catch {
    $status = "ERR"
    $bytes = 0
    $result = "FAIL"
    $note = $_.Exception.Message
  }
  $rows += "| $route | $result | $status | $bytes | $note |"
}

$dir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$path = Join-Path $dir "v1003-table-api-build-fix-routes.md"
$report = @(
  "# v10.0.3 Table/API Build Fix Route/API Test",
  "",
  "BaseUrl: $BaseUrl",
  "",
  "| Route | Result | HTTP | Bytes | Note |",
  "|---|---:|---:|---:|---|"
) + $rows + @("", "Passed: $passed / $($routes.Count)")
$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v10.0.3 route/API smoke failed: $passed / $($routes.Count). Report: $path"
}

Write-Host "v10.0.3 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
