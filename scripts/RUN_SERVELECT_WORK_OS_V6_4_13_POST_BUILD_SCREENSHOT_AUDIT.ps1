param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$OutputDir = "C:\Users\Vlad Taran\Downloads\SERVELECT_WORK_OS_v6.4.13_REAL_SCREENSHOTS",
  [int]$Port = 3100,
  [string]$BrowserPath = "",
  [string]$BaseUrl = "",
  [switch]$SkipStart,
  [switch]$UseDevServer
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) {
  Write-Host ""
  Write-Host "=== $Text ===" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) { Write-Host $Text -ForegroundColor Green }
function Write-Warn([string]$Text) { Write-Host $Text -ForegroundColor Yellow }

function Add-IfExists([System.Collections.Generic.List[string]]$List, [string]$Path) {
  if (![string]::IsNullOrWhiteSpace($Path) -and (Test-Path $Path)) {
    $resolved = (Resolve-Path $Path).Path
    if (!$List.Contains($resolved)) { [void]$List.Add($resolved) }
  }
}

function Get-AppPathFromRegistry([string]$ExeName) {
  $keys = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\$ExeName",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\App Paths\$ExeName",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\$ExeName"
  )
  foreach ($key in $keys) {
    try {
      if (Test-Path $key) {
        $props = Get-ItemProperty -Path $key
        $default = $props.'(default)'
        if ($default -and (Test-Path $default)) { return $default }
        if ($props.Path) {
          $candidate = Join-Path $props.Path $ExeName
          if (Test-Path $candidate) { return $candidate }
        }
      }
    } catch {}
  }
  return $null
}

function Find-Browser([string]$ExplicitPath) {
  $candidates = New-Object 'System.Collections.Generic.List[string]'

  Add-IfExists $candidates $ExplicitPath
  Add-IfExists $candidates $env:EDGE_PATH
  Add-IfExists $candidates $env:CHROME_PATH
  Add-IfExists $candidates $env:BROWSER_PATH

  foreach ($cmd in @("msedge.exe", "chrome.exe", "chromium.exe", "msedge", "chrome", "chromium")) {
    try {
      $found = Get-Command $cmd -ErrorAction SilentlyContinue
      if ($found -and $found.Source) { Add-IfExists $candidates $found.Source }
    } catch {}
  }

  $roots = @(
    $env:ProgramFiles,
    ${env:ProgramFiles(x86)},
    $env:LOCALAPPDATA
  ) | Where-Object { $_ -and (Test-Path $_) }

  foreach ($root in $roots) {
    Add-IfExists $candidates (Join-Path $root "Microsoft\Edge\Application\msedge.exe")
    Add-IfExists $candidates (Join-Path $root "Google\Chrome\Application\chrome.exe")
    Add-IfExists $candidates (Join-Path $root "Chromium\Application\chrome.exe")
  }

  foreach ($regExe in @("msedge.exe", "chrome.exe")) {
    Add-IfExists $candidates (Get-AppPathFromRegistry $regExe)
  }

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) { return $candidate }
  }

  return $null
}

function Wait-ForUrl([string]$Url, [int]$Seconds = 120) {
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return $true }
    } catch {}
    Start-Sleep -Seconds 2
  }
  return $false
}

function Test-UrlStatus([string]$Url) {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
    return "$($response.StatusCode)"
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      return "$([int]$_.Exception.Response.StatusCode)"
    }
    return "ERR: $($_.Exception.Message)"
  }
}

function Stop-StartedServer($Process) {
  if ($Process -and !$Process.HasExited) {
    try { Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue } catch {}
  }
}

