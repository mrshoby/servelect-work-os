param(
    [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"
$Routes = @(
    "/work-os/backend-mutations",
    "/admin/backend-mutations",
    "/api/v1/work-os/v71-mutations",
    "/api/v1/work-os/v71-mutations/health",
    "/api/v1/work-os/v71-mutations/tasks",
    "/api/v1/work-os/v71-mutations/tickets",
    "/api/v1/work-os/v71-mutations/notifications",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari"
)

$OutDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$ReportPath = Join-Path $OutDir "v710-backend-mutation-functional-routes.md"
$Lines = @()
$Lines += "# v7.1.0 Backend Mutation Functional Routes"
$Lines += ""
$Lines += "BaseUrl: $BaseUrl"
$Lines += ""
$Lines += "| Route | Result | HTTP | Bytes |"
$Lines += "|---|---:|---:|---:|"

$Failed = 0
foreach ($Route in $Routes) {
    try {
        $Response = Invoke-WebRequest -Uri ($BaseUrl + $Route) -UseBasicParsing -TimeoutSec 25
        $Bytes = $Response.Content.Length
        Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $Bytes bytes" -ForegroundColor Green
        $Lines += "| $Route | PASS | $($Response.StatusCode) | $Bytes |"
    } catch {
        $Failed++
        $Msg = $_.Exception.Message.Replace("|", "/")
        Write-Host "$Route -> FAIL | $Msg" -ForegroundColor Red
        $Lines += "| $Route | FAIL: $Msg | 0 | 0 |"
    }
}

Set-Content -Path $ReportPath -Value $Lines -Encoding UTF8
if ($Failed -gt 0) {
    throw "v7.1.0 functional route smoke failed: $Failed route(s). See $ReportPath"
}
Write-Host "v7.1.0 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $ReportPath"
