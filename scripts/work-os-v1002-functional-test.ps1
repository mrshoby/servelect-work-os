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
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $status = [int]$response.StatusCode
    $bytes = [Text.Encoding]::UTF8.GetByteCount([string]$response.Content)
    if ($status -ge 200 -and $status -lt 300) {
      $passed++
      $rows += "| $route | PASS | $status | $bytes | OK |"
    } else {
      $rows += "| $route | FAIL | $status | $bytes | Non-2xx |"
    }
  } catch {
    $message = $_.Exception.Message.Replace("|", "/")
    $rows += "| $route | FAIL | ERR | 0 | $message |"
  }
}

$auditDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $auditDir | Out-Null
$path = Join-Path $auditDir "v1002-route-api-build-import-hotfix-routes.md"

$report = @()
$report += "# v10.0.2 Route/API + Table Import Build Hotfix Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$report += $rows
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v10.0.2 route/API hotfix smoke failed: $passed / $($routes.Count). Report: $path"
}

Write-Host "v10.0.2 route/API hotfix smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