function Start-ServerCommand([string]$Name, [string]$Cwd, [string]$Command, [string]$BaseUrlToWait, [string]$LogDir, [int]$WaitSeconds) {
  $stdout = Join-Path $LogDir ("server_" + $Name + "_stdout.log")
  $stderr = Join-Path $LogDir ("server_" + $Name + "_stderr.log")
  $cmdFile = Join-Path $LogDir ("server_" + $Name + "_command.txt")
  "cd /d `"$Cwd`" && $Command" | Set-Content -Path $cmdFile -Encoding UTF8

  Write-Host "Incerc server command: $Name" -ForegroundColor Yellow
  Write-Host "  CWD: $Cwd"
  Write-Host "  CMD: $Command"

  $argLine = "/c cd /d `"$Cwd`" && $Command > `"$stdout`" 2> `"$stderr`""
  $process = Start-Process -FilePath $env:ComSpec -ArgumentList $argLine -WorkingDirectory $Cwd -PassThru -WindowStyle Minimized

  if (Wait-ForUrl $BaseUrlToWait $WaitSeconds) {
    Write-Ok "Server pornit cu: $Name"
    return $process
  }

  Write-Warn "Serverul nu a raspuns cu: $Name"
  Stop-StartedServer $process
  return $null
}

if (!(Test-Path $RepoPath)) { throw "Nu gasesc repo-ul: $RepoPath" }
$WebPath = Join-Path $RepoPath "apps\web"
if (!(Test-Path $WebPath)) { throw "Nu gasesc apps\web in repo: $WebPath" }

Write-Step "Prepare output folder"
if (Test-Path $OutputDir) { Remove-Item $OutputDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutputDir | Out-Null

Write-Step "Detect browser for headless screenshots"
$Browser = Find-Browser $BrowserPath
if (!$Browser) {
  $msg = @"
Nu gasesc Microsoft Edge sau Google Chrome pentru screenshot headless.
Ruleaza cu -BrowserPath explicit, de exemplu:
  .\scripts\RUN_SERVELECT_WORK_OS_V6_4_13_POST_BUILD_SCREENSHOT_AUDIT.ps1 -BrowserPath "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
  .\scripts\RUN_SERVELECT_WORK_OS_V6_4_13_POST_BUILD_SCREENSHOT_AUDIT.ps1 -BrowserPath "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  .\scripts\RUN_SERVELECT_WORK_OS_V6_4_13_POST_BUILD_SCREENSHOT_AUDIT.ps1 -BrowserPath "C:\Program Files\Google\Chrome\Application\chrome.exe"
"@
  $msg | Set-Content -Path (Join-Path $OutputDir "BROWSER_NOT_FOUND.txt") -Encoding UTF8
  throw $msg
}
Write-Ok "Browser gasit: $Browser"

if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  $BaseUrl = "http://127.0.0.1:$Port"
}
$ReadyUrl = "$BaseUrl/taskuri/overview"
$serverStartedByScript = $false
$serverProcess = $null

Write-Step "Start or reuse local Next server"
if ($SkipStart) {
  Write-Warn "SkipStart activ. Verific server existent la $ReadyUrl"
  if (!(Wait-ForUrl $ReadyUrl 15)) {
    throw "SkipStart este activ, dar serverul nu raspunde la $ReadyUrl"
  }
} elseif (Wait-ForUrl $ReadyUrl 5) {
  Write-Ok "Server deja pornit la $BaseUrl"
} else {
  Write-Host "Pornesc server local la $BaseUrl ..."

  $commands = @()
  if ($UseDevServer) {
    $commands += @{ Name = "apps-web-dev"; Cwd = $WebPath; Cmd = "pnpm dev -- -p $Port -H 127.0.0.1"; Wait = 180 }
    $commands += @{ Name = "root-filter-dev"; Cwd = $RepoPath; Cmd = "pnpm --filter @servelect/web dev -- -p $Port -H 127.0.0.1"; Wait = 180 }
  } else {
    $commands += @{ Name = "apps-web-start"; Cwd = $WebPath; Cmd = "pnpm start -- -p $Port -H 127.0.0.1"; Wait = 120 }
    $commands += @{ Name = "apps-web-next-start"; Cwd = $WebPath; Cmd = "pnpm exec next start -p $Port -H 127.0.0.1"; Wait = 120 }
    $commands += @{ Name = "root-filter-start"; Cwd = $RepoPath; Cmd = "pnpm --filter @servelect/web start -- -p $Port -H 127.0.0.1"; Wait = 120 }
    $commands += @{ Name = "apps-web-dev-fallback"; Cwd = $WebPath; Cmd = "pnpm dev -- -p $Port -H 127.0.0.1"; Wait = 180 }
    $commands += @{ Name = "root-filter-dev-fallback"; Cwd = $RepoPath; Cmd = "pnpm --filter @servelect/web dev -- -p $Port -H 127.0.0.1"; Wait = 180 }
  }

  foreach ($entry in $commands) {
    $serverProcess = Start-ServerCommand -Name $entry.Name -Cwd $entry.Cwd -Command $entry.Cmd -BaseUrlToWait $ReadyUrl -LogDir $OutputDir -WaitSeconds $entry.Wait
    if ($serverProcess) {
      $serverStartedByScript = $true
      break
    }
  }

  if (!$serverProcess) {
    $failure = Join-Path $OutputDir "SERVER_START_FAILURE_REPORT.md"
    $lines = @()
    $lines += "# Server start failure"
    $lines += ""
    $lines += "BaseUrl: $BaseUrl"
    $lines += "ReadyUrl: $ReadyUrl"
    $lines += "RepoPath: $RepoPath"
    $lines += "WebPath: $WebPath"
    $lines += ""
    $lines += "Am incercat mai multe comenzi de start. Vezi fisierele server_*_stdout.log si server_*_stderr.log din acest folder."
    $lines += ""
    $lines += "## Comenzi manuale recomandate"
    $lines += 'POWERSHELL COMMANDS:'
    $lines += "cd `"$WebPath`""
    $lines += "pnpm start -- -p $Port -H 127.0.0.1"
    $lines += "# daca start nu merge, ruleaza dev:"
    $lines += "pnpm dev -- -p $Port -H 127.0.0.1"
    $lines += 'END POWERSHELL COMMANDS'
    $lines | Set-Content -Path $failure -Encoding UTF8
    throw "Serverul local nu a pornit la $ReadyUrl. Am salvat loguri in: $OutputDir"
  }
}

