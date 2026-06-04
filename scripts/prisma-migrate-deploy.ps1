param(
  [string]$Repo = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location $Repo
if (-not $env:DATABASE_URL) {
  throw "DATABASE_URL is not set. Set it first or add it to Vercel Environment Variables."
}

pnpm --filter @servelect/web prisma generate --schema ../../prisma/schema.prisma
pnpm --filter @servelect/web prisma migrate deploy --schema ../../prisma/schema.prisma
