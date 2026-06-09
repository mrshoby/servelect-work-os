
param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$OutputPath = "C:\Users\Vlad Taran\Downloads\SERVELECT_WORK_OS_v6.4.19_REAL_SCREENSHOT_AUDIT",
  [string]$BrowserPath = "",
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [int]$Port = 3100,
  [switch]$UseDevServer,
  [switch]$SkipQa,
  [switch]$NoServerStart
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) { Write-Host "`n=== $Message ===" -ForegroundColor Cyan }
function Ensure-Dir([string]$Path) { if (!(Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null } }

function Find-Browser([string]$Preferred) {
  if ($Preferred -and (Test-Path $Preferred)) { return (Resolve-Path $Preferred).Path }
  $candidates = @()
  foreach ($cmd in @("msedge.exe", "chrome.exe")) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found) { $candidates += $found.Source }
  }
  $candidates += @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
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
      if ($reg.Path) { $candidates += (Join-Path $reg.Path (Split-Path $regPath -Leaf)) }
    } catch {}
  }
  foreach ($path in $candidates | Where-Object { $_ } | Select-Object -Unique) {
    if (Test-Path $path) { return (Resolve-Path $path).Path }
  }
  return $null
}

function Test-Url([string]$Url) {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    return @{ ok = $true; code = [int]$response.StatusCode; length = ($response.Content | Out-String).Length; content = $response.Content }
  } catch {
    return @{ ok = $false; code = 0; length = 0; content = ""; error = $_.Exception.Message }
  }
}

function Wait-Server([string]$Url, [int]$Seconds) {
  $deadline = (Get-Date).AddSeconds($Seconds)
  do {
    $probe = Test-Url $Url
    if ($probe.ok) { return $true }
    Start-Sleep -Seconds 2
  } while ((Get-Date) -lt $deadline)
  return $false
}

function Start-LocalServer([string]$RepoPath, [string]$BaseUrl, [int]$Port, [bool]$UseDev, [string]$OutputPath) {
  if (Wait-Server $BaseUrl 4) { Write-Host "Server existent detectat la $BaseUrl"; return $null }
  if ($NoServerStart) { Write-Host "NoServerStart activ: nu pornesc serverul local. Folosesc BaseUrl=$BaseUrl"; return $null }
  $webPath = Join-Path $RepoPath "apps\web"
  if (!(Test-Path $webPath)) { throw "Nu gasesc apps/web in repo: $webPath" }
  $stdout = Join-Path $OutputPath "server_stdout.log"
  $stderr = Join-Path $OutputPath "server_stderr.log"
  if ($UseDev) {
    $args = @("exec", "next", "dev", "-p", "$Port", "-H", "127.0.0.1")
  } else {
    $args = @("exec", "next", "start", "-p", "$Port", "-H", "127.0.0.1")
  }
  Write-Host "Pornesc server local: pnpm $($args -join ' ') in $webPath"
  $proc = Start-Process -FilePath "pnpm" -ArgumentList $args -WorkingDirectory $webPath -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru -WindowStyle Hidden
  if (Wait-Server $BaseUrl 45) { Write-Host "Server pornit la $BaseUrl"; return $proc }
  if (!$UseDev) {
    Write-Host "Production start nu a pornit. Incerc fallback dev server..."
    try { if ($proc -and !$proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } } catch {}
    $stdout = Join-Path $OutputPath "server_dev_stdout.log"
    $stderr = Join-Path $OutputPath "server_dev_stderr.log"
    $proc = Start-Process -FilePath "pnpm" -ArgumentList @("exec", "next", "dev", "-p", "$Port", "-H", "127.0.0.1") -WorkingDirectory $webPath -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru -WindowStyle Hidden
    if (Wait-Server $BaseUrl 60) { Write-Host "Dev server pornit la $BaseUrl"; return $proc }
  }
  $report = Join-Path $OutputPath "SERVER_START_FAILURE_REPORT.md"
  @"
# Server start failure

BaseUrl: $BaseUrl
RepoPath: $RepoPath
WebPath: $webPath

Verifica logurile server_* din acest folder.

Comanda manuala recomandata:

pnpm --dir `"$webPath`" exec next dev -p $Port -H 127.0.0.1

Apoi ruleaza auditul cu -NoServerStart.
"@ | Set-Content -Path $report -Encoding UTF8
  throw "Serverul local nu a pornit la $BaseUrl. Am salvat raport: $report"
}

