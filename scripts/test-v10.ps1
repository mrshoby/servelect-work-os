$ErrorActionPreference = "Stop"

Write-Host "Testing SERVELECT WORK OS v1.0..." -ForegroundColor Cyan

pnpm --filter @servelect/web build

$routes = @(
  "/admin/release",
  "/admin/system",
  "/action-center",
  "/admin/audit",
  "/workflows",
  "/api/v1/release/manifest",
  "/api/v1/release/checklist",
  "/api/v1/system/status",
  "/api/v1/system/readiness"
)

Write-Host "Manual smoke-test routes:" -ForegroundColor Green
$routes | ForEach-Object { Write-Host $_ }
