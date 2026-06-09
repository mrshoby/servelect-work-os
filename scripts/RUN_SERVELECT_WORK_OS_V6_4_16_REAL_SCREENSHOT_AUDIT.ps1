param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BrowserPath = "",
  [int]$Port = 3100,
  [switch]$SkipScreenshots
)

$ErrorActionPreference = "Stop"
$BaseUrl = "http://127.0.0.1:$Port"
$OutputDir = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.16_REAL_SCREENSHOTS"
$BrowserProfile = Join-Path $OutputDir "browser-profile"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
if (Test-Path $BrowserProfile) { Remove-Item $BrowserProfile -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $BrowserProfile | Out-Null

function Find-Browser {
  param([string]$ExplicitPath)
  if ($ExplicitPath -and (Test-Path $ExplicitPath)) { return $ExplicitPath }

  $candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )

  foreach ($path in $candidates) {
    if ($path -and (Test-Path $path)) { return $path }
  }

  $cmd = Get-Command msedge.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $cmd = Get-Command chrome.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  return ""
}

function Wait-HttpOk {
  param([string]$Url, [int]$Seconds = 60)
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return $true }
    } catch {
      Start-Sleep -Milliseconds 900
    }
  }
  return $false
}

function Stop-Port {
  param([int]$PortNumber)
  try {
    $connections = Get-NetTCPConnection -LocalPort $PortNumber -State Listen -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
      try { Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
  } catch {}
}

$WebPath = Join-Path $RepoPath "apps\web"
$Browser = Find-Browser -ExplicitPath $BrowserPath
if (!$Browser) { throw "Nu gasesc Microsoft Edge sau Chrome. Ruleaza cu -BrowserPath explicit." }

Set-Location $RepoPath

Write-Host ""
Write-Host "=== Preflight static guards ==="
$TaskuriFile = Join-Path $RepoPath "apps\web\components\work-os\V64TaskuriFunctionalArea.tsx"
$TaskuriText = Get-Content $TaskuriFile -Raw
if ($TaskuriText.Contains("project.risks")) { throw "project.risks inca exista. Fixul nu este aplicat." }
if (-not $TaskuriText.Contains("normalizeTask(raw")) { throw "Lipseste normalizeTask; protectia pentru localStorage vechi nu este aplicata." }
if (-not $TaskuriText.Contains("servelect-work-os-v64-taskuri-functional-state-v6416")) { throw "Storage key v6.4.16 lipseste." }
if ($TaskuriText.Contains("if (!task) return null;`r`n  const [commentText")) { throw "TaskDrawer are inca hook dupa return conditionat." }

Write-Host ""
Write-Host "=== pnpm typecheck ==="
pnpm typecheck
if ($LASTEXITCODE -ne 0) { throw "pnpm typecheck a esuat." }

Write-Host ""
Write-Host "=== pnpm lint ==="
pnpm lint
if ($LASTEXITCODE -ne 0) { throw "pnpm lint a esuat." }

Write-Host ""
Write-Host "=== pnpm build ==="
pnpm build
if ($LASTEXITCODE -ne 0) { throw "pnpm build a esuat." }

if ($SkipScreenshots) {
  Write-Host "SkipScreenshots activ. QA tehnic a trecut."
  exit 0
}

Write-Host ""
Write-Host "=== Start or reuse local Next server ==="
Stop-Port -PortNumber $Port
$stdout = Join-Path $OutputDir "server_stdout.log"
$stderr = Join-Path $OutputDir "server_stderr.log"
$proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c pnpm exec next start -p $Port -H 127.0.0.1" -WorkingDirectory $WebPath -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr

try {
  if (-not (Wait-HttpOk -Url $BaseUrl -Seconds 75)) {
    $report = @(
      "# Server start failure v6.4.16",
      "",
      "BaseUrl: $BaseUrl",
      "Stdout: $stdout",
      "Stderr: $stderr",
      "",
      "Ruleaza manual in apps/web:",
      "pnpm exec next start -p $Port -H 127.0.0.1"
    )
    Set-Content -Path (Join-Path $OutputDir "SERVER_START_FAILURE_REPORT.md") -Value $report -Encoding UTF8
    throw "Serverul local nu a pornit la $BaseUrl. Vezi logurile in $OutputDir"
  }

  $routes = @(
    @{ name = "01_taskuri_overview"; path = "/taskuri/overview" },
    @{ name = "02_taskuri_my_work"; path = "/taskuri/my-work" },
    @{ name = "03_taskuri_tickets_notificari"; path = "/taskuri/tickets-notificari" },
    @{ name = "04_taskuri_proiecte_active"; path = "/taskuri/proiecte-active" },
    @{ name = "05_taskuri_proiecte_viitoare"; path = "/taskuri/proiecte-viitoare" },
    @{ name = "06_taskuri_proiecte_finalizate"; path = "/taskuri/proiecte-finalizate" },
    @{ name = "07_taskuri_board"; path = "/taskuri/board" },
    @{ name = "08_taskuri_tabel"; path = "/taskuri/tabel" },
    @{ name = "09_taskuri_calendar_gantt"; path = "/taskuri/calendar-gantt" },
    @{ name = "10_taskuri_workload_aprobari"; path = "/taskuri/workload-aprobari" }
  )

  $reportLines = @(
    "# SERVELECT WORK OS v6.4.16 real screenshot audit",
    "",
    "Browser: $Browser",
    "BaseUrl: $BaseUrl",
    "OutputDir: $OutputDir",
    "Generated: $(Get-Date -Format o)",
    "",
    "| Screen | Route | HTTP | Screenshot | Status |",
    "|---|---|---:|---|---|"
  )

  foreach ($route in $routes) {
    $url = "$BaseUrl$($route.path)"
    $png = Join-Path $OutputDir "$($route.name).png"
    $browserLog = Join-Path $OutputDir "$($route.name)_browser.log"
    $status = 0

    try {
      $status = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15).StatusCode
    } catch {
      $status = 0
    }

    $args = @(
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--disable-extensions",
      "--hide-scrollbars",
      "--window-size=2048,1152",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=8000",
      "--user-data-dir=$BrowserProfile",
      "--screenshot=$png",
      $url
    )

    & $Browser @args 2> $browserLog | Out-Null

    $state = "FAIL"
    if ((Test-Path $png) -and $status -eq 200) {
      $length = (Get-Item $png).Length
      if ($length -gt 50000) { $state = "CAPTURED" } else { $state = "CAPTURED_SMALL_OR_ERROR" }
    }

    $reportLines += "| $($route.name) | $url | $status | $png | $state |"
  }

  Set-Content -Path (Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md") -Value $reportLines -Encoding UTF8
  Write-Host "Screenshot audit complete: $OutputDir"
}
finally {
  if ($proc -and -not $proc.HasExited) {
    try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch {}
  }
}
