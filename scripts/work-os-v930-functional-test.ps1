param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/workspace-overview-v93",
  "/taskuri/my-work-focus-v93",
  "/taskuri/keyboard-command-v93",
  "/taskuri/saved-view-policies-v93",
  "/taskuri/bulk-operations-v93",
  "/taskuri/drawer-flow-v93",
  "/taskuri/updates-notifications-v93",
  "/admin/taskuri-ux-governance-v93",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/health",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/saved-views",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/bulk-actions",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/keyboard",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/drawer",
  "/api/v1/work-os/v93-goodday-workspace-ux-hardening/readiness"
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
$report += "# v9.3.0 GoodDay-like Workspace UX Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($r in $results) { $report += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $($r.Note) |" }
$report += ""
$report += "Passed: $pass / $total"
$reportPath = Join-Path "audit-results" "v930-goodday-workspace-ux-functional-routes.md"
Set-Content -LiteralPath $reportPath -Value ($report -join "`n") -Encoding UTF8
Write-Host "v9.3.0 GoodDay-like Workspace UX smoke passed: $pass / $total"
Write-Host "Report: $((Resolve-Path $reportPath).Path)"
if ($pass -ne $total) { exit 1 }
