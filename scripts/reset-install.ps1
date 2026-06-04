$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
Write-Host "Reset install for SERVELECT WORK OS" -ForegroundColor Yellow
Remove-Item ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\apps\web\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\apps\mobile\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\packages\shared\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".\pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
corepack enable
corepack install -g pnpm@11.5.1
pnpm install
Write-Host "Reset completed. Run: pnpm --filter @servelect/web dev" -ForegroundColor Green
