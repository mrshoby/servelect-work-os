$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
Write-Host "SERVELECT WORK OS - Web dev on port 3001" -ForegroundColor Green
pnpm --filter @servelect/web dev -- --port 3001
