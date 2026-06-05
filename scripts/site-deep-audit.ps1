param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app",
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = "Stop"

$routes = @(
  @{ Path = "/"; Label = "Dashboard"; MaxMs = 2200; Critical = $true },
  @{ Path = "/taskuri"; Label = "Taskuri"; MaxMs = 2500; Critical = $true },
  @{ Path = "/proiecte"; Label = "Proiecte"; MaxMs = 2500; Critical = $true },
  @{ Path = "/calendar"; Label = "Calendar"; MaxMs = 2500; Critical = $false },
  @{ Path = "/echipa"; Label = "Echipa"; MaxMs = 2500; Critical = $false },
  @{ Path = "/crm"; Label = "CRM"; MaxMs = 2600; Critical = $true },
  @{ Path = "/iot"; Label = "IoT"; MaxMs = 2600; Critical = $true },
  @{ Path = "/echipamente"; Label = "Echipamente"; MaxMs = 2600; Critical = $true },
  @{ Path = "/mentenanta"; Label = "Mentenanta"; MaxMs = 2600; Critical = $true },
  @{ Path = "/finantari-esg"; Label = "Finantari ESG"; MaxMs = 2600; Critical = $false },
  @{ Path = "/documente"; Label = "Documente"; MaxMs = 2500; Critical = $false },
  @{ Path = "/rapoarte"; Label = "Rapoarte"; MaxMs = 2500; Critical = $false },
  @{ Path = "/hr-admin"; Label = "HR Admin"; MaxMs = 2500; Critical = $true },
  @{ Path = "/action-center"; Label = "Action Center"; MaxMs = 2500; Critical = $true },
  @{ Path = "/workflows"; Label = "Workflows"; MaxMs = 2500; Critical = $true },
  @{ Path = "/enterprise"; Label = "Enterprise v1.1"; MaxMs = 2400; Critical = $true },
  @{ Path = "/admin/system"; Label = "System Status"; MaxMs = 2400; Critical = $true },
  @{ Path = "/admin/performance"; Label = "Performance"; MaxMs = 2400; Critical = $true },
  @{ Path = "/admin/release"; Label = "Release"; MaxMs = 2400; Critical = $false },
  @{ Path = "/admin/roadmap"; Label = "Roadmap"; MaxMs = 2400; Critical = $false },
  @{ Path = "/admin/quality"; Label = "Quality"; MaxMs = 2400; Critical = $false },
  @{ Path = "/api/v1/system/status"; Label = "API System Status"; MaxMs = 1200; Critical = $true },
  @{ Path = "/api/v1/system/readiness"; Label = "API System Readiness"; MaxMs = 1200; Critical = $true },
  @{ Path = "/api/v1/performance/audit"; Label = "API Performance Audit"; MaxMs = 1200; Critical = $true },
  @{ Path = "/api/v1/performance/deep-audit"; Label = "API Deep Audit"; MaxMs = 1200; Critical = $false },
  @{ Path = "/api/v1/enterprise/release"; Label = "API Enterprise Release"; MaxMs = 1200; Critical = $true },
  @{ Path = "/api/v1/enterprise/site-map"; Label = "API Site Map"; MaxMs = 1200; Critical = $false }
)

$BaseUrl = $BaseUrl.TrimEnd("/")
$results = @()

Write-Host "SERVELECT WORK OS deep audit" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan
Write-Host ""

foreach ($route in $routes) {
  $url = "$BaseUrl$($route.Path)"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $statusCode = 0
  $ok = $false
  $errorMessage = $null

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $TimeoutSec -MaximumRedirection 5
    $statusCode = [int]$response.StatusCode
    $ok = $statusCode -ge 200 -and $statusCode -lt 400
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $statusCode = [int]$_.Exception.Response.StatusCode
    }
    $errorMessage = $_.Exception.Message
  } finally {
    $sw.Stop()
  }

  $durationMs = [int]$sw.ElapsedMilliseconds
  $slow = $durationMs -gt [int]$route.MaxMs
  $passed = $ok -and (-not $slow)

  $result = [PSCustomObject]@{
    path = $route.Path
    label = $route.Label
    critical = [bool]$route.Critical
    statusCode = $statusCode
    durationMs = $durationMs
    maxMs = [int]$route.MaxMs
    ok = $ok
    slow = $slow
    passed = $passed
    error = $errorMessage
    url = $url
  }

  $results += $result

  $color = if ($passed) { "Green" } elseif ($ok) { "Yellow" } else { "Red" }
  Write-Host (($result.path).PadRight(36) + " " + ($statusCode.ToString()).PadLeft(3) + " " + ($durationMs.ToString()).PadLeft(5) + "ms" + " " + ($(if($passed){"OK"}elseif($slow){"SLOW"}else{"FAIL"}))) -ForegroundColor $color
}

$outDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $outDir "servelect-site-audit-$stamp.json"
$mdPath = Join-Path $outDir "servelect-site-audit-$stamp.md"

$summary = [PSCustomObject]@{
  baseUrl = $BaseUrl
  generatedAt = (Get-Date).ToString("s")
  total = $results.Count
  passed = ($results | Where-Object { $_.passed }).Count
  failed = ($results | Where-Object { -not $_.ok }).Count
  slow = ($results | Where-Object { $_.slow }).Count
  criticalFailed = ($results | Where-Object { $_.critical -and (-not $_.passed) }).Count
  results = $results
}

$summary | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8

$md = @()
$md += "# SERVELECT WORK OS Site Deep Audit"
$md += ""
$md += "- BaseUrl: `$BaseUrl`"
$md += "- GeneratedAt: $($summary.generatedAt)"
$md += "- Total: $($summary.total)"
$md += "- Passed: $($summary.passed)"
$md += "- Failed: $($summary.failed)"
$md += "- Slow: $($summary.slow)"
$md += "- Critical failed/slow: $($summary.criticalFailed)"
$md += ""
$md += "| Route | Status | Duration | Budget | Result |"
$md += "|---|---:|---:|---:|---|"
foreach ($r in $results) {
  $resultText = if ($r.passed) { "OK" } elseif ($r.slow -and $r.ok) { "SLOW" } else { "FAIL" }
  $md += "| `$($r.path)` | $($r.statusCode) | $($r.durationMs)ms | $($r.maxMs)ms | $resultText |"
}
$md += ""
$md += "## Next actions"
$md += ""
$md += "- Orice rută FAIL trebuie reparată înainte de următorul build major."
$md += "- Orice rută SLOW critică trebuie optimizată sau încărcată lazy."
$md += "- `/taskuri` trebuie testat manual în browser după Ctrl+F5 sau Incognito."

$md -join "`n" | Set-Content $mdPath -Encoding UTF8

Write-Host ""
Write-Host "Audit JSON: $jsonPath" -ForegroundColor Cyan
Write-Host "Audit MD:   $mdPath" -ForegroundColor Cyan

if ($summary.criticalFailed -gt 0) {
  Write-Host "Audit terminat cu probleme critice." -ForegroundColor Red
  exit 1
}

Write-Host "Audit terminat." -ForegroundColor Green
