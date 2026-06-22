param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$rows = @(
  @{ Page="/taskuri"; Marker="data-v150-goodday-structural-parity"; Expected="PRESENT" },
  @{ Page="/taskuri"; Marker="data-v200-goodday-complete-interaction-layer"; Expected="PRESENT" },
  @{ Page="/taskuri"; Marker="Taskuri Workspace"; Expected="ABSENT" },
  @{ Page="/taskuri"; Marker="WORKSPACE HIERARCHY"; Expected="ABSENT" },
  @{ Page="/taskuri"; Marker="data-v160-real-provider-mutation"; Expected="ABSENT" },
  @{ Page="/taskuri/board"; Marker="data-v200-goodday-complete-interaction-layer"; Expected="PRESENT" },
  @{ Page="/taskuri/tabel"; Marker="data-v200-goodday-complete-interaction-layer"; Expected="PRESENT" },
  @{ Page="/taskuri/inbox"; Marker="data-v200-goodday-complete-interaction-layer"; Expected="PRESENT" },
  @{ Page="/taskuri/workload"; Marker="data-v200-goodday-complete-interaction-layer"; Expected="PRESENT" },
  @{ Page="/api/v1/work-os/v200-goodday-complete-interaction-layer"; Marker="GOODDAY_COMPLETE_INTERACTION_LAYER_ON_V15_SHELL"; Expected="PRESENT" },
  @{ Page="/api/v1/work-os/v200-goodday-complete-interaction-layer/taskuri"; Marker="REAL_LOCAL_PERSISTENT"; Expected="PRESENT" }
)

$results = foreach ($row in $rows) {
  $url = "$BaseUrl$($row.Page)"
  try {
    $html = (vercel curl $url | Out-String)
  } catch {
    $html = ""
  }
  $contains = $html.Contains($row.Marker)
  $pass = if ($row.Expected -eq "PRESENT") { $contains } else { -not $contains }
  [pscustomobject]@{
    Page = $row.Page
    Marker = $row.Marker
    Expected = $row.Expected
    Result = if ($pass) { "PASS" } else { "FAIL" }
  }
}

$passed = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$report = @()
$report += "# v20.0.0 Route/API Functional Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += "Passed: $passed / $($results.Count)"
$report += ""
$report += "| Page | Marker | Expected | PASS/FAIL |"
$report += "|---|---|---:|---:|"
foreach ($r in $results) {
  $report += "| $($r.Page) | $($r.Marker) | $($r.Expected) | $($r.Result) |"
}

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$path = "audit-results/v2000-route-api-functional-test.md"
$report | Set-Content $path -Encoding UTF8
$report | ForEach-Object { Write-Host $_ }

if ($passed -ne $results.Count) {
  throw "v20 route/API test failed: $passed / $($results.Count)"
}
