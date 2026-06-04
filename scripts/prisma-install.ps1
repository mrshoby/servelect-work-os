param(
  [string]$Repo = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location $Repo
Write-Host "Installing Prisma dependencies for @servelect/web..." -ForegroundColor Cyan
pnpm add -F @servelect/web @prisma/client
pnpm add -D -F @servelect/web prisma
Write-Host "Generating Prisma client..." -ForegroundColor Cyan
pnpm --filter @servelect/web prisma generate --schema ../../prisma/schema.prisma
Write-Host "Done. Commit package.json + pnpm-lock.yaml after this." -ForegroundColor Green
