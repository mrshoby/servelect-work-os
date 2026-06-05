$ErrorActionPreference = "Continue"

$baseUrl = "https://servelect-work-os-web.vercel.app"
$routes = @(
  "/",
  "/taskuri",
  "/proiecte",
  "/calendar",
  "/echipa",
  "/crm",
  "/iot",
  "/echipamente",
  "/mentenanta",
  "/finantari-esg",
  "/documente",
  "/rapoarte",
  "/hr-admin",
  "/action-center",
  "/workflows",
  "/admin/users",
  "/admin/system",
  "/admin/audit",
  "/admin/release",
  "/admin/performance",
  "/api/v1/performance/audit"
)

Write-Host "SERVELECT WORK OS smoke test" -ForegroundColor Cyan
Write-Host "Base: $baseUrl"
Write-Host ""

foreach ($route in $routes) {
  $url = "$baseUrl$route"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    $sw.Stop()
    $ms = [math]::Round($sw.Elapsed.TotalMilliseconds)
    $color = if ($response.StatusCode -ge 400) { "Red" } elseif ($ms -gt 3500) { "Yellow" } else { "Green" }
    Write-Host ($response.StatusCode.ToString().PadRight(4) + " " + $ms.ToString().PadLeft(5) + " ms  " + $route) -ForegroundColor $color
  } catch {
    $sw.Stop()
    Write-Host ("ERR  " + [math]::Round($sw.Elapsed.TotalMilliseconds).ToString().PadLeft(5) + " ms  " + $route + "  " + $_.Exception.Message) -ForegroundColor Red
  }
}
