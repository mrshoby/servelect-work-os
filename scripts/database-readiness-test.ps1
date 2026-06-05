param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app"
)

$ErrorActionPreference = "Stop"

$routes = @(
  "/admin/database",
  "/api/v1/enterprise/database-activation",
  "/api/v1/enterprise/database-health",
  "/api/v1/enterprise/database-schema",
  "/admin/data-foundation",
  "/api/v1/enterprise/data-foundation",
  "/api/v1/enterprise/data-readiness",
  "/taskuri",
  "/enterprise"
)

$results = @()

Write-Host "SERVELECT WORK OS v1.3 Database Readiness Test" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan
Write-Host ""

foreach ($route in $routes) {
  $url = $BaseUrl.TrimEnd("/") + $route
  $watch = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $watch.Stop()
    $status = [int]$response.StatusCode
    $ms = [int]$watch.ElapsedMilliseconds
    $ok = $status -ge 200 -and $status -lt 400
    Write-Host ("{0} {1}ms {2}" -f $status, $ms, $route) -ForegroundColor ($(if ($ok) { "Green" } else { "Yellow" }))
    $results += [pscustomobject]@{ route = $route; url = $url; status = $status; ms = $ms; ok = $ok }
  } catch {
    $watch.Stop()
    Write-Host ("ERR {0} {1}" -f [int]$watch.ElapsedMilliseconds, $route) -ForegroundColor Red
    $results += [pscustomobject]@{ route = $route; url = $url; status = 0; ms = [int]$watch.ElapsedMilliseconds; ok = $false; error = $_.Exception.Message }
  }
}

$outDir = Join-Path (Get-Location) "audit-results"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $outDir "database-readiness-$stamp.json"
$mdPath = Join-Path $outDir "database-readiness-$stamp.md"

$results | ConvertTo-Json -Depth 8 | Set-Content $jsonPath -Encoding UTF8

$failed = @($results | Where-Object { -not $_.ok })
$slow = @($results | Where-Object { $_.ms -gt 2500 })

$md = @()
$md += "# SERVELECT WORK OS v1.3 Database Readiness Test"
$md += ""
$md += "Base URL: $BaseUrl"
$md += "Generated: $(Get-Date -Format o)"
$md += ""
$md += "## Summary"
$md += ""
$md += "- Routes tested: $($results.Count)"
$md += "- Failed: $($failed.Count)"
$md += "- Slow >2500ms: $($slow.Count)"
$md += ""
$md += "## Results"
$md += ""
$md += "| Route | Status | ms | OK |"
$md += "|---|---:|---:|---|"
foreach ($r in $results) {
  $md += "| $($r.route) | $($r.status) | $($r.ms) | $($r.ok) |"
}

$md | Set-Content $mdPath -Encoding UTF8

Write-Host ""
Write-Host "Saved JSON: $jsonPath" -ForegroundColor Cyan
Write-Host "Saved MD:   $mdPath" -ForegroundColor Cyan

if ($failed.Count -gt 0) {
  exit 1
}
