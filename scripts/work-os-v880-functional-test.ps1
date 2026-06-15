param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
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
  "/work-os/enterprise-department-suite",
  "/work-os/auth-rls-department-pilot",
  "/work-os/live-provider-mutation-replay",
  "/work-os/pilot-mutation-replay",
  "/work-os/pixel-diff-provider-webhook",
  "/work-os/live-webhook-drill",
  "/work-os/dead-letter-recovery",
  "/api/v1/work-os/v87-live-provider-mutation-replay",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/health",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/pixel-diff-baseline",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/provider-secret-adapter",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/inbound-webhook-signature",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/signed-payload-drill",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/dead-letter-recovery",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/replay-queue",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/visual-evidence",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/manager-acceptance-gates",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/ci-quality-gates",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/goodday-parity-delta",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/runtime-proof",
  "/api/v1/work-os/v88-pixel-diff-provider-webhook/release-readiness"
)

$report = @()
$report += "# v8.8.0 Pixel Diff Provider Webhook Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
$passed = 0

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd('/') + $route
  try {
    $headers = @{}
    if ($env:VERCEL_AUTOMATION_BYPASS_SECRET) { $headers["x-vercel-protection-bypass"] = $env:VERCEL_AUTOMATION_BYPASS_SECRET }
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers $headers -TimeoutSec 30
    $bytes = [System.Text.Encoding]::UTF8.GetByteCount($response.Content)
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
$reportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v880-pixel-diff-provider-webhook-functional-routes.md"
$report -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "v8.8.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
if ($passed -ne $routes.Count) { exit 1 }
