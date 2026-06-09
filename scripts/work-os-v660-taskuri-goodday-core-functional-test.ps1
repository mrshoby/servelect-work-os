param(
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"
$routes = @(
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/tickets-notificari",
  "/taskuri/proiecte-active",
  "/taskuri/proiecte-viitoare",
  "/taskuri/proiecte-finalizate",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/api/v1/work-os/goodday-parity"
)

if (!$OutputPath) { $OutputPath = Join-Path (Get-Location) "audit-results\taskuri-goodday-core-v6.6.0-functional-routes.md" }
New-Item -ItemType Directory -Path (Split-Path $OutputPath) -Force | Out-Null
$rows = @()
foreach ($route in $routes) {
  $url = "$BaseUrl$route"
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $state = if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400 -and $response.Content.Length -gt 200) { "PASS" } else { "FAIL" }
    $rows += [pscustomobject]@{ Route=$route; Status=$response.StatusCode; Bytes=$response.Content.Length; Result=$state }
  } catch {
    $rows += [pscustomobject]@{ Route=$route; Status=0; Bytes=0; Result="FAIL: $($_.Exception.Message)" }
  }
}

$md = @()
$md += "# SERVELECT WORK OS v6.6.0 - Real Taskuri route functional smoke test"
$md += ""
$md += "BaseUrl: $BaseUrl"
$md += "Generated: $(Get-Date -Format o)"
$md += ""
$md += "| Route | HTTP | Bytes | Result |"
$md += "|---|---:|---:|---|"
foreach ($row in $rows) { $md += "| $($row.Route) | $($row.Status) | $($row.Bytes) | $($row.Result) |" }
$md | Set-Content -Path $OutputPath -Encoding UTF8
$fail = $rows | Where-Object { $_.Result -notlike "PASS" }
if ($fail.Count -gt 0) { Write-Warning "Functional route smoke has $($fail.Count) failing route(s)."; exit 1 }
Write-Host "Functional route smoke PASS: $($routes.Count)/$($routes.Count)" -ForegroundColor Green