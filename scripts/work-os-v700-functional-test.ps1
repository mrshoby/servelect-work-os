param(
    [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"
$Routes = @(
    "/taskuri/overview",
    "/taskuri/my-work",
    "/taskuri/inbox",
    "/taskuri/tickets",
    "/taskuri/tickets-notificari",
    "/taskuri/board",
    "/taskuri/tabel",
    "/taskuri/calendar",
    "/taskuri/calendar-gantt",
    "/taskuri/workload",
    "/taskuri/workload-aprobari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/reports",
    "/taskuri/automations",
    "/admin/workflows",
    "/admin/custom-fields",
    "/admin/access-rules",
    "/admin/goodday-parity",
    "/api/v1/work-os/v7-parity"
)

$RepoPath = (Get-Location).Path
$AuditDir = Join-Path $RepoPath "audit-results"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$ReportPath = Join-Path $AuditDir "v700-goodday-parity-functional-routes.md"
$Lines = @("# v7.0.0 GoodDay parity functional route smoke", "", "BaseUrl: " + $BaseUrl, "", "| Route | Result | Bytes |", "|---|---:|---:|")
$Failed = 0

foreach ($Route in $Routes) {
    try {
        $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 30
        $Bytes = $Response.Content.Length
        Write-Host ($Route + " -> PASS HTTP " + $Response.StatusCode + " | " + $Bytes + " bytes") -ForegroundColor Green
        $Lines += "| " + $Route + " | PASS " + $Response.StatusCode + " | " + $Bytes + " |"
    } catch {
        $Failed += 1
        $Message = $_.Exception.Message
        Write-Host ($Route + " -> FAIL | " + $Message) -ForegroundColor Red
        $Lines += "| " + $Route + " | FAIL: " + $Message.Replace("|", "/") + " | 0 |"
    }
}

$Lines += ""
$Lines += "Failed: " + $Failed
Set-Content -Path $ReportPath -Value $Lines -Encoding UTF8

if ($Failed -gt 0) {
    throw ("v7.0.0 functional route smoke failed: " + $Failed + " route(s). See " + $ReportPath)
}

Write-Host ("v7.0.0 functional route smoke passed: " + $Routes.Count + " / " + $Routes.Count) -ForegroundColor Green
Write-Host ("Report: " + $ReportPath) -ForegroundColor Cyan
