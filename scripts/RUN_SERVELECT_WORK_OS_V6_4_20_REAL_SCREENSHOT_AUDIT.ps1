param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$BrowserPath = "",
  [switch]$SkipQa,
  [switch]$NoServerStart,
  [switch]$UseDevServer
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host ("=== " + $Message + " ===") -ForegroundColor Cyan
}

function Ensure-Dir {
  param([string]$Path)
  if (!(Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null }
}

function Test-HttpReady {
  param([string]$Url)
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 4
    return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
  } catch {
    return $false
  }
}

function Find-Browser {
  param([string]$ExplicitPath)

  if ($ExplicitPath -and (Test-Path $ExplicitPath)) {
    return (Resolve-Path $ExplicitPath).Path
  }

  $commands = @("msedge.exe", "chrome.exe")
  foreach ($cmd in $commands) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found -and $found.Source -and (Test-Path $found.Source)) {
      return $found.Source
    }
  }

  $candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path $candidate)) {
      return (Resolve-Path $candidate).Path
    }
  }

  $registryPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
  )

  foreach ($regPath in $registryPaths) {
    try {
      $item = Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue
      $pathValue = $item."(default)"
      if (!$pathValue) { $pathValue = $item."Path" }
      if ($pathValue -and (Test-Path $pathValue)) {
        return (Resolve-Path $pathValue).Path
      }
    } catch {
      # ignore registry lookup errors
    }
  }

  throw "Nu gasesc Microsoft Edge sau Google Chrome. Ruleaza scriptul cu parametrul -BrowserPath si calea completa catre msedge.exe sau chrome.exe. Exemplu: -BrowserPath C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

if (!(Test-Path $RepoPath)) {
  throw ("Nu gasesc repo-ul sursa: " + $RepoPath)
}

$OutputRoot = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.20_REAL_SCREENSHOTS"
if (Test-Path $OutputRoot) { Remove-Item $OutputRoot -Recurse -Force }
Ensure-Dir $OutputRoot

$ReportPath = Join-Path $OutputRoot "SCREENSHOT_AUDIT_REPORT.md"
$CsvPath = Join-Path $OutputRoot "SCREENSHOT_AUDIT_RESULTS.csv"

Write-Step "Repo"
Write-Host $RepoPath
Set-Location $RepoPath

if (-not $SkipQa) {
  Write-Step "pnpm typecheck"
  pnpm typecheck
  Write-Step "pnpm lint"
  pnpm lint
  Write-Step "pnpm build"
  pnpm build
} else {
  Write-Step "QA skipped by parameter"
}

$Browser = Find-Browser -ExplicitPath $BrowserPath
Write-Step "Browser"
Write-Host $Browser

$ServerProcess = $null
$ServerStdout = Join-Path $OutputRoot "server_stdout.log"
$ServerStderr = Join-Path $OutputRoot "server_stderr.log"

if (-not $NoServerStart) {
  Write-Step "Start or reuse local server"
  if (Test-HttpReady -Url $BaseUrl) {
    Write-Host ("Server deja disponibil la " + $BaseUrl)
  } else {
    $cmdFile = Join-Path $OutputRoot "start_server.cmd"
    $webPath = Join-Path $RepoPath "apps\web"
    if ($UseDevServer) {
      $cmdContent = "@echo off`r`ncd /d `"$webPath`"`r`npnpm dev -- -p 3100 -H 127.0.0.1`r`n"
    } else {
      $cmdContent = "@echo off`r`ncd /d `"$webPath`"`r`npnpm start -- -p 3100 -H 127.0.0.1`r`n"
    }
    Set-Content -Path $cmdFile -Value $cmdContent -Encoding ASCII
    $ServerProcess = Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", $cmdFile) -PassThru -WindowStyle Hidden -RedirectStandardOutput $ServerStdout -RedirectStandardError $ServerStderr

    $ready = $false
    for ($i = 1; $i -le 90; $i++) {
      Start-Sleep -Seconds 1
      if (Test-HttpReady -Url $BaseUrl) { $ready = $true; break }
      if ($ServerProcess.HasExited) { break }
    }

    if ($ready) {
      Write-Host ("Server pornit la " + $BaseUrl)
    } else {
      $failure = Join-Path $OutputRoot "SERVER_START_FAILURE_REPORT.md"
      $content = @()
      $content += "# Server start failure"
      $content += ""
      $content += ("BaseUrl: " + $BaseUrl)
      $content += ("UseDevServer: " + [string]$UseDevServer)
      $content += ("ServerStdout: " + $ServerStdout)
      $content += ("ServerStderr: " + $ServerStderr)
      $content += ""
      $content += "Try manual command:"
      $content += "cd apps/web"
      if ($UseDevServer) { $content += "pnpm dev -- -p 3100 -H 127.0.0.1" } else { $content += "pnpm start -- -p 3100 -H 127.0.0.1" }
      Set-Content -Path $failure -Value ($content -join "`r`n") -Encoding UTF8
      Write-Warning ("Serverul local nu a pornit. Am salvat raport: " + $failure)
    }
  }
} else {
  Write-Step "NoServerStart enabled"
  Write-Host ("Folosesc server existent: " + $BaseUrl)
}

