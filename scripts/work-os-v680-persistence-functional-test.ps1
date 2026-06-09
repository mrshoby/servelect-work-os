param(
    [string]$BaseUrl = "http://127.0.0.1:3100"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$OutDir = Join-Path $RepoRoot "audit-results"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$ReportPath = Join-Path $OutDir "v680-persistence-api-functional-routes.md"

$Routes = @(
    "/work-os/persistence-api",
    "/work-os/real-api-unification",
    "/admin/persistence-api",
    "/api/v1/work-os/persistence-api",
    "/api/v1/work-os/persistence-api/health",
    "/api/v1/work-os/persistence-api/mutations",
    "/api/v1/work-os/global-command",
    "/work-os/dashboard",
    "/search",
    "/taskuri/overview"
)

$Rows = @()
$Failed = 0

foreach ($Route in $Routes) {
    try {
        $Response = Invoke-WebRequest -Uri "$BaseUrl$Route" -UseBasicParsing -TimeoutSec 25
        $Status = [int]$Response.StatusCode
        $Bytes = $Response.Content.Length
        Write-Host "$Route -> PASS HTTP $Status | $Bytes bytes" -ForegroundColor Green
        $Rows += "| $Route | PASS | $Status | $Bytes |"
    } catch {
        $Failed++
        $Message = $_.Exception.Message.Replace("|", "/")
        Write-Host "$Route -> FAIL | $Message" -ForegroundColor Red
        $Rows += "| $Route | FAIL | - | $Message |"
    }
}

$Header = @(
    "# SERVELECT WORK OS v6.8.0 Persistence/API Functional Route Smoke",
    "",
    "Base URL: $BaseUrl",
    "Generated: $(Get-Date -Format o)",
    "",
    "| Route | Result | HTTP | Bytes / Error |",
    "|---|---:|---:|---:|"
)

$Header + $Rows | Set-Content -Path $ReportPath -Encoding UTF8

if ($Failed -gt 0) {
    throw "v6.8.0 persistence/API route smoke failed: $Failed route(s). See $ReportPath"
}

Write-Host "v6.8.0 persistence/API route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $ReportPath" -ForegroundColor Cyan
