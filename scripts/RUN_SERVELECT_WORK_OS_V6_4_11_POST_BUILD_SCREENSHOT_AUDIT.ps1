param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$OutputDir = "C:\Users\Vlad Taran\Downloads\SERVELECT_WORK_OS_v6.4.11_REAL_SCREENSHOTS",
  [int]$Port = 3100,
  [string]$BrowserPath = ""
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) {
  Write-Host ""
  Write-Host "=== $Text ===" -ForegroundColor Cyan
}

function Add-IfExists([System.Collections.Generic.List[string]]$List, [string]$Path) {
  if (![string]::IsNullOrWhiteSpace($Path) -and (Test-Path $Path)) {
    if (!$List.Contains($Path)) { [void]$List.Add($Path) }
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
        $default = (Get-ItemProperty -Path $key)."(default)"
        if ($default -and (Test-Path $default)) { return $default }
        $path = (Get-ItemProperty -Path $key).Path
        if ($path) {
          $candidate = Join-Path $path $ExeName
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

  $programFiles = @(
    $env:ProgramFiles,
    ${env:ProgramFiles(x86)},
    $env:LOCALAPPDATA
  ) | Where-Object { $_ -and (Test-Path $_) }

  foreach ($root in $programFiles) {
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

function Wait-ForUrl([string]$Url, [int]$Seconds = 90) {
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

if (!(Test-Path $RepoPath)) { throw "Nu gasesc repo-ul: $RepoPath" }

Write-Step "Detect browser for headless screenshots"
$Browser = Find-Browser $BrowserPath
if (!$Browser) {
  Write-Host "Nu am gasit automat Edge/Chrome." -ForegroundColor Yellow
  Write-Host "Verifica manual unde este instalat browserul si ruleaza asa:" -ForegroundColor Yellow
  Write-Host ".\scripts\RUN_SERVELECT_WORK_OS_V6_4_11_POST_BUILD_SCREENSHOT_AUDIT.ps1 -BrowserPath \"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe\"" -ForegroundColor Yellow
  Write-Host "sau:" -ForegroundColor Yellow
  Write-Host ".\scripts\RUN_SERVELECT_WORK_OS_V6_4_11_POST_BUILD_SCREENSHOT_AUDIT.ps1 -BrowserPath \"C:\Program Files\Google\Chrome\Application\chrome.exe\"" -ForegroundColor Yellow
  throw "Nu gasesc Microsoft Edge sau Google Chrome pentru screenshot headless. Scriptul v6.4.11 suporta acum -BrowserPath explicit."
}
Write-Host "Browser gasit: $Browser" -ForegroundColor Green

Write-Step "Prepare output folder"
if (Test-Path $OutputDir) { Remove-Item $OutputDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutputDir | Out-Null

$BaseUrl = "http://localhost:$Port"
$serverStartedByScript = $false
$serverProcess = $null

Write-Step "Start or reuse local Next server"
if (Wait-ForUrl "$BaseUrl/taskuri" 4) {
  Write-Host "Server deja pornit la $BaseUrl" -ForegroundColor Green
} else {
  Write-Host "Pornesc serverul local la $BaseUrl ..."
  Set-Location $RepoPath
  $cmd = "pnpm --filter @servelect/web start -- -p $Port"
  $serverProcess = Start-Process -FilePath $env:ComSpec -ArgumentList "/c", $cmd -WorkingDirectory $RepoPath -PassThru -WindowStyle Minimized
  $serverStartedByScript = $true
  if (!(Wait-ForUrl "$BaseUrl/taskuri" 120)) {
    if ($serverProcess -and !$serverProcess.HasExited) { Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue }
    throw "Serverul local nu a pornit la $BaseUrl. Ruleaza manual: pnpm --filter @servelect/web start -- -p $Port"
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

Write-Step "Capture screenshots"
$reportLines = @()
$reportLines += "# SERVELECT WORK OS v6.4.11 screenshot audit"
$reportLines += ""
$reportLines += "Browser: $Browser"
$reportLines += "BaseUrl: $BaseUrl"
$reportLines += "OutputDir: $OutputDir"
$reportLines += ""
$reportLines += "| Screen | Route | Screenshot | Status |"
$reportLines += "|---|---|---|---|"

foreach ($route in $routes) {
  $file = Join-Path $OutputDir ($route.Name + ".png")
  Write-Host "Capture: $($route.Url) -> $file"
  & $Browser --headless=new --disable-gpu --hide-scrollbars --window-size=1920,1080 --screenshot="$file" $route.Url 2>$null
  if (!(Test-Path $file)) {
    & $Browser --headless --disable-gpu --hide-scrollbars --window-size=1920,1080 --screenshot="$file" $route.Url 2>$null
  }
  if (Test-Path $file) {
    $reportLines += "| $($route.Name) | $($route.Url) | $file | PASS |"
  } else {
    $reportLines += "| $($route.Name) | $($route.Url) | $file | FAIL |"
  }
}

$reportPath = Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md"
$reportLines | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "Raport screenshot: $reportPath" -ForegroundColor Green

if ($serverStartedByScript -and $serverProcess -and !$serverProcess.HasExited) {
  Write-Step "Stop local server started by script"
  Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
}

Write-Step "Done"
Write-Host "Screenshot-urile sunt in: $OutputDir" -ForegroundColor Green