$routes = @(
  @{ Name = "01_taskuri_overview"; Url = "$BaseUrl/taskuri/overview" },
  @{ Name = "02_taskuri_my_work"; Url = "$BaseUrl/taskuri/my-work" },
  @{ Name = "03_taskuri_tickets_notificari"; Url = "$BaseUrl/taskuri/tickets-notificari" },
  @{ Name = "04_taskuri_proiecte_active"; Url = "$BaseUrl/taskuri/proiecte-active" },
  @{ Name = "05_taskuri_proiecte_viitoare"; Url = "$BaseUrl/taskuri/proiecte-viitoare" },
  @{ Name = "06_taskuri_proiecte_finalizate"; Url = "$BaseUrl/taskuri/proiecte-finalizate" },
  @{ Name = "07_taskuri_board"; Url = "$BaseUrl/taskuri/board" },
  @{ Name = "08_taskuri_tabel"; Url = "$BaseUrl/taskuri/tabel" },
  @{ Name = "09_taskuri_calendar_gantt"; Url = "$BaseUrl/taskuri/calendar-gantt" },
  @{ Name = "10_taskuri_workload_aprobari"; Url = "$BaseUrl/taskuri/workload-aprobari" }
)

Write-Step "Validate routes before screenshot"
$routeStatuses = @{}
foreach ($route in $routes) {
  $status = Test-UrlStatus $route.Url
  $routeStatuses[$route.Name] = $status
  Write-Host "$($route.Name): $status -> $($route.Url)"
}

Write-Step "Capture screenshots"
$reportLines = @()
$reportLines += "# SERVELECT WORK OS v6.4.12 real screenshot audit"
$reportLines += ""
$reportLines += "Browser: $Browser"
$reportLines += "BaseUrl: $BaseUrl"
$reportLines += "OutputDir: $OutputDir"
$reportLines += "Generated: $(Get-Date -Format s)"
$reportLines += ""
$reportLines += "| Screen | Route | HTTP | Screenshot | Status |"
$reportLines += "|---|---|---:|---|---|"

foreach ($route in $routes) {
  $file = Join-Path $OutputDir ($route.Name + ".png")
  Write-Host "Capture: $($route.Url) -> $file"

  $argsNew = @(
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--hide-scrollbars",
    "--window-size=1920,1080",
    "--virtual-time-budget=5000",
    "--run-all-compositor-stages-before-draw",
    "--screenshot=$file",
    $route.Url
  )
  & $Browser @argsNew 2>$null

  if (!(Test-Path $file)) {
    $argsOld = @(
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--hide-scrollbars",
      "--window-size=1920,1080",
      "--virtual-time-budget=5000",
      "--screenshot=$file",
      $route.Url
    )
    & $Browser @argsOld 2>$null
  }

  if (Test-Path $file) {
    $reportLines += "| $($route.Name) | $($route.Url) | $($routeStatuses[$route.Name]) | $file | PASS |"
  } else {
    $reportLines += "| $($route.Name) | $($route.Url) | $($routeStatuses[$route.Name]) | $file | FAIL |"
  }
}

$reportPath = Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md"
$reportLines | Set-Content -Path $reportPath -Encoding UTF8
Write-Ok "Raport screenshot: $reportPath"

if ($serverStartedByScript -and $serverProcess -and !$serverProcess.HasExited) {
  Write-Step "Stop local server started by script"
  Stop-StartedServer $serverProcess
}

Write-Step "Done"
Write-Ok "Screenshot-urile sunt in: $OutputDir"
