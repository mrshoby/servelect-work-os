param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
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
  "/taskuri/provider-delivery-worker",
  "/taskuri/github-pixel-diff-ci",
  "/taskuri/signed-webhook-intake",
  "/taskuri/manager-approval-evidence",
  "/taskuri/replay-recovery-control",
  "/taskuri/command-center-v90",
  "/taskuri/pilot-cutover-console",
  "/taskuri/live-provider-dispatch",
  "/taskuri/signed-webhook-hardening",
  "/taskuri/action-required",
  "/taskuri/workload-capacity-map",
  "/taskuri/project-hierarchy",
  "/taskuri/cross-module-activity",
  "/taskuri/field-team-dispatch",
  "/taskuri/rbac-approval-gates",
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
  "/admin/production-pilot-cutover",
  "/admin/live-provider-dispatch",
  "/admin/signed-webhook-hardening",
  "/admin/goodday-parity-command",
  "/admin/rbac-access-gates",
  "/admin/rollback-drill-center",
  "/admin/pixel-diff-release-gates",
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
  "/work-os/production-pilot-cutover",
  "/work-os/live-provider-dispatch",
  "/work-os/signed-webhook-hardening",
  "/work-os/goodday-command-layer",
  "/work-os/portfolio-hierarchy",
  "/work-os/resource-capacity",
  "/work-os/cross-module-control",
  "/api/v1/work-os/v89-provider-delivery-ci-webhook",
  "/api/v1/work-os/v90-production-pilot-cutover",
  "/api/v1/work-os/v90-production-pilot-cutover/health",
  "/api/v1/work-os/v90-production-pilot-cutover/production-pilot-cutover",
  "/api/v1/work-os/v90-production-pilot-cutover/live-provider-dispatch",
  "/api/v1/work-os/v90-production-pilot-cutover/signed-webhook-hardening",
  "/api/v1/work-os/v90-production-pilot-cutover/webhook-replay-protection",
  "/api/v1/work-os/v90-production-pilot-cutover/provider-secret-env-check",
  "/api/v1/work-os/v90-production-pilot-cutover/action-required",
  "/api/v1/work-os/v90-production-pilot-cutover/workload-capacity",
  "/api/v1/work-os/v90-production-pilot-cutover/hierarchy-map",
  "/api/v1/work-os/v90-production-pilot-cutover/cross-module-activity",
  "/api/v1/work-os/v90-production-pilot-cutover/rollback-drill",
  "/api/v1/work-os/v90-production-pilot-cutover/manager-approval-gates",
  "/api/v1/work-os/v90-production-pilot-cutover/pixel-diff-release-gates",
  "/api/v1/work-os/v90-production-pilot-cutover/goodday-parity-delta",
  "/api/v1/work-os/v90-production-pilot-cutover/release-readiness"
)
$results = @()
$passed = 0

foreach ($route in $routes) {
  $url = ($BaseUrl.TrimEnd("/") + $route)
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -Method GET -TimeoutSec 45
    $bytes = [System.Text.Encoding]::UTF8.GetByteCount($response.Content)
    $ok = ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300)
    if ($ok) { $passed++ }
    $results += [pscustomobject]@{ Route=$route; Result=($(if($ok){"PASS"}else{"FAIL"})); HTTP=$response.StatusCode; Bytes=$bytes; Note=($(if($ok){"OK"}else{"Non-2xx"})) }
  } catch {
    $results += [pscustomobject]@{ Route=$route; Result="FAIL"; HTTP=0; Bytes=0; Note=$_.Exception.Message }
  }
}

$report = @()
$report += "# v9.0.0 Production Pilot Cutover Functional Route/API Test"
$report += ""
$report += "BaseUrl: $BaseUrl"
$report += ""
$report += "| Route | Result | HTTP | Bytes | Note |"
$report += "|---|---:|---:|---:|---|"
foreach ($r in $results) { $report += "| $($r.Route) | $($r.Result) | $($r.HTTP) | $($r.Bytes) | $($r.Note) |" }
$report += ""
$report += "Passed: $passed / $($routes.Count)"

New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
$reportPath = Join-Path (Join-Path (Get-Location) "audit-results") "v900-production-pilot-cutover-functional-routes.md"
$report -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "v9.0.0 functional route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $reportPath"
if ($passed -ne $routes.Count) { throw "v9.0.0 functional route/API smoke failed: $passed / $($routes.Count)" }