function Invoke-BrowserCapture($Browser, $Url, $Png, $Html, $Stdout, $Stderr, $ProfileDir, $Budget) {
  Ensure-Dir $ProfileDir
  $args = @(
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-extensions",
    "--disable-dev-shm-usage",
    "--disable-features=Translate,BackForwardCache,AcceptCHFrame",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1800,1100",
    "--user-data-dir=$ProfileDir",
    "--virtual-time-budget=$Budget",
    "--screenshot=$Png",
    $Url
  )
  $p = Start-Process -FilePath $Browser -ArgumentList $args -RedirectStandardOutput $Stdout -RedirectStandardError $Stderr -PassThru -WindowStyle Hidden
  if (!$p.WaitForExit(45 * 1000)) {
    try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
    Add-Content -Path $Stderr -Value "`nTIMEOUT waiting for screenshot."
  }
  try {
    $domOut = $Html
    $domErr = [System.IO.Path]::ChangeExtension($Html, ".dom_stderr.log")
    $domArgs = @("--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--user-data-dir=$ProfileDir-dom", "--virtual-time-budget=$Budget", "--dump-dom", $Url)
    $dp = Start-Process -FilePath $Browser -ArgumentList $domArgs -RedirectStandardOutput $domOut -RedirectStandardError $domErr -PassThru -WindowStyle Hidden
    if (!$dp.WaitForExit(45 * 1000)) { try { Stop-Process -Id $dp.Id -Force -ErrorAction SilentlyContinue } catch {} }
  } catch { Add-Content -Path $Stderr -Value "`nDOM capture failed: $($_.Exception.Message)" }
}

function Get-FileSize([string]$Path) { if (Test-Path $Path) { return (Get-Item $Path).Length }; return 0 }

Ensure-Dir $OutputPath
$OutputPath = (Resolve-Path $OutputPath).Path
Write-Step "SERVELECT WORK OS v6.4.19 real screenshot audit"
Write-Host "RepoPath: $RepoPath"
Write-Host "OutputPath: $OutputPath"
Write-Host "BaseUrl: $BaseUrl"
if (!(Test-Path $RepoPath)) { throw "Nu gasesc repo-ul: $RepoPath" }
$browser = Find-Browser $BrowserPath
if (!$browser) { throw "Nu gasesc Microsoft Edge/Chrome. Ruleaza cu -BrowserPath \"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe\"" }
Write-Host "Browser: $browser"

if (!$SkipQa) {
  Write-Step "QA: pnpm typecheck / lint / build"
  Push-Location $RepoPath
  try {
    pnpm typecheck; if ($LASTEXITCODE -ne 0) { throw "pnpm typecheck failed" }
    pnpm lint; if ($LASTEXITCODE -ne 0) { throw "pnpm lint failed" }
    pnpm build; if ($LASTEXITCODE -ne 0) { throw "pnpm build failed" }
  } finally { Pop-Location }
} else { Write-Host "SkipQa activ: sar peste typecheck/lint/build." }

