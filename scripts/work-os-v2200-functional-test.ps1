param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

function Get-UrlText([string]$Url) {
  $Output = vercel curl $Url 2>$null | Out-String
  return $Output
}

$checks = @(
  @{ Page = "/taskuri"; Marker = "data-v150-goodday-structural-parity"; Expected = "PRESENT" },
  @{ Page = "/taskuri"; Marker = "data-v200-goodday-complete-interaction-layer"; Expected = "PRESENT" },
  @{ Page = "/taskuri"; Marker = "data-v210-goodday-real-mutation-bridge"; Expected = "PRESENT" },
  @{ Page = "/taskuri"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri"; Marker = "Taskuri Workspace"; Expected = "ABSENT" },
  @{ Page = "/taskuri"; Marker = "WORKSPACE HIERARCHY"; Expected = "ABSENT" },
  @{ Page = "/taskuri"; Marker = "data-v160-real-provider-mutation"; Expected = "ABSENT" },
  @{ Page = "/taskuri/board"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri/tabel"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri/inbox"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri/workload"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri/calendar-gantt"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/taskuri/timesheets"; Marker = "data-v220-goodday-frontend-acceptance"; Expected = "PRESENT" },
  @{ Page = "/api/v1/work-os/v220-goodday-frontend-acceptance"; Marker = "GOODDAY_FRONTEND_ACCEPTANCE_LAYER"; Expected = "PRESENT" },
  @{ Page = "/api/v1/work-os/v220-goodday-frontend-acceptance"; Marker = "REAL_VISIBLE_INTERACTION_CONTRACT"; Expected = "PRESENT" },
  @{ Page = "/api/v1/work-os/v220-goodday-frontend-acceptance"; Marker = "API_SHADOW_MUTATION_BRIDGE"; Expected = "PRESENT" },
  @{ Page = "/api/v1/work-os/v220-goodday-frontend-acceptance"; Marker = "REAL_LOCAL_PERSISTENT"; Expected = "PRESENT" },
  @{ Page = "/api/v1/work-os/v220-goodday-frontend-acceptance/taskuri"; Marker = "REAL_LOCAL_PERSISTENT"; Expected = "PRESENT" }
)

$cache = @{}
$results = @()
foreach ($check in $checks) {
  $url = "$BaseUrl$($check.Page)"
  if (-not $cache.ContainsKey($url)) {
    $cache[$url] = Get-UrlText $url
  }
  $html = $cache[$url]
  $contains = $html.Contains($check.Marker)
  $pass = if ($check.Expected -eq "PRESENT") { $contains } else { -not $contains }
  $results += [pscustomobject]@{
    Page = $check.Page
    Marker = $check.Marker
    Expected = $check.Expected
    Result = if ($pass) { "PASS" } else { "FAIL" }
  }
}

$passed = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$lines = @(
  "# v22.0.0 Route/API Functional Test",
  "",
  "BaseUrl: $BaseUrl",
  "Passed: $passed / $($results.Count)",
  "",
  "| Page | Marker | Expected | PASS/FAIL |",
  "|---|---|---:|---:|"
)
foreach ($result in $results) {
  $lines += "| $($result.Page) | $($result.Marker) | $($result.Expected) | $($result.Result) |"
}
$report = $lines -join "`n"
Write-Host $report
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
Set-Content -LiteralPath "audit-results\v2200-route-api-functional-test.md" -Value $report -Encoding UTF8

if ($passed -ne $results.Count) {
  throw "v22 route/API test failed: $passed / $($results.Count)"
}
