
param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)
$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri",
  "/taskuri/provider-mutation-replay",
  "/taskuri/live-provider-command-center",
  "/taskuri/pilot-mutation-replay",
  "/api/v1/work-os/v90-production-pilot-cutover/health"
)
$badStrings = @(
  "v7.9.0 · Provider Canary / ACL / Primary Pilot",
  "Provider Canary / ACL / Primary Pilot",
  "hidden w-72 shrink-0 flex-col"
)
$results = @()
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35
    $body = [string]$response.Content
    $bad = @($badStrings | Where-Object { $body -like "*$_*" })
    $ok = ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300 -and $bad.Count -eq 0)
    $results += [pscustomobject]@{ Route=$route; Result= if($ok){"PASS"}else{"FAIL"}; HTTP=$response.StatusCode; Bytes=$body.Length; Note= if($bad.Count){"Forbidden: " + ($bad -join ", ")}else{"OK"} }
  } catch {
    $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=0; Bytes=0; Note=$_.Exception.Message }
  }
}
$dir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$reportPath = Join-Path $dir "v904-unified-navigation-shell-functional-routes.md"
$lines = @("# v9.0.4 Unified Taskuri Navigation Shell Live Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
foreach ($r in $results) { $lines += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $($r.Note) |" }
$passed = @($results | Where-Object { $_.Result -eq "PASS" }).Count
$lines += ""
$lines += "Passed: $passed / $($routes.Count)"
$lines -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "v9.0.4 navigation shell live test passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
if ($passed -ne $routes.Count) { throw "v9.0.4 navigation shell live test failed: $passed / $($routes.Count)" }
