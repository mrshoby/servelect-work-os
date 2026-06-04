$ErrorActionPreference = "SilentlyContinue"
Set-Location $PSScriptRoot\..
Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
Remove-Item ".\apps\web\.next" -Recurse -Force
Remove-Item ".\apps\web\out" -Recurse -Force
Write-Host "Done." -ForegroundColor Green
