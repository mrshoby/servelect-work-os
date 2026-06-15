param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Continue"
$routes = @(
  "/taskuri",

  "/taskuri/overview",

  "/taskuri/my-work",

  "/taskuri/tickets-notificari",

  "/taskuri/board",

  "/taskuri/tabel",

  "/taskuri/calendar-gantt",

  "/taskuri/workload-aprobari",

  "/taskuri/forms",

  "/taskuri/timesheets",

  "/taskuri/reports",

  "/taskuri/automations",

  "/taskuri/enterprise-control-room",

  "/taskuri/provider-mutation-replay",

  "/taskuri/live-provider-command-center",

  "/taskuri/pilot-mutation-replay",

  "/taskuri/visual-evidence-center",

  "/taskuri/provider-secret-adapter",

  "/taskuri/inbound-webhook-drill",

  "/taskuri/dead-letter-recovery",

  "/taskuri/provider-delivery-worker",

  "/taskuri/github-pixel-diff-ci",

  "/taskuri/signed-webhook-intake",

  "/taskuri/manager-approval-evidence",

  "/taskuri/replay-recovery-control",

  "/admin/workflows",

  "/admin/custom-fields",

  "/admin/enterprise-department-suite",

  "/admin/auth-rls-department-pilot",

  "/admin/live-provider-mutation-replay",

  "/admin/provider-credential-vault",

  "/admin/pixel-diff-ci-gates",

  "/admin/provider-secret-adapter",

  "/admin/inbound-webhook-drill",

  "/admin/dead-letter-recovery",

  "/admin/provider-delivery-worker",

  "/admin/github-pixel-diff-ci",

  "/admin/signed-webhook-intake",

  "/admin/manager-approval-evidence",

  "/admin/replay-recovery-control",

  "/work-os/enterprise-department-suite",

  "/work-os/auth-rls-department-pilot",

  "/work-os/live-provider-mutation-replay",

  "/work-os/pilot-mutation-replay",

  "/work-os/pixel-diff-provider-webhook",

  "/work-os/live-webhook-drill",

  "/work-os/dead-letter-recovery",

  "/work-os/provider-delivery-ci-webhook",

  "/work-os/signed-webhook-intake",

  "/work-os/replay-recovery-control",

  "/api/v1/work-os/v88-pixel-diff-provider-webhook",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/health",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/provider-delivery-worker",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/github-pixel-diff-ci",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/signed-webhook-intake",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/webhook-signature-proof",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/provider-secret-env-check",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/dead-letter-recovery",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/replay-queue",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/manager-approval-evidence",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/pixel-diff-ci-gate",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/delivery-retry-ledger",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/goodday-parity-delta",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/runtime-proof",

  "/api/v1/work-os/v89-provider-delivery-ci-webhook/release-readiness"
)

$report = @()
$report += "# v8.9.0 Provider Delivery CI Webhook Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"

$passed = 0
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45 -Headers @{
      "x-vercel-protection-bypass" = $env:VERCEL_AUTOMATION_BYPASS_SECRET
    }
    $bytes = [Text.Encoding]::UTF8.GetByteCount($response.Content)
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
      $passed++
      Write-Host "$route -> PASS HTTP $($response.StatusCode) | $bytes bytes"
      $report += "| $route | PASS | $($response.StatusCode) | $bytes | OK |"
    } else {
      Write-Host "$route -> FAIL HTTP $($response.StatusCode)"
      $report += "| $route | FAIL | $($response.StatusCode) | $bytes | Non-2xx |"
    }
  } catch {
    Write-Host "$route -> FAIL $($_.Exception.Message)"
    $report += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}

$report += ""
$report += "Passed: $passed / $($routes.Count)"
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$ReportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v890-provider-delivery-ci-webhook-functional-routes.md"
$report -join "`n" | Set-Content -Path $ReportPath -Encoding UTF8
Write-Host "v8.9.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $ReportPath"
if ($passed -ne $routes.Count) { exit 1 }
