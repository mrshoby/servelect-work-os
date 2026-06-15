param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)
$ErrorActionPreference = "Stop"

$Routes = @(
  "/taskuri",
  "/taskuri/command-center-v90",
  "/taskuri/pilot-cutover-console",
  "/taskuri/action-required",
  "/taskuri/workload-capacity-map",
  "/work-os/production-pilot-cutover",
  "/admin/release",
  "/api/v1/release/manifest",
  "/api/v1/release/checklist",
  "/api/v1/work-os/v90-production-pilot-cutover",
  "/api/v1/work-os/v90-production-pilot-cutover/release-readiness"
)

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$Report = @("# v9.0.1 Navigation + Version Truth Functional Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
$Passed = 0
foreach ($Route in $Routes) {
  $Url = $BaseUrl.TrimEnd('/') + $Route
  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 45
    $Code = [int]$Response.StatusCode
    $Bytes = ([Text.Encoding]::UTF8.GetBytes($Response.Content)).Length
    $HasStale = $Response.Content -match "v7\.9\.0|Unified Taskuri Navigation / Release Truth Fix"
    if ($Code -ge 200 -and $Code -lt 300 -and -not $HasStale) {
      $Passed++
      $Report += "| $Route | PASS | $Code | $Bytes | OK |"
    } elseif ($HasStale) {
      $Report += "| $Route | FAIL | $Code | $Bytes | Stale v9.0.1 label found |"
    } else {
      $Report += "| $Route | FAIL | $Code | $Bytes | Non-2xx |"
    }
  } catch {
    $Report += "| $Route | FAIL | 0 | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}
$Report += ""
$Report += "Passed: $Passed / $($Routes.Count)"
$ReportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v901-navigation-version-functional-routes.md"
$Report -join "`n" | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host ($Report -join "`n")
if ($Passed -ne $Routes.Count) { exit 1 }

