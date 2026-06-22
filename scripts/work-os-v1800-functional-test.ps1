param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$checks = @(
  @{ Path = "/taskuri"; Marker = "data-v150-goodday-structural-parity"; MustNot = "Taskuri Workspace" },
  @{ Path = "/taskuri"; Marker = "data-v180-procurement-functional-flow"; MustNot = "WORKSPACE HIERARCHY" },
  @{ Path = "/taskuri/inbox"; Marker = "data-v180-procurement-functional-flow"; MustNot = "data-v170-goodday-functional-parity" },
  @{ Path = "/api/v1/work-os/v180-procurement-flow"; Marker = "PROCUREMENT_COSTURI_ACHIZITII_BUGETARE_FULL_FLOW_ON_V15_BASELINE"; MustNot = "STATIC_UI" }
)
$rows = foreach ($c in $checks) {
  $html = (vercel curl "$BaseUrl$($c.Path)" | Out-String)
  [pscustomobject]@{
    Page = $c.Path
    Marker = $c.Marker
    HasMarker = $html.Contains($c.Marker)
    ForbiddenAbsent = -not $html.Contains($c.MustNot)
    PASS = $html.Contains($c.Marker) -and (-not $html.Contains($c.MustNot))
  }
}
$rows | Format-Table -AutoSize
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
$report = @("# v18.0.0 Route/API Functional Test", "", "BaseUrl: $BaseUrl", "", "| Page | Marker | Forbidden absent | PASS/FAIL |", "|---|---|---:|---:|")
foreach ($r in $rows) { $report += "| $($r.Page) | $($r.Marker) | $($r.ForbiddenAbsent) | $(if ($r.PASS) { 'PASS' } else { 'FAIL' }) |" }
$passed = @($rows | Where-Object { $_.PASS }).Count
$report += ""
$report += "Passed: $passed / $($rows.Count)"
$report | Set-Content "audit-results\v1800-route-api-functional-test.md" -Encoding UTF8
if ($passed -ne $rows.Count) { throw "v18 route/API test failed: $passed / $($rows.Count)" }
