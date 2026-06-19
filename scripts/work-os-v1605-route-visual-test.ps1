param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"
$checks = @(
  @{Path="/taskuri"; Marker="Command Center"},
  @{Path="/taskuri/my-work"; Marker="My Work"},
  @{Path="/taskuri/inbox"; Marker="Inbox & Action Required"},
  @{Path="/taskuri/tickets"; Marker="Ticket / Request Center"},
  @{Path="/taskuri/proiecte-active"; Marker="Proiecte active"},
  @{Path="/taskuri/proiecte-viitoare"; Marker="Proiecte viitoare"},
  @{Path="/taskuri/proiecte-finalizate"; Marker="Proiecte finalizate"},
  @{Path="/taskuri/board"; Marker="Board / Kanban"},
  @{Path="/taskuri/tabel"; Marker="Enterprise Table"},
  @{Path="/taskuri/calendar"; Marker="Calendar"},
  @{Path="/taskuri/calendar-gantt"; Marker="Calendar + Gantt"},
  @{Path="/taskuri/workload"; Marker="Workload & Approvals"},
  @{Path="/taskuri/reports"; Marker="Reports & Analytics"},
  @{Path="/taskuri/automations"; Marker="Automations & Workflows"},
  @{Path="/taskuri/forms"; Marker="Request Forms"},
  @{Path="/taskuri/timesheets"; Marker="Timesheets"}
)

$rows = @()
foreach ($c in $checks) {
  $html = (vercel curl "$BaseUrl$($c.Path)" | Out-String)
  $rows += [pscustomobject]@{
    Page = $c.Path
    HasV160 = $html.Contains("data-v160-real-provider-mutation")
    HasRouteSpecific = $html.Contains("data-v160-route-specific-visual")
    HasExpected = $html.Contains($c.Marker)
    Expected = $c.Marker
  }
}

$passed = ($rows | Where-Object { $_.HasV160 -and $_.HasRouteSpecific -and $_.HasExpected }).Count
$report = @("# v16.0.5 Route Visual Differentiation Check", "", "BaseUrl: $BaseUrl", "", "| Page | V160 | Route visual | Expected content | Marker |", "|---|---:|---:|---:|---|")
foreach ($row in $rows) {
  $report += "| $($row.Page) | $(if ($row.HasV160) { 'PASS' } else { 'FAIL' }) | $(if ($row.HasRouteSpecific) { 'PASS' } else { 'FAIL' }) | $(if ($row.HasExpected) { 'PASS' } else { 'FAIL' }) | $($row.Expected) |"
}
$report += ""
$report += "Passed: $passed / $($rows.Count)"
New-Item -ItemType Directory -Force -Path "audit-results" | Out-Null
Set-Content -Path "audit-results\v1605-route-visual-differentiation-check.md" -Value $report -Encoding UTF8
Get-Content "audit-results\v1605-route-visual-differentiation-check.md"
if ($passed -ne $rows.Count) { throw "v16.0.5 route visual differentiation check failed: $passed/$($rows.Count)" }
