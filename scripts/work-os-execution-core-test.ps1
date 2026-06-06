param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$endpoints = @(
  "/api/v1/work-os/execution-core",
  "/api/v1/work-os/execution-dashboard",
  "/api/v1/work-os/kanban",
  "/api/v1/work-os/calendar",
  "/api/v1/work-os/gantt",
  "/api/v1/work-os/workload",
  "/api/v1/work-os/approvals",
  "/api/v1/work-os/drafts",
  "/api/v1/work-os/material-plan",
  "/api/v1/work-os/offer-pipeline",
  "/api/v1/work-os/field-ops",
  "/api/v1/work-os/execution-audit",
  "/api/v1/work-os/execution-rbac",
  "/api/v1/work-os/execution-automations",
  "/api/v1/work-os/execution-command-center",
  "/api/v1/work-os/execution-health"
)

foreach ($endpoint in $endpoints) {
  $url = "$BaseUrl$endpoint"
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-RestMethod -Uri $url -Method GET
  if (-not $response.ok) { throw "Endpoint did not return ok=true: $endpoint" }
}

Write-Host "v5.4 Work OS execution core audit passed." -ForegroundColor Green
