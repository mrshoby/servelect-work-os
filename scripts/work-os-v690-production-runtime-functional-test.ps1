param(
    [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"
$Routes = @(
    "/work-os/production-runtime",
    "/work-os/deployment-command",
    "/admin/production-runtime",
    "/api/v1/work-os/production-runtime",
    "/api/v1/work-os/production-runtime/readiness",
    "/api/v1/work-os/production-runtime/deployments",
    "/api/v1/work-os/production-runtime/gates",
    "/work-os/persistence-api",
    "/work-os/real-api-unification",
    "/admin/persistence-api",
    "/api/v1/work-os/persistence-api",
    "/api/v1/work-os/persistence-api/health",
    "/work-os/dashboard",
    "/search",
    "/action-center",
    "/api/v1/work-os/global-command",
    "/taskuri/overview",
    "/taskuri/board",
    "/taskuri/tabel",
    "/taskuri/tickets-notificari",
    "/taskuri/workload-aprobari"
)

$AuditDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $AuditDir | Out-Null
$ReportPath = Join-Path $AuditDir "v690-production-runtime-functional-routes.md"
$CsvPath = Join-Path $AuditDir "v690-production-runtime-functional-routes.csv"

$Rows = @()
$Lines = @("# v6.9.0 Production Runtime route smoke", "", "BaseUrl: " + $BaseUrl, "")
$Failed = 0

foreach ($Route in $Routes) {
    $Url = $BaseUrl.TrimEnd('/') + $Route
    try {
        $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 25
        $Length = 0
        if ($null -ne $Response.Content) { $Length = $Response.Content.Length }
        $Message = $Route + " -> PASS HTTP " + $Response.StatusCode + " | " + $Length + " bytes"
        Write-Host $Message -ForegroundColor Green
        $Lines += "- PASS " + $Route + " HTTP " + $Response.StatusCode + " bytes " + $Length
        $Rows += [pscustomobject]@{ route = $Route; status = "PASS"; httpStatus = $Response.StatusCode; bytes = $Length; error = "" }
    } catch {
        $Failed++
        $ErrorText = $_.Exception.Message
        $Message = $Route + " -> FAIL | " + $ErrorText
        Write-Host $Message -ForegroundColor Red
        $Lines += "- FAIL " + $Route + " " + $ErrorText
        $Rows += [pscustomobject]@{ route = $Route; status = "FAIL"; httpStatus = 0; bytes = 0; error = $ErrorText }
    }
}

$Lines += ""
if ($Failed -eq 0) {
    $Lines += "Result: PASS " + $Routes.Count + " / " + $Routes.Count
    Set-Content -Path $ReportPath -Value $Lines -Encoding UTF8
    $Rows | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8
    Write-Host ("v6.9.0 production runtime route smoke passed: " + $Routes.Count + " / " + $Routes.Count) -ForegroundColor Green
    Write-Host ("Report: " + $ReportPath) -ForegroundColor Gray
} else {
    $Lines += "Result: FAIL " + $Failed + " / " + $Routes.Count
    Set-Content -Path $ReportPath -Value $Lines -Encoding UTF8
    $Rows | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8
    throw ("v6.9.0 production runtime route smoke failed: " + $Failed + " route(s). See " + $ReportPath)
}
