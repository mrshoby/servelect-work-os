param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$BrowserPath = "",
  [switch]$NoServerStart,
  [switch]$UseDevServer,
  [switch]$SkipQa,
  [int]$Port = 3100
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) {
  Write-Host ""
  Write-Host "=== $Text ===" -ForegroundColor Cyan
}

function Resolve-Browser([string]$Provided) {
  if ($Provided -and (Test-Path $Provided)) { return (Resolve-Path $Provided).Path }

  $candidates = @()

  foreach ($cmd in @("msedge.exe","chrome.exe")) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found -and $found.Source) { $candidates += $found.Source }
  }

  $candidates += @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )

  foreach ($regPath in @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
  )) {
    try {
      $reg = Get-ItemProperty -Path $regPath -ErrorAction Stop
      if ($reg.'(default)') { $candidates += $reg.'(default)' }
      if ($reg.Path) { $candidates += $reg.Path }
    } catch {}
  }

  foreach ($candidate in $candidates | Where-Object { $_ } | Select-Object -Unique) {
    if (Test-Path $candidate) { return (Resolve-Path $candidate).Path }
  }

  throw 'Nu gasesc Microsoft Edge/Chrome. Ruleaza cu -BrowserPath "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"'
}

function Test-UrlReady([string]$Url) {
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
    return ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500)
  } catch {
    return $false
  }
}

function Stop-PortProcess([int]$PortNumber) {
  try {
    $connections = Get-NetTCPConnection -LocalPort $PortNumber -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
      if ($conn.OwningProcess -and $conn.OwningProcess -ne $PID) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
      }
    }
  } catch {}
}

function Start-NextServer([string]$Repo, [int]$PortNumber, [string]$ReadyUrl, [switch]$UseDev) {
  if (Test-UrlReady $ReadyUrl) {
    Write-Host "Server existent detectat la $ReadyUrl"
    return $null
  }

  Stop-PortProcess -PortNumber $PortNumber

  $webDir = Join-Path $Repo "apps\web"
  if (!(Test-Path $webDir)) { throw "Nu gasesc apps\web in $Repo" }

  $logs = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.21_REAL_SCREENSHOTS"
  New-Item -ItemType Directory -Path $logs -Force | Out-Null

  if ($UseDev) {
    $command = "cd /d `"$webDir`" && pnpm dev -- -p $PortNumber -H 127.0.0.1"
  } else {
    $command = "cd /d `"$webDir`" && pnpm exec next start -p $PortNumber -H 127.0.0.1"
  }

  Set-Content -Path (Join-Path $logs "server_start_command.txt") -Value $command -Encoding UTF8
  $stdout = Join-Path $logs "server_stdout.log"
  $stderr = Join-Path $logs "server_stderr.log"

  Write-Host "Pornesc serverul local: $command"
  $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $command -RedirectStandardOutput $stdout -RedirectStandardError $stderr -WindowStyle Hidden -PassThru

  for ($i=0; $i -lt 90; $i++) {
    Start-Sleep -Seconds 1
    if (Test-UrlReady $ReadyUrl) {
      Write-Host "Server pornit la $ReadyUrl"
      return $proc
    }
    if ($proc.HasExited) { break }
  }

  Write-Warning "Serverul nu pare pornit la $ReadyUrl. Vezi loguri: $stdout / $stderr"
  return $proc
}

function Save-Dom([string]$Url, [string]$OutPath) {
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
    $resp.Content | Set-Content -Path $OutPath -Encoding UTF8
    return @{ Code = $resp.StatusCode; Text = $resp.Content }
  } catch {
    ("REQUEST_ERROR: " + $_.Exception.Message) | Set-Content -Path $OutPath -Encoding UTF8
    return @{ Code = 0; Text = "" }
  }
}

