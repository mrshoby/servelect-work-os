$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
Write-Host "SERVELECT WORK OS - Web dev" -ForegroundColor Green
pnpm --filter @servelect/web dev
