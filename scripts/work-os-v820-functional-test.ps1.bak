param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Continue"
$Routes = @(
  "/taskuri"
  "/taskuri/overview"
  "/taskuri/my-work"
  "/taskuri/tickets-notificari"
  "/taskuri/board"
  "/taskuri/tabel"
  "/taskuri/calendar-gantt"
  "/taskuri/workload-aprobari"
  "/taskuri/forms"
  "/taskuri/timesheets"
  "/taskuri/reports"
  "/taskuri/automations"
  "/admin/workflows"
  "/admin/custom-fields"
  "/admin/primary-write-pilot"
  "/admin/production-pilot-readiness"
  "/admin/primary-write-session-provider"
  "/admin/auth-session-audit-outbox"
  "/work-os/primary-write-pilot"
  "/work-os/production-pilot-readiness"
  "/work-os/primary-write-session-provider"
  "/work-os/auth-session-audit-outbox"
  "/api/v1/work-os/v80-production-pilot"
  "/api/v1/work-os/v81-primary-write-session-provider"
  "/api/v1/work-os/v82-auth-audit-outbox"
  "/api/v1/work-os/v82-auth-audit-outbox/health"
  "/api/v1/work-os/v82-auth-audit-outbox/session-claims"
  "/api/v1/work-os/v82-auth-audit-outbox/audit-events"
  "/api/v1/work-os/v82-auth-audit-outbox/provider-outbox"
  "/api/v1/work-os/v82-auth-audit-outbox/policy-simulator"
  "/api/v1/work-os/v82-auth-audit-outbox/replay-drill"
)

$Passed = 0
$Rows = @()
foreach ($Route in $Routes) {
  $Url = $BaseUrl.TrimEnd('/') + $Route
  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
    $Bytes = if ($Response.Content) { $Response.Content.Length } else { 0 }
    if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 300) {
      $Passed++
      Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
      $Rows += "| $Route | PASS | $($Response.StatusCode) | $Bytes | OK |"
    } else {
      Write-Host "$Route -> FAIL HTTP $($Response.StatusCode)" -ForegroundColor Red
      $Rows += "| $Route | FAIL | $($Response.StatusCode) | $Bytes | Unexpected status |"
    }
  } catch {
    Write-Host "$Route -> FAIL $($_.Exception.Message)" -ForegroundColor Red
    $Rows += "| $Route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$Report = @()
$Report += "# v8.2.0 Auth Session Audit Outbox Functional Route/API Test"
$Report += ""
$Report += "BaseUrl: $BaseUrl"
$Report += "Passed: $Passed / $($Routes.Count)"
$Report += ""
$Report += "| Route | Result | HTTP | Bytes | Note |"
$Report += "|---|---:|---:|---:|---|"
$Report += $Rows
$Report -join "`n" | Set-Content "audit-results820-auth-audit-outbox-functional-routes.md" -Encoding UTF8
Write-Host "v8.2.0 functional route/API smoke passed: $Passed / $($Routes.Count)" -ForegroundColor Cyan
if ($Passed -ne $Routes.Count) { exit 1 }