function Invoke-HeadlessScreenshot(
  [string]$Browser,
  [string]$Url,
  [string]$PngPath,
  [string]$ProfileDir,
  [string]$StdoutPath,
  [string]$StderrPath
) {
  if (Test-Path $PngPath) { Remove-Item $PngPath -Force -ErrorAction SilentlyContinue }
  if (Test-Path $ProfileDir) { Remove-Item $ProfileDir -Recurse -Force -ErrorAction SilentlyContinue }
  New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null

  $argSets = @(
    @(
      "--headless=new",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--hide-scrollbars",
      "--window-size=1440,1100",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=12000",
      "--run-all-compositor-stages-before-draw",
      "--user-data-dir=$ProfileDir",
      "--screenshot=$PngPath",
      $Url
    ),
    @(
      "--headless",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--hide-scrollbars",
      "--window-size=1440,1100",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=12000",
      "--user-data-dir=$ProfileDir",
      "--screenshot=$PngPath",
      $Url
    ),
    @(
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1440,1100",
      "--user-data-dir=$ProfileDir",
      "--screenshot=$PngPath",
      $Url
    )
  )

  $attempt = 0
  foreach ($args in $argSets) {
    $attempt++
    $attemptStdout = $StdoutPath.Replace(".log", "_attempt$attempt.log")
    $attemptStderr = $StderrPath.Replace(".log", "_attempt$attempt.log")

    try {
      Set-Content -Path $attemptStdout -Value ("Browser: " + $Browser + "`nArgs:`n" + ($args -join "`n")) -Encoding UTF8
      $p = Start-Process -FilePath $Browser -ArgumentList $args -RedirectStandardOutput $attemptStdout -RedirectStandardError $attemptStderr -WindowStyle Hidden -PassThru
      $okExit = $p.WaitForExit(45 * 1000)
      if (-not $okExit) {
        try { $p.Kill() } catch {}
        Add-Content -Path $attemptStderr -Value "`nTIMEOUT waiting browser screenshot"
      }
    } catch {
      Add-Content -Path $attemptStderr -Value ("`nSTART_PROCESS_ERROR: " + $_.Exception.Message)
    }

    Start-Sleep -Milliseconds 750

    if (Test-Path $PngPath) {
      $len = (Get-Item $PngPath).Length
      if ($len -gt 0) {
        return @{ Ok = $true; Bytes = $len; Attempt = $attempt }
      }
    }
  }

  # final fallback: shell command line. Useful when Start-Process argument passing is broken.
  try {
    $cmdArgs = @(
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1440,1100",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=12000",
      "--user-data-dir=""$ProfileDir""",
      "--screenshot=""$PngPath""",
      """$Url"""
    ) -join " "
    $cmd = """" + $Browser + """ " + $cmdArgs
    Set-Content -Path $StdoutPath -Value ("CMD fallback:`n" + $cmd) -Encoding UTF8
    cmd.exe /c $cmd 1>> $StdoutPath 2>> $StderrPath
    Start-Sleep -Milliseconds 750
    if (Test-Path $PngPath) {
      $len2 = (Get-Item $PngPath).Length
      if ($len2 -gt 0) {
        return @{ Ok = $true; Bytes = $len2; Attempt = 4 }
      }
    }
  } catch {
    Add-Content -Path $StderrPath -Value ("`nCMD_FALLBACK_ERROR: " + $_.Exception.Message)
  }

  return @{ Ok = $false; Bytes = 0; Attempt = 0 }
}

Write-Step "SERVELECT WORK OS v6.4.21 real screenshot audit"

if (!(Test-Path $RepoPath)) { throw "Nu gasesc repo-ul: $RepoPath" }

$Browser = Resolve-Browser -Provided $BrowserPath
Write-Host "Browser: $Browser"

