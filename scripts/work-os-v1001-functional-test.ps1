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

$auditDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $auditDir | Out-Null
$path = Join-Path $auditDir "v1001-route-api-completion-hotfix-routes.md"

$rows = @()
$passed = 0

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5
    $bytes = ([Text.Encoding]::UTF8.GetByteCount($response.Content))
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $rows += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
      $passed++
    } else {
      $rows += "| $route | FAIL | $($response.StatusCode) | $bytes | HTTP not successful |"
    }
  } catch {
    $rows += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report = @(
  "# v10.0.1 Route/API Completion Hotfix Test",
  "",
  "BaseUrl: $BaseUrl",
  "",
  "| Route | Result | HTTP | Bytes | Note |",
  "|---|---:|---:|---:|---|"
) + $rows + @(
  "",
  "Passed: $passed / $($routes.Count)",
  "",
  "Manual UI density remains a separate acceptance gate and must not be inferred from this route/API result."
)

$report | Set-Content -LiteralPath $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v10.0.1 route/API hotfix smoke failed: $passed / $($routes.Count). Report: $path"
}

Write-Host "v10.0.1 route/API hotfix smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
