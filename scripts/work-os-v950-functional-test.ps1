param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/collaboration-hub-v95",
  "/taskuri/checklists-quality-v95",
  "/taskuri/files-evidence-v95",
  "/taskuri/sla-escalation-v95",
  "/taskuri/workload-forecast-v95",
  "/taskuri/decision-register-v95",
  "/taskuri/request-portal-bridge-v95",
  "/admin/taskuri-collaboration-governance-v95",
  "/api/v1/work-os/v95-goodday-collaboration-sla",
  "/api/v1/work-os/v95-goodday-collaboration-sla/health",
  "/api/v1/work-os/v95-goodday-collaboration-sla/collaboration",
  "/api/v1/work-os/v95-goodday-collaboration-sla/checklists",
  "/api/v1/work-os/v95-goodday-collaboration-sla/files",
  "/api/v1/work-os/v95-goodday-collaboration-sla/sla",
  "/api/v1/work-os/v95-goodday-collaboration-sla/workload",
  "/api/v1/work-os/v95-goodday-collaboration-sla/decisions",
  "/api/v1/work-os/v95-goodday-collaboration-sla/readiness"
)

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report = @("# v9.5.0 GoodDay Collaboration Files SLA Functional Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $bytes = $response.RawContentLength
    if ($response.StatusCode -eq 200) {
      $passed++
      $report += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      $report += "| $route | FAIL | $($response.StatusCode) | $bytes | Unexpected status |"
    }
  } catch {
    $report += "| $route | FAIL | 0 | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}
$report += ""
$report += "Passed: $passed / $($routes.Count)"
$path = "audit-results\v950-goodday-collaboration-sla-functional-routes.md"
$report | Set-Content -Path $path -Encoding UTF8
Write-Host "v9.5.0 GoodDay Collaboration Files SLA smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $(Resolve-Path $path)"
if ($passed -ne $routes.Count) { exit 1 }
