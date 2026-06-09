param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
Write-Host ("Running v6.9.0 production smoke against " + $BaseUrl) -ForegroundColor Cyan
& (Join-Path $PSScriptRoot "work-os-v690-production-runtime-functional-test.ps1") -BaseUrl $BaseUrl
