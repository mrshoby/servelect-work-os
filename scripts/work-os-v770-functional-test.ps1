param(
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$BypassSecret = $env:VERCEL_AUTOMATION_BYPASS_SECRET,
  [switch]$AllowDeploymentProtection401
)

$ErrorActionPreference = "Stop"

$Routes = @(
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/inbox",
  "/taskuri/tickets-notificari",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/taskuri/automations",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/goodday-observability",
  "/work-os/goodday-ui-parity",
  "/work-os/provider-rehearsal",
  "/work-os/primary-write-dry-run",
  "/api/v1/work-os/v77-goodday-ui-parity",
  "/api/v1/work-os/v77-goodday-ui-parity/health",
  "/api/v1/work-os/v77-goodday-ui-parity/observability"
)

$Headers = @{}
if (![string]::IsNullOrWhiteSpace($BypassSecret)) {
  $Headers["x-vercel-protection-bypass"] = $BypassSecret
}

$OutDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
$Report = Join-Path $OutDir "v770-goodday-ui-functional-routes.md"

$ProtectionHint = ""
if ($BaseUrl -like "*.vercel.app*" -and [string]::IsNullOrWhiteSpace($BypassSecret)) {
  $ProtectionHint = "No VERCEL_AUTOMATION_BYPASS_SECRET / -BypassSecret provided. If this deployment is protected by Vercel Authentication, route checks will return 401 even when the app is deployed correctly."
}

$Lines = @(
  "# v7.7.0 / v7.7.3 GoodDay UI Functional Route Smoke",
  "",
  "BaseUrl: $BaseUrl",
  "Bypass secret used: $([bool](![string]::IsNullOrWhiteSpace($BypassSecret)))",
  "AllowDeploymentProtection401: $([bool]$AllowDeploymentProtection401)",
  "",
  $ProtectionHint,
  "",
  "| Route | Result | HTTP | Bytes | Note |",
  "|---|---:|---:|---:|---|"
)

$Failed = 0
$Protected = 0

foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 25 -Headers $Headers
    $Bytes = if ($null -ne $Response.Content) { $Response.Content.Length } else { 0 }
    $Lines += "| $Route | PASS | $($Response.StatusCode) | $Bytes | OK |"
    Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
  } catch {
    $Status = 0
    try {
      if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
        $Status = [int]$_.Exception.Response.StatusCode
      }
    } catch {
      $Status = 0
    }

    if ($Status -eq 401 -and $BaseUrl -like "*.vercel.app*") {
      $Protected++
      $Note = "401 Unauthorized: likely Vercel Deployment Protection / Vercel Authentication. Use -BypassSecret or VERCEL_AUTOMATION_BYPASS_SECRET, or test an unprotected production alias."
      if ($AllowDeploymentProtection401) {
        $Lines += "| $Route | PROTECTED | 401 | 0 | $Note |"
        Write-Host "$Route -> PROTECTED 401 | $Note" -ForegroundColor Yellow
      } else {
        $Failed++
        $Lines += "| $Route | FAIL_PROTECTED | 401 | 0 | $Note |"
        Write-Host "$Route -> FAIL_PROTECTED 401 | $Note" -ForegroundColor Red
      }
    } else {
      $Failed++
      $Message = $_.Exception.Message.Replace("|", "/")
      $Lines += "| $Route | FAIL | $Status | 0 | $Message |"
      Write-Host "$Route -> FAIL | $Message" -ForegroundColor Red
    }
  }
}

$Lines | Set-Content -Path $Report -Encoding UTF8

if ($Failed -gt 0) {
  throw ("v7.7.0 functional route smoke failed: " + $Failed + " route(s). Protected 401 routes: " + $Protected + ". See " + $Report)
}

if ($Protected -gt 0 -and $AllowDeploymentProtection401) {
  Write-Host "v7.7.0 route smoke reached protected Vercel deployment: $Protected protected route(s). App routes were not validated because Vercel returned 401 before Next.js." -ForegroundColor Yellow
  Write-Host "Report: $Report"
  exit 0
}

Write-Host "v7.7.0 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $Report"
