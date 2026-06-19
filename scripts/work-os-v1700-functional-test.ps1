param([string]$BaseUrl = "https://servelect-work-os-web.vercel.app")
$ErrorActionPreference = "Stop"
$checks = @(
  @{Path="/taskuri"; Marker="data-v170-goodday-functional-parity"},
  @{Path="/taskuri/board"; Marker="Board / Kanban"},
  @{Path="/taskuri/tabel"; Marker="Enterprise Table"},
  @{Path="/taskuri/inbox"; Marker="Inbox & Action Required"},
  @{Path="/taskuri/workload"; Marker="Capacity planner"},
  @{Path="/api/v1/work-os/v170-goodday-functional-parity"; Marker="GOODDAY_FUNCTIONAL_PARITY_ON_V15_BASELINE"}
)
$rows = foreach ($c in $checks) {
  $content = (vercel curl "$BaseUrl$($c.Path)" | Out-String)
  [pscustomobject]@{ Page=$c.Path; Marker=$c.Marker; PASS=$content.Contains($c.Marker) }
}
$passed = ($rows | Where-Object PASS).Count
$report = @("# v17.0.0 Vercel Route/API Functional Test", "", "BaseUrl: $BaseUrl", "", "| Page | Marker | PASS/FAIL |", "|---|---|---:|")
foreach ($row in $rows) { $report += "| $($row.Page) | $($row.Marker) | $(if($row.PASS){'PASS'}else{'FAIL'}) |" }
$report += ""
$report += "Passed: $passed / $($rows.Count)"
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
$report | Set-Content "audit-results/v1700-route-api-functional-test.md"
$report -join "`n"
if ($passed -lt $rows.Count) { throw "v17 route/API test failed: $passed / $($rows.Count)" }
