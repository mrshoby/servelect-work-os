param([string]$BaseUrl = "https://servelect-work-os-web.vercel.app")
$ErrorActionPreference = "Stop"
function Test-Marker($Content, $Marker) {
  $decoded = [System.Net.WebUtility]::HtmlDecode($Content)
  return $Content.Contains($Marker) -or $decoded.Contains($Marker) -or $Content.Contains($Marker.Replace('&', '&amp;'))
}
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
  [pscustomobject]@{ Page=$c.Path; Marker=$c.Marker; PASS=(Test-Marker $content $c.Marker) }
}
$passed = ($rows | Where-Object PASS).Count
$report = @("# v17.0.1 Vercel Route/API Functional Test", "", "BaseUrl: $BaseUrl", "", "Note: HTML entities are decoded before marker matching, so `&amp;` is treated as `&`.", "", "| Page | Marker | PASS/FAIL |", "|---|---|---:|")
foreach ($row in $rows) { $report += "| $($row.Page) | $($row.Marker) | $(if($row.PASS){'PASS'}else{'FAIL'}) |" }
$report += ""
$report += "Passed: $passed / $($rows.Count)"
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
$report | Set-Content "audit-results/v1701-route-api-functional-test.md"
$report -join "`n"
if ($passed -lt $rows.Count) { throw "v17.0.1 route/API test failed: $passed / $($rows.Count)" }
