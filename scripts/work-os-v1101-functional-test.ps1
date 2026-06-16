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
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/health",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/routes",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/scores",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/buttons",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/flows",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/readiness",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/workspace",
  "/api/v1/work-os/v110-major-taskuri-goodday-redesign/manual-ui"
)

$rows = New-Object System.Collections.Generic.List[string]
$rows.Add("# v11.0.1 Next.js 15 Route Context Hotfix Route/API Test")
$rows.Add("")
$rows.Add("BaseUrl: $BaseUrl")
$rows.Add("")
$rows.Add("| Route | Result | HTTP | Bytes | Note |")
$rows.Add("|---|---:|---:|---:|---|")

$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30
    $bytes = 0
    if ($null -ne $response.Content) { $bytes = $response.Content.Length }
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      $passed++
      $rows.Add("| $route | PASS | $($response.StatusCode) | $bytes | OK |")
    } else {
      $rows.Add("| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected status |")
    }
  } catch {
    $rows.Add("| $route | FAIL | ERR | 0 | $($_.Exception.Message) |")
  }
}

$rows.Add("")
$rows.Add("Passed: $passed / $($routes.Count)")

$auditDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $auditDir | Out-Null
$reportPath = Join-Path $auditDir "v1101-next15-route-context-hotfix-routes.md"
$rows | Set-Content -LiteralPath $reportPath -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v11.0.1 route/API smoke failed: $passed / $($routes.Count). Report: $reportPath"
}

Write-Host "v11.0.1 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
