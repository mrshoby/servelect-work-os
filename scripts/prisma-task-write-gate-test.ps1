param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/enterprise/prisma-task-write-gate",
  "/api/v1/enterprise/prisma-task-write-gate-health",
  "/api/v1/enterprise/prisma-task-write-gate-plan",
  "/api/v1/tasks/prisma-write-gate"
)

Write-Host "=== SERVELECT WORK OS v3.3 Prisma Task Write-Gate Controlled Activation Test ===" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  Write-Host "`nGET $url" -ForegroundColor Yellow
  $response = Invoke-RestMethod -Method GET -Uri $url
  $response | ConvertTo-Json -Depth 20

  if ($null -eq $response.ok -or $response.ok -ne $true) {
    throw "Endpoint failed or missing ok=true: $path"
  }
}

Write-Host "`nOK: toate endpointurile v3.3 au raspuns cu ok=true." -ForegroundColor Green
