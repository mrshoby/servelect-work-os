param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$Repo = Get-Location
$ReportDir = Join-Path $Repo "audit-results"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$Report = Join-Path $ReportDir "v1300-full-taskuri-route-unification-routes.md"

$taskuriRoutes = @(
  "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari",
  "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/board", "/taskuri/tabel", "/taskuri/table",
  "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations",
  "/taskuri/action-board", "/taskuri/action-required", "/taskuri/activity-stream-v92", "/taskuri/approval-workflow-builder-v94", "/taskuri/bulk-operations-v93",
  "/taskuri/calendar-capacity-v94", "/taskuri/checklists-quality-v95", "/taskuri/collaboration-hub-v95", "/taskuri/command-center-v90", "/taskuri/command-palette-actions-v96",
  "/taskuri/cross-module-activity", "/taskuri/dead-letter-ledger-v92", "/taskuri/dead-letter-recovery", "/taskuri/decision-register-v95", "/taskuri/drawer-flow-v93",
  "/taskuri/drawer-mutation-queue-v94", "/taskuri/enterprise-control-room", "/taskuri/executive-summary-v97", "/taskuri/field-team-dispatch", "/taskuri/files-evidence-v95",
  "/taskuri/gantt-conflict-review-v96", "/taskuri/gantt-readiness-v94", "/taskuri/github-pixel-diff-ci", "/taskuri/goodday-parity", "/taskuri/hierarchy-map-v91",
  "/taskuri/inbound-webhook-drill", "/taskuri/inline-persistence-v96", "/taskuri/keyboard-command-v93", "/taskuri/live-provider-command-center", "/taskuri/live-provider-dispatch",
  "/taskuri/manager-approval-evidence", "/taskuri/manager-gate-inbox-v96", "/taskuri/my-work-focus-v93", "/taskuri/notification-routing-v96", "/taskuri/pilot-cutover-console",
  "/taskuri/pilot-mutation-replay", "/taskuri/policy-contracts-v94", "/taskuri/program-board-v97", "/taskuri/project-hierarchy", "/taskuri/provider-delivery-worker",
  "/taskuri/provider-dispatch-ledger-v92", "/taskuri/provider-mutation-replay", "/taskuri/provider-secret-adapter", "/taskuri/rbac-approval-gates", "/taskuri/replay-recovery-control",
  "/taskuri/reporting-command-v97", "/taskuri/request-intake-v91", "/taskuri/request-portal-bridge-v95", "/taskuri/resource-portfolio-v97", "/taskuri/saved-layouts-v97",
  "/taskuri/saved-view-persistence-v96", "/taskuri/saved-view-policies-v93", "/taskuri/signed-webhook-hardening", "/taskuri/signed-webhook-intake", "/taskuri/sla-escalation-v95",
  "/taskuri/sla-evidence-report-v97", "/taskuri/task-change-audit-v96", "/taskuri/task-detail-v91", "/taskuri/task-mutation-pilot-v92", "/taskuri/task-object-model-v92",
  "/taskuri/task-template-recurrence-v94", "/taskuri/time-tracking-v91", "/taskuri/timeline-dependencies-v94", "/taskuri/updates-notifications-v93", "/taskuri/updates-stream-v91",
  "/taskuri/visual-evidence-center", "/taskuri/webhook-intake-ledger-v92", "/taskuri/workgraph-map-v97", "/taskuri/workload-capacity-map", "/taskuri/workload-forecast-v95",
  "/taskuri/workload-planner-v91", "/taskuri/workspace-command", "/taskuri/workspace-overview-v93"
)

$apiRoutes = @(
  "/api/v1/work-os/v130-full-taskuri-route-unification",
  "/api/v1/work-os/v130-full-taskuri-route-unification/health",
  "/api/v1/work-os/v130-full-taskuri-route-unification/routes",
  "/api/v1/work-os/v130-full-taskuri-route-unification/scores",
  "/api/v1/work-os/v130-full-taskuri-route-unification/buttons",
  "/api/v1/work-os/v130-full-taskuri-route-unification/flows",
  "/api/v1/work-os/v130-full-taskuri-route-unification/readiness",
  "/api/v1/work-os/v130-full-taskuri-route-unification/workspace",
  "/api/v1/work-os/v130-full-taskuri-route-unification/manual-ui",
  "/api/v1/work-os/v130-full-taskuri-route-unification/screenshots",
  "/api/v1/work-os/v130-full-taskuri-route-unification/route-unification"
)

$routes = $taskuriRoutes + $apiRoutes
$rows = @("# v13.0.0 Full Taskuri Route Unification Route/API Test", "", "BaseUrl: $BaseUrl", "", "| Route | Result | HTTP | Bytes | Note |", "|---|---:|---:|---:|---|")
$passed = 0
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -MaximumRedirection 5
    $bytes = if ($response.Content) { $response.Content.Length } else { 0 }
    $ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    if ($ok) { $passed++ }
    $result = if ($ok) { "PASS" } else { "FAIL" }
    $rows += "| $route | $result | $($response.StatusCode) | $bytes | OK |"
  } catch {
    $rows += "| $route | FAIL | ERR | 0 | $($_.Exception.Message.Replace('|','/')) |"
  }
}
$rows += ""
$rows += "Passed: $passed / $($routes.Count)"
$rows | Set-Content -LiteralPath $Report -Encoding UTF8
if ($passed -ne $routes.Count) { throw "v13.0.0 route/API smoke failed: $passed / $($routes.Count). Report: $Report" }
Write-Host "v13.0.0 route/API smoke passed: $passed / $($routes.Count)"
Write-Host "Report: $Report"
