param([string]$BaseUrl = "https://servelect-work-os-web.vercel.app")
$ErrorActionPreference = "Stop"
$routes = @("/taskuri/workspace-command", "/taskuri/action-board", "/taskuri/hierarchy-map-v91", "/taskuri/task-detail-v91", "/taskuri/workload-planner-v91", "/taskuri/time-tracking-v91", "/taskuri/updates-stream-v91", "/taskuri/request-intake-v91", "/admin/taskuri-workspace-governance", "/api/v1/work-os/v91-goodday-task-execution", "/api/v1/work-os/v91-goodday-task-execution/health", "/api/v1/work-os/v91-goodday-task-execution/action-required", "/api/v1/work-os/v91-goodday-task-execution/workload", "/api/v1/work-os/v91-goodday-task-execution/requests", "/api/v1/work-os/v91-goodday-task-execution/readiness")
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$rows = @(); $passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try { $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45; $ok = [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 400; if ($ok) { $passed++ }; $rows += [pscustomobject]@{ Route=$route; Result=$(if($ok){"PASS"}else{"FAIL"}); HTTP=[int]$response.StatusCode; Bytes=$response.RawContentLength; Note="OK" } } catch { $rows += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=0; Bytes=0; Note=$_.Exception.Message } }
}
$report = @("# v9.1.0 GoodDay-like Task Execution Functional Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
foreach ($row in $rows) { $note = ($row.Note -replace "\|", "/"); $report += "| $($row.Route) | $($row.Result) | $($row.HTTP) | $($row.Bytes) | $note |" }
$report += ""; $report += "Passed: $passed / $($routes.Count)"
$path = "audit-results\v910-goodday-task-execution-functional-routes.md"
Set-Content -LiteralPath $path -Value ($report -join "`n") -Encoding UTF8
Write-Host "v9.1.0 GoodDay-like Task Execution smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $((Resolve-Path $path).Path)"
if ($passed -ne $routes.Count) { throw "v9.1.0 functional route/API smoke failed: $passed / $($routes.Count)" }
