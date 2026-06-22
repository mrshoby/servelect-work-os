param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$results = @()

function Get-Text($Url) {
  $raw = vercel curl $Url | Out-String
  return $raw
}

function Add-Check($Page, $Marker, $Expected, $Text) {
  $contains = $Text.Contains($Marker)
  $pass = if ($Expected -eq "PRESENT") { $contains } else { -not $contains }
  $script:results += [pscustomobject]@{ Page = $Page; Marker = $Marker; Expected = $Expected; Result = if ($pass) { "PASS" } else { "FAIL" } }
}

$taskuri = Get-Text "$BaseUrl/taskuri"
$board = Get-Text "$BaseUrl/taskuri/board"
$tabel = Get-Text "$BaseUrl/taskuri/tabel"
$inbox = Get-Text "$BaseUrl/taskuri/inbox"
$workload = Get-Text "$BaseUrl/taskuri/workload"
$api = Get-Text "$BaseUrl/api/v1/work-os/v210-real-mutation-bridge"
$apiSection = Get-Text "$BaseUrl/api/v1/work-os/v210-real-mutation-bridge/taskuri"

Add-Check "/taskuri" "data-v150-goodday-structural-parity" "PRESENT" $taskuri
Add-Check "/taskuri" "data-v200-goodday-complete-interaction-layer" "PRESENT" $taskuri
Add-Check "/taskuri" "data-v210-goodday-real-mutation-bridge" "PRESENT" $taskuri
Add-Check "/taskuri" "Taskuri Workspace" "ABSENT" $taskuri
Add-Check "/taskuri" "WORKSPACE HIERARCHY" "ABSENT" $taskuri
Add-Check "/taskuri" "data-v160-real-provider-mutation" "ABSENT" $taskuri
Add-Check "/taskuri/board" "data-v210-goodday-real-mutation-bridge" "PRESENT" $board
Add-Check "/taskuri/tabel" "data-v210-goodday-real-mutation-bridge" "PRESENT" $tabel
Add-Check "/taskuri/inbox" "data-v210-goodday-real-mutation-bridge" "PRESENT" $inbox
Add-Check "/taskuri/workload" "data-v210-goodday-real-mutation-bridge" "PRESENT" $workload
Add-Check "/api/v1/work-os/v210-real-mutation-bridge" "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL" "PRESENT" $api
Add-Check "/api/v1/work-os/v210-real-mutation-bridge" "API_SHADOW_MUTATION_BRIDGE" "PRESENT" $api
Add-Check "/api/v1/work-os/v210-real-mutation-bridge/taskuri" "REAL_LOCAL_PERSISTENT" "PRESENT" $apiSection

$passed = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$md = "# v21.0.0 Route/API Functional Test`n`nBaseUrl: $BaseUrl`nPassed: $passed / $($results.Count)`n`n| Page | Marker | Expected | PASS/FAIL |`n|---|---|---:|---:|`n"
foreach ($r in $results) { $md += "| $($r.Page) | $($r.Marker) | $($r.Expected) | $($r.Result) |`n" }
New-Item -ItemType Directory -Path "audit-results" -Force | Out-Null
Set-Content -Path "audit-results/v2100-route-api-functional-test.md" -Value $md -Encoding UTF8
Write-Host $md
if ($passed -ne $results.Count) { throw "v21 route/API test failed: $passed / $($results.Count)" }
