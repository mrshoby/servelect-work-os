param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)
$ErrorActionPreference = "Stop"
$routes = @(
  "/api/v1/work-os/v160-real-provider-mutation-taskuri",
  "/api/v1/work-os/v160-real-provider-mutation-taskuri/provider",
  "/api/v1/work-os/v160-real-provider-mutation-taskuri/board",
  "/api/v1/work-os/v160-real-provider-mutation-taskuri/gantt",
  "/api/v1/work-os/v160-real-provider-mutation-taskuri/rbac",
  "/taskuri",
  "/taskuri/board",
  "/taskuri/calendar-gantt",
  "/taskuri/workload",
  "/taskuri/tabel",
  "/taskuri/timesheets"
)
$rows = @()
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $content = (vercel curl $url | Out-String)
    $ok = $content.Contains("16.0.0") -or $content.Contains("data-v160-real-provider-mutation") -or $content.Contains("REAL_PROVIDER_MUTATION_DRAG_GANTT_RBAC_QA")
    $rows += [pscustomobject]@{ Route = $route; Pass = $ok; Note = if ($ok) { "v16 marker/API found" } else { "missing v16 marker" } }
  } catch {
    $rows += [pscustomobject]@{ Route = $route; Pass = $false; Note = $_.Exception.Message }
  }
}
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report = @("# v16.0.0 Route/API Functional Test", "", "BaseUrl: $BaseUrl", "", "| Route | PASS/FAIL | Notes |", "|---|---:|---|")
foreach ($row in $rows) { $report += "| $($row.Route) | $(if ($row.Pass) { 'PASS' } else { 'FAIL' }) | $($row.Note) |" }
$passed = ($rows | Where-Object { $_.Pass }).Count
$report += ""
$report += "Passed: $passed / $($rows.Count)"
$report | Set-Content -Path "audit-results\v1600-route-api-functional-test.md" -Encoding UTF8
$rows | Format-Table -AutoSize
if ($passed -ne $rows.Count) { throw "v16 route/API test failed: $passed / $($rows.Count)" }
