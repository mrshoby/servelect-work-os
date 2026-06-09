param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BrowserPath = "",
  [int]$Port = 3100,
  [switch]$SkipQa,
  [switch]$UseDevServer
)

$ErrorActionPreference = "Stop"
$BaseUrl = "http://127.0.0.1:$Port"
$OutputDir = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.17_REAL_SCREENSHOTS"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# Curatam doar fisierele de audit vechi, nu stergem manual alte foldere utile.
Get-ChildItem -Path $OutputDir -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $OutputDir -Directory -Filter "profile_*" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

function Find-Browser {
  param([string]$ExplicitPath)
  if ($ExplicitPath -and (Test-Path $ExplicitPath)) { return $ExplicitPath }

  $paths = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )

  foreach ($path in $paths) {
    if ($path -and (Test-Path $path)) { return $path }
  }

  $cmd = Get-Command msedge.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $cmd = Get-Command chrome.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $appPathKeys = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
  )
  foreach ($key in $appPathKeys) {
    try {
      $value = (Get-ItemProperty -Path $key -ErrorAction Stop)."(default)"
      if ($value -and (Test-Path $value)) { return $value }
    } catch {}
  }

  return ""
}

function Wait-HttpOk {
  param([string]$Url, [int]$Seconds = 90)
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return $true }
    } catch {}
    Start-Sleep -Milliseconds 900
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

function Capture-Route {
  param(
    [string]$Browser,
    [string]$Url,
    [string]$Name,
    [string]$OutputDir
  )

  $png = Join-Path $OutputDir "$Name.png"
  $dom = Join-Path $OutputDir "$Name.html"
  $browserStdout = Join-Path $OutputDir "$Name`_browser_stdout.log"
  $browserStderr = Join-Path $OutputDir "$Name`_browser_stderr.log"
  $routeProfile = Join-Path $OutputDir "profile_$Name"
  if (Test-Path $routeProfile) { Remove-Item $routeProfile -Recurse -Force -ErrorAction SilentlyContinue }
  New-Item -ItemType Directory -Force -Path $routeProfile | Out-Null

  $httpStatus = 0
  try { $httpStatus = (Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20).StatusCode } catch { $httpStatus = 0 }

  $commonArgs = @(
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-features=Translate,AutomationControlled",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1920,1080",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    "--user-data-dir=$routeProfile"
  )

  # Salvam DOM-ul ca sa vedem daca pagina este CSS-less, Next error sau client error.
  $domArgs = $commonArgs + @("--dump-dom", "$Url?audit=dom-$Name")
  try {
    $domOutput = & $Browser @domArgs 2>&1
    Set-Content -Path $dom -Value $domOutput -Encoding UTF8
  } catch {
    Set-Content -Path $dom -Value "DOM_CAPTURE_EXCEPTION: $($_.Exception.Message)" -Encoding UTF8
  }

  Start-Sleep -Milliseconds 500

  # Screenshot cu acelasi route-profile curat per pagina, ca sa nu se blocheze Edge pe profil comun.
  $screenArgs = $commonArgs + @("--screenshot=$png", "$Url?audit=screen-$Name")
  try {
    & $Browser @screenArgs 1> $browserStdout 2> $browserStderr
  } catch {
    Add-Content -Path $browserStderr -Value "SCREENSHOT_EXCEPTION: $($_.Exception.Message)" -Encoding UTF8
  }

  $size = 0
  if (Test-Path $png) { $size = (Get-Item $png).Length }
  $domText = ""
  try { $domText = Get-Content -Path $dom -Raw -ErrorAction SilentlyContinue } catch {}

  $state = "MISSING"
  if ($size -gt 50000 -and $httpStatus -eq 200) { $state = "CAPTURED" }
  if ($size -gt 0 -and $size -le 50000) { $state = "CAPTURED_SMALL_OR_ERROR" }
  if ($domText -match "Application error|client-side exception|NEXT_REDIRECT|__next_error__") { $state = "CLIENT_ERROR" }
  if ($domText -match "<body>\s*<div id=\"__next\"?></div>\s*</body>") { $state = "EMPTY_NEXT_BODY" }

  return [PSCustomObject]@{
    Name = $Name
    Url = $Url
    Http = $httpStatus
    Screenshot = $png
    Size = $size
    Dom = $dom
    Stdout = $browserStdout
    Stderr = $browserStderr
    Status = $state
  }
}

