param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/timeline-dependencies-v94",
  "/taskuri/calendar-capacity-v94",
  "/taskuri/drawer-mutation-queue-v94",
  "/taskuri/approval-workflow-builder-v94",
  "/taskuri/task-template-recurrence-v94",
  "/taskuri/policy-contracts-v94",
  "/taskuri/gantt-readiness-v94",
  "/admin/taskuri-execution-governance-v94",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/health",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/timeline",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/calendar-capacity",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/mutation-queue",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/approval-workflows",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/templates",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/policy-contracts",
  "/api/v1/work-os/v94-goodday-timeline-drawer-mutation/readiness"
)

$results = @()
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $ok = [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 300
    $results += [pscustomobject]@{ Route=$route; Result= if ($ok) { "PASS" } else { "FAIL" }; HTTP=[int]$response.StatusCode; Bytes=$response.RawContentLength; Note="OK" }
  } catch {
    $status = 0
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { $status = [int]$_.Exception.Response.StatusCode }
    $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=$status; Bytes=0; Note=$_.Exception.Message }
  }
}

$pass = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$total = $results.Count
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report = @()
$report += "# v9.4.0 Timeline Drawer Mutation Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($r in $results) { $report += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $($r.Note) |" }
$report += ""
$report += "Passed: $pass / $total"
$reportPath = Join-Path "audit-results" "v940-timeline-drawer-mutation-functional-routes.md"
Set-Content -LiteralPath $reportPath -Value ($report -join "`n") -Encoding UTF8
Write-Host "v9.4.0 Timeline Drawer Mutation smoke passed: $pass / $total"
Write-Host "Report: $((Resolve-Path $reportPath).Path)"
if ($pass -ne $total) { exit 1 }