$routes = @(
  @{ Name = "01_taskuri_overview"; Path = "/taskuri/overview" },
  @{ Name = "02_taskuri_my_work"; Path = "/taskuri/my-work" },
  @{ Name = "03_taskuri_tickets_notificari"; Path = "/taskuri/tickets-notificari" },
  @{ Name = "04_taskuri_proiecte_active"; Path = "/taskuri/proiecte-active" },
  @{ Name = "05_taskuri_proiecte_viitoare"; Path = "/taskuri/proiecte-viitoare" },
  @{ Name = "06_taskuri_proiecte_finalizate"; Path = "/taskuri/proiecte-finalizate" },
  @{ Name = "07_taskuri_board"; Path = "/taskuri/board" },
  @{ Name = "08_taskuri_tabel"; Path = "/taskuri/tabel" },
  @{ Name = "09_taskuri_calendar_gantt"; Path = "/taskuri/calendar-gantt" },
  @{ Name = "10_taskuri_workload_aprobari"; Path = "/taskuri/workload-aprobari" }
)

$results = @()
Write-Step "Capture screenshots"

foreach ($route in $routes) {
  $name = $route.Name
  $url = $BaseUrl.TrimEnd("/") + $route.Path
  $png = Join-Path $OutputRoot ($name + ".png")
  $html = Join-Path $OutputRoot ($name + ".html")
  $stdout = Join-Path $OutputRoot ($name + "_browser_stdout.log")
  $stderr = Join-Path $OutputRoot ($name + "_browser_stderr.log")
  $profile = Join-Path $OutputRoot ("browser-profile-" + $name)
  Ensure-Dir $profile

  $httpStatus = "UNKNOWN"
  $state = "NO_PNG"
  $size = 0

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 12
    $httpStatus = [string]$response.StatusCode
    Set-Content -Path $html -Value $response.Content -Encoding UTF8
  } catch {
    $httpStatus = "HTTP_FAIL"
    Set-Content -Path $html -Value ("HTTP fetch failed: " + $_.Exception.Message) -Encoding UTF8
  }

  $args = @(
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--user-data-dir=$profile",
    "--window-size=1920,1080",
    "--virtual-time-budget=12000",
    "--screenshot=$png",
    $url
  )

  try {
    $proc = Start-Process -FilePath $Browser -ArgumentList $args -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    if (Test-Path $png) {
      $size = (Get-Item $png).Length
      if ($size -gt 80000) {
        $state = "CAPTURED"
      } elseif ($size -gt 1000) {
        $state = "CAPTURED_SMALL_OR_ERROR"
      } else {
        $state = "CAPTURED_TOO_SMALL"
      }
    } else {
      $state = "NO_PNG"
    }
  } catch {
    $state = "BROWSER_FAIL"
    Set-Content -Path $stderr -Value ("Browser failed: " + $_.Exception.Message) -Encoding UTF8
  }

  if ((Test-Path $png) -and $size -gt 1000) {
    # Keep status based on screenshot. Client-side error will be judged visually from the PNG.
  }

  $results += [pscustomobject]@{
    Name = $name
    Route = $route.Path
    Url = $url
    HttpStatus = $httpStatus
    State = $state
    PngSizeBytes = $size
    Png = $png
    Html = $html
    Stdout = $stdout
    Stderr = $stderr
  }

  Write-Host ($name + " -> " + $state + " | HTTP " + $httpStatus + " | " + $size + " bytes")
}

$csvLines = @("Name,Route,HttpStatus,State,PngSizeBytes,Png,Html,Stdout,Stderr")
foreach ($r in $results) {
  $csvLines += '"{0}","{1}","{2}","{3}",{4},"{5}","{6}","{7}","{8}"' -f $r.Name,$r.Route,$r.HttpStatus,$r.State,$r.PngSizeBytes,$r.Png,$r.Html,$r.Stdout,$r.Stderr
}
Set-Content -Path $CsvPath -Value ($csvLines -join "`r`n") -Encoding UTF8

$captured = @($results | Where-Object { $_.State -eq "CAPTURED" })
$problem = @($results | Where-Object { $_.State -ne "CAPTURED" })

$report = @()
$report += "# SERVELECT WORK OS v6.4.20 real screenshot audit"
$report += ""
$report += ("Generated: " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"))
$report += ("BaseUrl: " + $BaseUrl)
$report += ("Browser: " + $Browser)
$report += ""
$report += ("Captured clean: " + $captured.Count + " / " + $results.Count)
$report += ("Problem routes: " + $problem.Count + " / " + $results.Count)
$report += ""
$report += "| Name | Route | HTTP | State | PNG bytes |"
$report += "|---|---|---:|---|---:|"
foreach ($r in $results) {
  $report += ("| " + $r.Name + " | " + $r.Route + " | " + $r.HttpStatus + " | " + $r.State + " | " + $r.PngSizeBytes + " |")
}
$report += ""
$report += "## Notes"
$report += "This script only captures real screenshots and evidence files. It does not score visual 1:1 automatically. Pages with CAPTURED still require visual comparison against the 10 reference images."
$report += "If a route is not CAPTURED, inspect its PNG/HTML/stdout/stderr files in this folder."
Set-Content -Path $ReportPath -Value ($report -join "`r`n") -Encoding UTF8

Write-Step "Audit completed"
Write-Host ("Report: " + $ReportPath)
Write-Host ("CSV: " + $CsvPath)
Write-Host ("Output folder: " + $OutputRoot)

if ($ServerProcess -and !$ServerProcess.HasExited) {
  # Leave server running for manual inspection by default.
  Write-Host ("Server process left running, PID: " + $ServerProcess.Id)
}
