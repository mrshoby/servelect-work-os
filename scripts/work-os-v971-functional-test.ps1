param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/program-board-v97",
  "/taskuri/workgraph-map-v97",
  "/taskuri/reporting-command-v97",
  "/taskuri/sla-evidence-report-v97",
  "/taskuri/resource-portfolio-v97",
  "/taskuri/executive-summary-v97",
  "/taskuri/saved-layouts-v97",
  "/admin/taskuri-reporting-governance-v97",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/health",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/program-board",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/workgraph",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/reporting",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/sla-evidence",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/resource-portfolio",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/saved-layouts",
  "/api/v1/work-os/v97-portfolio-workgraph-reporting-command/readiness"
)

$rows = @()
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $bytes = [Text.Encoding]::UTF8.GetByteCount($response.Content)
    if ($response.StatusCode -eq 200 -and $bytes -gt 20) {
      $passed++
      $rows += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      $rows += "| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected response |"
    }
  } catch {
    $rows += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report = @()
$report += "# v9.7.1 Visual Density Taskuri Workspace Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$report += $rows
$report += ""
$report += "Passed: $passed / $($routes.Count)"

$dir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$path = Join-Path $dir "v971-visual-density-taskuri-workspace-functional-routes.md"
$report | Set-Content -Path $path -Encoding UTF8

if ($passed -ne $routes.Count) {
  throw "v9.7.1 functional route/API smoke failed: $passed / $($routes.Count). Report: $path"
}
Write-Host "v9.7.1 Visual Density Taskuri Workspace smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $path"