$serverProc = $null
try {
  Write-Step "Start/reuse local server"
  $serverProc = Start-LocalServer -RepoPath $RepoPath -BaseUrl $BaseUrl -Port $Port -UseDev ([bool]$UseDevServer) -OutputPath $OutputPath
  $routes = @(
    @{ file = "01_taskuri_overview.png"; route = "/taskuri/overview"; name = "Overview" },
    @{ file = "02_taskuri_my_work.png"; route = "/taskuri/my-work"; name = "My Work" },
    @{ file = "03_taskuri_tickets_notificari.png"; route = "/taskuri/tickets-notificari"; name = "Tickets & Notificari" },
    @{ file = "04_taskuri_proiecte_active.png"; route = "/taskuri/proiecte-active"; name = "Proiecte active" },
    @{ file = "05_taskuri_proiecte_viitoare.png"; route = "/taskuri/proiecte-viitoare"; name = "Proiecte viitoare" },
    @{ file = "06_taskuri_proiecte_finalizate.png"; route = "/taskuri/proiecte-finalizate"; name = "Proiecte finalizate" },
    @{ file = "07_taskuri_board.png"; route = "/taskuri/board"; name = "Board" },
    @{ file = "08_taskuri_tabel.png"; route = "/taskuri/tabel"; name = "Tabel" },
    @{ file = "09_taskuri_calendar_gantt.png"; route = "/taskuri/calendar-gantt"; name = "Calendar & Gantt" },
    @{ file = "10_taskuri_workload_aprobari.png"; route = "/taskuri/workload-aprobari"; name = "Workload & Aprobari" }
  )
  $results = @()
  Write-Step "Capture each route"
  foreach ($r in $routes) {
    $url = "$BaseUrl$($r.route)"
    $safe = [System.IO.Path]::GetFileNameWithoutExtension($r.file)
    $png = Join-Path $OutputPath $r.file
    $html = Join-Path $OutputPath "$safe.html"
    $stdout = Join-Path $OutputPath "$safe`_browser_stdout.log"
    $stderr = Join-Path $OutputPath "$safe`_browser_stderr.log"
    $profile = Join-Path $OutputPath "browser-profile-$safe"
    Remove-Item $png,$html,$stdout,$stderr -Force -ErrorAction SilentlyContinue
    Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Capture: $($r.file) -> $url"
    $http = Test-Url $url
    $status = "HTTP_FAIL"
    $notes = ""
    if ($http.ok) {
      Invoke-BrowserCapture -Browser $browser -Url $url -Png $png -Html $html -Stdout $stdout -Stderr $stderr -ProfileDir $profile -Budget 12000
      $size = Get-FileSize $png
      if ($size -lt 25000) {
        Add-Content -Path $stderr -Value "`nRetry with longer budget because size=$size"
        Invoke-BrowserCapture -Browser $browser -Url $url -Png $png -Html $html -Stdout $stdout -Stderr $stderr -ProfileDir "$profile-retry" -Budget 20000
        $size = Get-FileSize $png
      }
      $domText = ""
      if (Test-Path $html) { $domText = Get-Content $html -Raw -ErrorAction SilentlyContinue }
      $hasClientError = $false
      if ($domText -match 'client-side exception' -or $domText -match 'Application error' -or $domText -match 'NEXT_NOT_FOUND') { $hasClientError = $true }
      if ($size -ge 25000 -and $hasClientError) { $status = "CAPTURED_BUT_CLIENT_ERROR" }
      elseif ($size -ge 25000) { $status = "CAPTURED" }
      elseif ($size -gt 0) { $status = "CAPTURED_SMALL_OR_ERROR" }
      else { $status = "NO_PNG" }
      $notes = "HTTP=$($http.code); PNG=$size bytes; ClientError=$hasClientError"
    } else { $notes = "HTTP_FAIL: $($http.error)" }
    $results += [PSCustomObject]@{ Name=$r.name; Route=$r.route; Url=$url; File=$r.file; Status=$status; Notes=$notes }
  }
  $csv = Join-Path $OutputPath "SCREENSHOT_AUDIT_RESULTS.csv"
  $results | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $csv
  $report = Join-Path $OutputPath "SCREENSHOT_AUDIT_REPORT.md"
  $lines = @()
  $lines += "# SERVELECT WORK OS v6.4.19 Real Screenshot Audit"
  $lines += ""
  $lines += "BaseUrl: $BaseUrl"
  $lines += "Browser: $browser"
  $lines += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  $lines += ""
  $lines += "| Route | Screenshot | Status | Notes |"
  $lines += "|---|---|---|---|"
  foreach ($res in $results) { $lines += "| $($res.Route) | $($res.File) | $($res.Status) | $($res.Notes) |" }
  $lines += ""
  $captured = @($results | Where-Object { $_.Status -eq "CAPTURED" })
  $bad = @($results | Where-Object { $_.Status -ne "CAPTURED" })
  $lines += "Captured OK: $($captured.Count) / $($results.Count)"
  $lines += "Not clean captured: $($bad.Count) / $($results.Count)"
  $lines += ""
  if ($bad.Count -gt 0) { $lines += "## Rute care necesita inspectie"; foreach ($b in $bad) { $lines += "- $($b.Route): $($b.Status) — $($b.Notes)" } }
  $lines | Set-Content -Path $report -Encoding UTF8
  Write-Host "`nRaport: $report" -ForegroundColor Green
  Write-Host "CSV: $csv" -ForegroundColor Green
  Write-Host "Capturi: $OutputPath" -ForegroundColor Green
  if ($bad.Count -gt 0) { Write-Warning "Screenshot audit incomplet: $($bad.Count) rute nu sunt CAPTURED curat. Nu arunc exceptie; vezi raportul si logurile." }
}
finally { if ($serverProc -and !$serverProc.HasExited) { try { Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue } catch {} } }
