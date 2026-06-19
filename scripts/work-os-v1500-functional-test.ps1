param(
  [string]$BaseUrl = "https://servelect-work-os-lxxm5kbbk-mrshoby1.vercel.app"
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
  "/api/v1/work-os/v150-goodday-structural-taskuri",
  "/api/v1/work-os/v150-goodday-structural-taskuri/health",
  "/api/v1/work-os/v150-goodday-structural-taskuri/routes",
  "/api/v1/work-os/v150-goodday-structural-taskuri/scores",
  "/api/v1/work-os/v150-goodday-structural-taskuri/buttons",
  "/api/v1/work-os/v150-goodday-structural-taskuri/flows",
  "/api/v1/work-os/v150-goodday-structural-taskuri/readiness",
  "/api/v1/work-os/v150-goodday-structural-taskuri/workspace",
  "/api/v1/work-os/v150-goodday-structural-taskuri/visual-audit",
  "/api/v1/work-os/v150-goodday-structural-taskuri/gap-matrix",
  "/api/v1/work-os/v150-goodday-structural-taskuri/screenshots",
  "/api/v1/work-os/v150-goodday-structural-taskuri/static-ui",
  "/api/v1/work-os/v150-goodday-structural-taskuri/design-system"
)

$results = @()
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 300
    $results += [pscustomobject]@{ Route = $route; Result = if ($ok) { "PASS" } else { "FAIL" }; HTTP = $response.StatusCode; Bytes = $response.Content.Length; Note = "OK" }
  } catch {
    $results += [pscustomobject]@{ Route = $route; Result = "FAIL"; HTTP = 0; Bytes = 0; Note = $_.Exception.Message }
  }
}

$passed = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$reportDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$reportPath = Join-Path $reportDir "v1500-goodday-structural-taskuri-routes.md"
$lines = @("# v15.0.0 GoodDay Structural Taskuri Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
foreach ($r in $results) { $lines += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $($r.Note -replace '\|','/') |" }
$lines += ""
$lines += "Passed: $passed / $($routes.Count)"
Set-Content -LiteralPath $reportPath -Value ($lines -join "`n") -Encoding UTF8
if ($passed -ne $routes.Count) { throw "v15.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $reportPath" }
Write-Host "v15.0.0 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
