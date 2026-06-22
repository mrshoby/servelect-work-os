param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$checks = @(
  @{ Path = "/taskuri"; Marker = "data-v150-goodday-structural-parity" },
  @{ Path = "/taskuri"; Marker = "data-v190-goodday-inplace-runtime" },
  @{ Path = "/taskuri"; Marker = "Taskuri Workspace"; MustBeAbsent = $true },
  @{ Path = "/taskuri"; Marker = "WORKSPACE HIERARCHY"; MustBeAbsent = $true },
  @{ Path = "/taskuri/board"; Marker = "data-v190-goodday-inplace-runtime" },
  @{ Path = "/taskuri/tabel"; Marker = "data-v190-goodday-inplace-runtime" },
  @{ Path = "/taskuri/inbox"; Marker = "data-v190-goodday-inplace-runtime" },
  @{ Path = "/taskuri/workload"; Marker = "data-v190-goodday-inplace-runtime" },
  @{ Path = "/api/v1/work-os/v190-goodday-interaction-core"; Marker = "GOODDAY_IN_PLACE_INTERACTION_CORE_ON_V15_SHELL" },
  @{ Path = "/api/v1/work-os/v190-goodday-interaction-core/taskuri"; Marker = "REAL_LOCAL_PERSISTENT" }
)

$rows = foreach ($c in $checks) {
  $url = "$BaseUrl$($c.Path)"
  $html = (vercel curl $url | Out-String)
  $contains = $html.Contains($c.Marker)
  $pass = if ($c.MustBeAbsent) { -not $contains } else { $contains }
  [pscustomobject]@{ Page = $c.Path; Marker = $c.Marker; Expected = if ($c.MustBeAbsent) { "ABSENT" } else { "PRESENT" }; Pass = $pass }
}

$passed = ($rows | Where-Object { $_.Pass }).Count
$report = @()
$report += "# v19.0.2 Route/API Functional Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += "Passed: $passed / $($rows.Count)"
$report += ""
$report += "| Page | Marker | Expected | PASS/FAIL |"
$report += "|---|---|---:|---:|"
foreach ($r in $rows) { $report += "| $($r.Page) | $($r.Marker) | $($r.Expected) | $(if ($r.Pass) { 'PASS' } else { 'FAIL' }) |" }
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$report -join "`n" | Set-Content "audit-results\v1902-route-api-functional-test.md" -Encoding UTF8
$rows | Format-Table -AutoSize
if ($passed -ne $rows.Count) { throw "v19 route/API test failed: $passed / $($rows.Count)" }