$OutputDir = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.21_REAL_SCREENSHOTS"
if (Test-Path $OutputDir) { Remove-Item $OutputDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

if (-not $SkipQa) {
  Write-Step "QA"
  Push-Location $RepoPath
  pnpm typecheck
  pnpm lint
  pnpm build
  Pop-Location
}

$ReadyUrl = $BaseUrl.TrimEnd("/")
if (-not $NoServerStart) {
  Write-Step "Start/reuse local server"
  $serverProc = Start-NextServer -Repo $RepoPath -PortNumber $Port -ReadyUrl $ReadyUrl -UseDev:$UseDevServer
}

$routes = @(
  @{ Name = "01_taskuri_overview"; Route = "/taskuri/overview" },
  @{ Name = "02_taskuri_my_work"; Route = "/taskuri/my-work" },
  @{ Name = "03_taskuri_tickets_notificari"; Route = "/taskuri/tickets-notificari" },
  @{ Name = "04_taskuri_proiecte_active"; Route = "/taskuri/proiecte-active" },
  @{ Name = "05_taskuri_proiecte_viitoare"; Route = "/taskuri/proiecte-viitoare" },
  @{ Name = "06_taskuri_proiecte_finalizate"; Route = "/taskuri/proiecte-finalizate" },
  @{ Name = "07_taskuri_board"; Route = "/taskuri/board" },
  @{ Name = "08_taskuri_tabel"; Route = "/taskuri/tabel" },
  @{ Name = "09_taskuri_calendar_gantt"; Route = "/taskuri/calendar-gantt" },
  @{ Name = "10_taskuri_workload_aprobari"; Route = "/taskuri/workload-aprobari" }
)

$results = @()

Write-Step "Capture routes"

foreach ($route in $routes) {
  $name = $route.Name
  $url = $ReadyUrl + $route.Route
  $png = Join-Path $OutputDir ($name + ".png")
  $html = Join-Path $OutputDir ($name + ".html")
  $stdout = Join-Path $OutputDir ($name + "_browser_stdout.log")
  $stderr = Join-Path $OutputDir ($name + "_browser_stderr.log")
  $profile = Join-Path $OutputDir ("profile_" + $name)

  Write-Host "Capturing $name -> $url"

  $dom = Save-Dom -Url $url -OutPath $html
  $shot = Invoke-HeadlessScreenshot -Browser $Browser -Url $url -PngPath $png -ProfileDir $profile -StdoutPath $stdout -StderrPath $stderr

  $state = "NO_PNG"
  $bytes = 0
  if (Test-Path $png) { $bytes = (Get-Item $png).Length }

  if ($dom.Code -eq 0) {
    $state = "HTTP_FAIL"
  } elseif (-not $shot.Ok -or $bytes -eq 0) {
    $state = "NO_PNG"
  } elseif ($bytes -lt 5000) {
    $state = "CAPTURED_SMALL_OR_ERROR"
  } elseif ($dom.Text -match "client-side exception has occurred" -or $dom.Text -match "Application error") {
    $state = "CAPTURED_BUT_CLIENT_ERROR"
  } elseif ($dom.Text -match '<div id="__next"></div>') {
    $state = "EMPTY_NEXT_BODY"
  } else {
    $state = "CAPTURED"
  }

  $results += [pscustomobject]@{
    Name = $name
    Route = $route.Route
    Url = $url
    HTTP = $dom.Code
    State = $state
    PngBytes = $bytes
    PngPath = $png
    HtmlPath = $html
    StdoutPath = $stdout
    StderrPath = $stderr
    Attempt = $shot.Attempt
  }
}

$csvPath = Join-Path $OutputDir "SCREENSHOT_AUDIT_RESULTS.csv"
$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

$reportPath = Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md"
$captured = @($results | Where-Object { $_.State -eq "CAPTURED" }).Count
$problem = @($results | Where-Object { $_.State -ne "CAPTURED" }).Count

$lines = @()
$lines += "# SERVELECT WORK OS v6.4.21 real screenshot audit"
$lines += ""
$lines += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += "BaseUrl: $ReadyUrl"
$lines += "Browser: $Browser"
$lines += ""
$lines += "Captured clean: $captured / $($results.Count)"
$lines += "Problem routes: $problem / $($results.Count)"
$lines += ""
$lines += "| Name | Route | HTTP | State | PNG bytes | Attempt |"
$lines += "|---|---|---:|---|---:|---:|"
foreach ($r in $results) {
  $lines += "| $($r.Name) | $($r.Route) | $($r.HTTP) | $($r.State) | $($r.PngBytes) | $($r.Attempt) |"
}
$lines += ""
$lines += "## Evidence"
$lines += "For each route, this folder contains PNG/HTML/browser stdout/stderr files when generated."
$lines += "If PNG is NO_PNG, inspect the matching *_browser_stderr.log and *_browser_stdout.log."

$lines | Set-Content -Path $reportPath -Encoding UTF8

Write-Host ""
Write-Host "OutputDir: $OutputDir"
Write-Host "Report: $reportPath"
Write-Host "CSV: $csvPath"
Write-Host ""
foreach ($r in $results) {
  Write-Host "$($r.Name) -> $($r.State) | HTTP $($r.HTTP) | $($r.PngBytes) bytes | attempt $($r.Attempt)"
}

if ($problem -gt 0) {
  Write-Warning "Auditul a gasit $problem rute care nu sunt CAPTURED. Nu arunc exceptie ca sa poti trimite raportul/logurile."
}
