param(
  [string]$BaseUrl = "https://servelect-work-os-web.vercel.app",
  [int]$WarnMs = 1500,
  [int]$FailMs = 4000,
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = "Continue"

$routes = @(
  "/",
  "/dashboard",
  "/taskuri",
  "/proiecte",
  "/calendar",
  "/echipa",
  "/crm",
  "/iot",
  "/echipamente",
  "/mentenanta",
  "/finantari",
  "/documente",
  "/rapoarte",
  "/administrare",
  "/action-center",
  "/workflows",
  "/admin/system",
  "/admin/audit",
  "/admin/release",
  "/admin/performance",
  "/api/v1/system/status",
  "/api/v1/system/readiness",
  "/api/v1/performance/audit",
  "/api/v1/performance/deep-audit"
)

$root = Get-Location
$outDir = Join-Path $root "audit-results"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $outDir "site-deep-audit-$stamp.json"
$mdPath = Join-Path $outDir "site-deep-audit-$stamp.md"

Write-Host ""
Write-Host "=== SERVELECT WORK OS SITE DEEP AUDIT ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "WarnMs:   $WarnMs" -ForegroundColor Cyan
Write-Host "FailMs:   $FailMs" -ForegroundColor Cyan
Write-Host ""

$results = @()

foreach ($route in $routes) {
  $url = ($BaseUrl.TrimEnd("/")) + $route
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $statusCode = $null
  $status = "OK"
  $errorMessage = $null
  $bytes = 0

  try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec $TimeoutSec -MaximumRedirection 5 -UseBasicParsing
    $sw.Stop()
    $statusCode = [int]$response.StatusCode
    if ($response.Content) {
      $bytes = [System.Text.Encoding]::UTF8.GetByteCount([string]$response.Content)
    }

    if ($statusCode -ge 400) {
      $status = "FAIL"
    } elseif ($sw.ElapsedMilliseconds -ge $FailMs) {
      $status = "FAIL"
    } elseif ($sw.ElapsedMilliseconds -ge $WarnMs) {
      $status = "SLOW"
    }
  } catch {
    $sw.Stop()
    $status = "ERROR"
    $errorMessage = $_.Exception.Message
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $statusCode = [int]$_.Exception.Response.StatusCode
    }
  }

  $row = [PSCustomObject]@{
    Route = $route
    Url = $url
    Status = $status
    StatusCode = $statusCode
    Ms = $sw.ElapsedMilliseconds
    Bytes = $bytes
    Error = $errorMessage
  }

  $results += $row

  $color = "Green"
  if ($status -eq "SLOW") { $color = "Yellow" }
  if ($status -in @("FAIL", "ERROR")) { $color = "Red" }

  Write-Host (("{0,-7} {1,5}ms {2,-35} {3}" -f $status, $sw.ElapsedMilliseconds, $route, $statusCode)) -ForegroundColor $color
}

$summary = [PSCustomObject]@{
  BaseUrl = $BaseUrl
  GeneratedAt = (Get-Date).ToString("s")
  Total = $results.Count
  OK = ($results | Where-Object { $_.Status -eq "OK" }).Count
  SLOW = ($results | Where-Object { $_.Status -eq "SLOW" }).Count
  FAIL = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
  ERROR = ($results | Where-Object { $_.Status -eq "ERROR" }).Count
  WarnMs = $WarnMs
  FailMs = $FailMs
}

[PSCustomObject]@{
  Summary = $summary
  Results = $results
} | ConvertTo-Json -Depth 8 | Set-Content $jsonPath -Encoding UTF8

$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# SERVELECT WORK OS — Site Deep Audit")
[void]$md.AppendLine("")
[void]$md.AppendLine("- Base URL: `$BaseUrl`")
[void]$md.AppendLine("- Generated: $($summary.GeneratedAt)")
[void]$md.AppendLine("- OK: $($summary.OK)")
[void]$md.AppendLine("- SLOW: $($summary.SLOW)")
[void]$md.AppendLine("- FAIL: $($summary.FAIL)")
[void]$md.AppendLine("- ERROR: $($summary.ERROR)")
[void]$md.AppendLine("")
[void]$md.AppendLine("| Status | ms | HTTP | Route | Error |")
[void]$md.AppendLine("|---|---:|---:|---|---|")

foreach ($r in $results) {
  $err = if ($r.Error) { ($r.Error -replace "\|", "/") } else { "" }
  [void]$md.AppendLine("| $($r.Status) | $($r.Ms) | $($r.StatusCode) | `$($r.Route)` | $err |")
}

[void]$md.AppendLine("")
[void]$md.AppendLine("## Manual checks")
[void]$md.AppendLine("")
[void]$md.AppendLine("Acest audit măsoară răspunsul serverului. Pentru freeze-uri client-side, verifică manual în browser:")
[void]$md.AppendLine("")
[void]$md.AppendLine("- `/taskuri`: tab switching, drawer, create modal, board drag/drop, scroll;")
[void]$md.AppendLine("- `/proiecte`: timeline, listă, board, cards;")
[void]$md.AppendLine("- `/action-center`: filtre și listă acțiuni;")
[void]$md.AppendLine("- topbar: search fără suprapunere;")
[void]$md.AppendLine("- responsive: mobile/tablet/desktop;")
[void]$md.AppendLine("- DevTools Console: fără erori roșii;")
[void]$md.AppendLine("- Incognito / Ctrl+F5 dacă există localStorage vechi.")

$md.ToString() | Set-Content $mdPath -Encoding UTF8

Write-Host ""
Write-Host "Audit JSON: $jsonPath" -ForegroundColor Cyan
Write-Host "Audit MD:   $mdPath" -ForegroundColor Cyan
Write-Host ""

if ($summary.FAIL -gt 0 -or $summary.ERROR -gt 0) {
  Write-Host "Audit terminat cu FAIL/ERROR. Verifică raportul." -ForegroundColor Red
  exit 2
}

if ($summary.SLOW -gt 0) {
  Write-Host "Audit terminat cu rute lente. Verifică raportul." -ForegroundColor Yellow
  exit 1
}

Write-Host "Audit OK." -ForegroundColor Green
exit 0
