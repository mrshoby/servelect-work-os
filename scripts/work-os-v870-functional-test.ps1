param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Continue"
$Routes = @("/taskuri","/taskuri/overview","/taskuri/my-work","/taskuri/tickets-notificari","/taskuri/board","/taskuri/tabel","/taskuri/calendar-gantt","/taskuri/workload-aprobari","/taskuri/forms","/taskuri/timesheets","/taskuri/reports","/taskuri/automations","/taskuri/enterprise-control-room","/taskuri/provider-mutation-replay","/taskuri/live-provider-command-center","/taskuri/pilot-mutation-replay","/admin/workflows","/admin/custom-fields","/admin/primary-write-pilot","/admin/production-pilot-readiness","/admin/primary-write-session-provider","/admin/auth-session-audit-outbox","/admin/prisma-audit-outbox-transaction-pilot","/admin/database-adapter-dispatch-worker","/admin/enterprise-department-suite","/admin/auth-rls-department-pilot","/admin/live-provider-mutation-replay","/admin/provider-credential-vault","/work-os/primary-write-pilot","/work-os/production-pilot-readiness","/work-os/primary-write-session-provider","/work-os/auth-session-audit-outbox","/work-os/prisma-audit-outbox-transaction-pilot","/work-os/database-adapter-dispatch-worker","/work-os/enterprise-department-suite","/work-os/auth-rls-department-pilot","/work-os/live-provider-mutation-replay","/work-os/pilot-mutation-replay","/api/v1/work-os/v80-production-pilot","/api/v1/work-os/v81-primary-write-session-provider","/api/v1/work-os/v82-auth-audit-outbox","/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot","/api/v1/work-os/v84-database-adapter-dispatch-worker","/api/v1/work-os/v85-enterprise-department-suite","/api/v1/work-os/v86-auth-rls-department-pilot","/api/v1/work-os/v87-live-provider-mutation-replay","/api/v1/work-os/v87-live-provider-mutation-replay/provider-credentials","/api/v1/work-os/v87-live-provider-mutation-replay/webhook-signature","/api/v1/work-os/v87-live-provider-mutation-replay/pilot-mutation-replay","/api/v1/work-os/v87-live-provider-mutation-replay/replay-queue","/api/v1/work-os/v87-live-provider-mutation-replay/taskuri-evidence","/api/v1/work-os/v87-live-provider-mutation-replay/manager-evidence-panel","/api/v1/work-os/v87-live-provider-mutation-replay/pixel-diff-baseline","/api/v1/work-os/v87-live-provider-mutation-replay/outbox-dispatch","/api/v1/work-os/v87-live-provider-mutation-replay/rollback-drill","/api/v1/work-os/v87-live-provider-mutation-replay/goodday-parity-delta","/api/v1/work-os/v87-live-provider-mutation-replay/security-checklist","/api/v1/work-os/v87-live-provider-mutation-replay/runtime-proof")

$Report = @()
$Report += "# v8.7.0 Live Provider Mutation Replay Functional Route/API Test"
$Report += ""
$Report += "BaseUrl: $BaseUrl"
$Report += ""
$Report += "| Route | Result | HTTP | Bytes | Note |"
$Report += "|---|---:|---:|---:|---|"

$Passed = 0
foreach ($Route in $Routes) {
  $Url = $BaseUrl.TrimEnd('/') + $Route
  try {
    $Headers = @{}
    if ($env:VERCEL_AUTOMATION_BYPASS_SECRET) { $Headers["x-vercel-protection-bypass"] = $env:VERCEL_AUTOMATION_BYPASS_SECRET }
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 5 -Headers $Headers
    $Bytes = [System.Text.Encoding]::UTF8.GetByteCount($Response.Content)
    if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 300) {
      Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes"
      $Report += "| $Route | PASS | $($Response.StatusCode) | $Bytes | OK |"
      $Passed++
    } else {
      Write-Host "$Route -> FAIL HTTP $($Response.StatusCode) | $Bytes bytes"
      $Report += "| $Route | FAIL | $($Response.StatusCode) | $Bytes | Non-2xx |"
    }
  } catch {
    Write-Host "$Route -> FAIL $($_.Exception.Message)"
    $Report += "| $Route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$Report += ""
$Report += "Passed: $Passed / $($Routes.Count)"
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$ReportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v870-live-provider-mutation-replay-functional-routes.md"
$Report -join "`n" | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host "v8.7.0 functional route/API smoke passed: $Passed / $($Routes.Count)"
Write-Host "Report: $ReportPath"
if ($Passed -ne $Routes.Count) { exit 1 }
