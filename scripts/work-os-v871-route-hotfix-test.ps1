param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri/provider-mutation-replay",
  "/taskuri/live-provider-command-center",
  "/taskuri/pilot-mutation-replay",
  "/admin/live-provider-mutation-replay",
  "/admin/provider-credential-vault",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay"
)

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$Report = @()
$Report += "# v8.7.1 Route Completion Hotfix Functional Test"
$Report += ""
$Report += "BaseUrl: $BaseUrl"
$Report += ""
$Report += "| Route | Result | HTTP | Bytes | Note |"
$Report += "|---|---:|---:|---:|---|"

$passed = 0
foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45
    $status = [int]$response.StatusCode
    $bytes = [Text.Encoding]::UTF8.GetByteCount([string]$response.Content)
    if ($status -ge 200 -and $status -lt 300) {
      Write-Host "$route -> PASS HTTP $status | $bytes bytes"
      $Report += "| $route | PASS | $status | $bytes | OK |"
      $passed++
    } else {
      Write-Host "$route -> FAIL HTTP $status | $bytes bytes"
      $Report += "| $route | FAIL | $status | $bytes | Non-2xx |"
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)"
    $Report += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$Report += ""
$Report += "Passed: $passed / $($routes.Count)"
$ReportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v871-route-completion-hotfix-functional-routes.md"
$Report -join "`n" | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host "v8.7.1 route completion hotfix passed: $passed / $($routes.Count)"
Write-Host "Report: $ReportPath"
if ($passed -ne $routes.Count) { exit 1 }
