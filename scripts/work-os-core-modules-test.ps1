param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/api/v1/work-os/core",
  "/api/v1/work-os/dashboard",
  "/api/v1/work-os/projects",
  "/api/v1/work-os/tasks",
  "/api/v1/work-os/stock",
  "/api/v1/work-os/pontaj",
  "/api/v1/work-os/crm",
  "/api/v1/work-os/offers",
  "/api/v1/work-os/audit",
  "/api/v1/work-os/operations",
  "/api/v1/work-os/command-center",
  "/api/v1/work-os/search?q=uta"
)

foreach ($path in $paths) {
  $url = "$BaseUrl$path"
  Write-Host "GET $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method Get
  if (-not $response.ok) { throw "Endpoint failed: $url" }
}

Write-Host "All Work OS core endpoints responded OK." -ForegroundColor Green
