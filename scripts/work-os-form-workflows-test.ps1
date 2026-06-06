param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$paths = @(
  "/work-os/forms",
  "/work-os/projects/new",
  "/work-os/tasks/new",
  "/work-os/stock/reservations",
  "/work-os/offers/new",
  "/work-os/pontaj/workload",
  "/admin/work-os-workflows",
  "/api/v1/work-os/forms",
  "/api/v1/work-os/forms/templates",
  "/api/v1/work-os/forms/options",
  "/api/v1/work-os/forms/validate",
  "/api/v1/work-os/forms/projects/create",
  "/api/v1/work-os/forms/tasks/create",
  "/api/v1/work-os/forms/stock/reserve",
  "/api/v1/work-os/forms/offers/create",
  "/api/v1/work-os/forms/pontaj/workload",
  "/api/v1/tasks/form-workflows",
  "/api/v1/projects/form-workflows",
  "/api/v1/stock/reservations",
  "/api/v1/offers/form-workflows",
  "/api/v1/pontaj/workload-proposals"
)

foreach ($path in $paths) {
  $url = $BaseUrl.TrimEnd('/') + $path
  Write-Host "Testing $url" -ForegroundColor Cyan
  $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
    throw "Failed $url with status $($response.StatusCode)"
  }
}

Write-Host "v5.3 Work OS form workflows audit OK" -ForegroundColor Green
