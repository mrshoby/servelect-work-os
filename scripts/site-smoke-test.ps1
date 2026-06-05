$ErrorActionPreference = "Continue"

$base = "https://servelect-work-os-web.vercel.app"
$routes = @(
  "/",
  "/taskuri",
  "/proiecte",
  "/crm",
  "/iot",
  "/echipamente",
  "/mentenanta",
  "/finantari-esg",
  "/hr-admin",
  "/admin/users",
  "/admin/system",
  "/admin/audit",
  "/admin/release",
  "/admin/performance",
  "/action-center",
  "/workflows",
  "/api/v1/system/status",
  "/api/v1/system/readiness",
  "/api/v1/action-center",
  "/api/v1/audit/events",
  "/api/v1/release/manifest",
  "/api/v1/release/checklist",
  "/api/v1/performance/audit"
)

Write-Host "=== SERVELECT WORK OS SITE SMOKE TEST ===" -ForegroundColor Cyan
Write-Host "Base: $base"
Write-Host ""

$results = foreach ($route in $routes) {
  $url = "$base$route"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      Status = [int]$response.StatusCode
      Ms = $sw.ElapsedMilliseconds
      Ok = $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }
  } catch {
    $sw.Stop()
    [pscustomobject]@{
      Route = $route
      Status = "ERR"
      Ms = $sw.ElapsedMilliseconds
      Ok = $false
    }
  }
}

$results | Sort-Object Ok, Ms -Descending | Format-Table -AutoSize

$bad = $results | Where-Object { -not $_.Ok }
$slow = $results | Where-Object { $_.Ok -and $_.Ms -gt 3000 }

Write-Host ""
if ($bad.Count -gt 0) {
  Write-Host "RUTE CU EROARE:" -ForegroundColor Red
  $bad | Format-Table -AutoSize
}

if ($slow.Count -gt 0) {
  Write-Host "RUTE LENTE > 3000ms:" -ForegroundColor Yellow
  $slow | Format-Table -AutoSize
}

if ($bad.Count -eq 0 -and $slow.Count -eq 0) {
  Write-Host "Smoke test OK: nu am gasit rute cazute sau foarte lente." -ForegroundColor Green
}