$Browser = Find-Browser -ExplicitPath $BrowserPath
if (!$Browser) { throw "Nu gasesc Microsoft Edge sau Google Chrome. Ruleaza scriptul cu -BrowserPath explicit." }

$WebPath = Join-Path $RepoPath "apps\web"
if (!(Test-Path $WebPath)) { throw "Nu gasesc apps/web in RepoPath: $RepoPath" }
Set-Location $RepoPath

Write-Host ""
Write-Host "=== v6.4.17 screenshot capture audit ==="
Write-Host "Repo: $RepoPath"
Write-Host "Browser: $Browser"
Write-Host "Output: $OutputDir"

if (-not $SkipQa) {
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
}

Write-Host ""
Write-Host "=== Start local Next server ==="
Stop-Port -PortNumber $Port
$serverStdout = Join-Path $OutputDir "server_stdout.log"
$serverStderr = Join-Path $OutputDir "server_stderr.log"

if ($UseDevServer) {
  $serverCommand = "pnpm exec next dev -p $Port -H 127.0.0.1"
} else {
  $serverCommand = "pnpm exec next start -p $Port -H 127.0.0.1"
}

$proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c $serverCommand" -WorkingDirectory $WebPath -PassThru -WindowStyle Hidden -RedirectStandardOutput $serverStdout -RedirectStandardError $serverStderr

try {
  if (-not (Wait-HttpOk -Url $BaseUrl -Seconds 90)) {
    $fail = @(
      "# Server start failure v6.4.17",
      "",
      "Command: $serverCommand",
      "BaseUrl: $BaseUrl",
      "Stdout: $serverStdout",
      "Stderr: $serverStderr"
    )
    Set-Content -Path (Join-Path $OutputDir "SERVER_START_FAILURE_REPORT.md") -Value $fail -Encoding UTF8
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

  $results = @()
  foreach ($route in $routes) {
    $url = "$BaseUrl$($route.path)"
    Write-Host "Capture: $($route.name) -> $url"
    $results += Capture-Route -Browser $Browser -Url $url -Name $route.name -OutputDir $OutputDir
    Start-Sleep -Milliseconds 400
  }

  $report = @(
    "# SERVELECT WORK OS v6.4.17 real screenshot capture audit",
    "",
    "Browser: $Browser",
    "BaseUrl: $BaseUrl",
    "OutputDir: $OutputDir",
    "Generated: $(Get-Date -Format o)",
    "",
    "| Screen | Route | HTTP | Size | Screenshot | DOM | Status |",
    "|---|---|---:|---:|---|---|---|"
  )

  foreach ($result in $results) {
    $report += "| $($result.Name) | $($result.Url) | $($result.Http) | $($result.Size) | $($result.Screenshot) | $($result.Dom) | $($result.Status) |"
  }

  Set-Content -Path (Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md") -Value $report -Encoding UTF8

  $bad = $results | Where-Object { $_.Status -ne "CAPTURED" }
  Write-Host ""
  Write-Host "Screenshot audit saved: $OutputDir"
  if ($bad.Count -gt 0) {
    Write-Host "Atentie: exista capturi nevalide. Vezi SCREENSHOT_AUDIT_REPORT.md si fisierele HTML/log per ruta."
    foreach ($item in $bad) { Write-Host " - $($item.Name): $($item.Status), size=$($item.Size)" }
    throw "Screenshot audit incomplet: $($bad.Count) rute nu sunt CAPTURED."
  }
}
finally {
  if ($proc -and -not $proc.HasExited) {
    try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch {}
  }
}
