param(
  [string]$BaseUrl = "http://127.0.0.1:3100"
)

$Routes = @(
  "/work-os/signed-attachments",
  "/work-os/provider-delivery",
  "/work-os/attachments",
  "/admin/access-enforced-mutations",
  "/admin/access-inheritance",
  "/api/v1/work-os/v76-provider-storage",
  "/api/v1/work-os/v76-provider-storage/health",
  "/api/v1/work-os/v76-provider-storage/signed-upload",
  "/api/v1/work-os/v76-provider-storage/signed-download",
  "/api/v1/work-os/v76-provider-storage/providers",
  "/api/v1/work-os/v76-provider-storage/access-checks",
  "/api/v1/work-os/v76-provider-storage/file-versions",
  "/taskuri/overview",
  "/taskuri/tickets-notificari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/workload-aprobari",
  "/taskuri/automations",
  "/taskuri/reports"
)

$OutDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$Report = Join-Path $OutDir "v760-provider-storage-functional-routes.md"
$Lines = @("# v7.6.0 Functional Route Smoke", "", "BaseUrl: $BaseUrl", "", "| Route | Result |", "|---|---|")
$Failed = 0

foreach ($Route in $Routes) {
  try {
    $Response = Invoke-WebRequest -Uri "$BaseUrl$Route" -UseBasicParsing -TimeoutSec 25
    $Line = "| $Route | PASS HTTP $($Response.StatusCode) bytes $($Response.Content.Length) |"
    Write-Host "$Route -> PASS HTTP $($Response.StatusCode) | $($Response.Content.Length) bytes" -ForegroundColor Green
    $Lines += $Line
  } catch {
    $Failed++
    $Message = $_.Exception.Message.Replace("|", "/")
    Write-Host "$Route -> FAIL | $Message" -ForegroundColor Red
    $Lines += "| $Route | FAIL $Message |"
  }
}

$Lines | Set-Content -Path $Report -Encoding UTF8
if ($Failed -gt 0) {
  throw ("v7.6.0 functional route smoke failed: " + $Failed + " route(s). See " + $Report)
}
Write-Host "v7.6.0 functional route smoke passed: $($Routes.Count) / $($Routes.Count)" -ForegroundColor Green
Write-Host "Report: $Report" -ForegroundColor Green
