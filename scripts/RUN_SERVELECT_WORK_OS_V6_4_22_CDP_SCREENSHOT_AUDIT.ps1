param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BaseUrl = "http://127.0.0.1:3100",
  [string]$BrowserPath = "",
  [switch]$NoServerStart,
  [switch]$SkipQa,
  [int]$Port = 3100
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Downloads = Join-Path $env:USERPROFILE "Downloads"
$OutDir = Join-Path $Downloads "SERVELECT_WORK_OS_v6.4.22_REAL_SCREENSHOTS"
$WebPath = Join-Path $RepoPath "apps\web"
$NodeScript = Join-Path $ScriptDir "cdp-screenshot-audit-v6422.mjs"

function Write-Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Test-Url($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
    return [int]$r.StatusCode
  } catch { return 0 }
}
function Find-Browser {
  param([string]$ManualPath)
  if ($ManualPath -and (Test-Path $ManualPath)) { return (Resolve-Path $ManualPath).Path }
  $candidates = @(
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
  )
  foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
  foreach ($cmd in @("msedge.exe","chrome.exe")) {
    $c = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($c -and (Test-Path $c.Source)) { return $c.Source }
  }
  $regPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
  )
  foreach ($rp in $regPaths) {
    try {
      $val = (Get-ItemProperty -Path $rp -ErrorAction Stop).'(default)'
      if ($val -and (Test-Path $val)) { return $val }
    } catch {}
  }
  throw 'Nu gasesc Edge/Chrome. Ruleaza cu -BrowserPath "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"'
}

if (!(Test-Path $RepoPath)) { throw "Nu gasesc RepoPath: $RepoPath" }
if (!(Test-Path $WebPath)) { throw "Nu gasesc apps\web: $WebPath" }
if (!(Test-Path $NodeScript)) { throw "Nu gasesc Node screenshot script: $NodeScript" }

if (Test-Path $OutDir) { Remove-Item $OutDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$Browser = Find-Browser -ManualPath $BrowserPath
Write-Host "Browser: $Browser"
Write-Host "Output: $OutDir"

if (-not $SkipQa) {
  Write-Step "Run QA before screenshot audit"
  Push-Location $RepoPath
  try {
    pnpm typecheck
    pnpm lint
    pnpm build
  } finally { Pop-Location }
}

$serverProcess = $null
$serverStartedByScript = $false
if (-not $NoServerStart) {
  $status = Test-Url "$BaseUrl/taskuri/overview"
  if ($status -ne 200) {
    Write-Step "Start Next server"
    $cmd = "cd /d `"$WebPath`" && pnpm exec next start -p $Port -H 127.0.0.1"
    Set-Content -Path (Join-Path $OutDir "server_command.txt") -Value $cmd -Encoding UTF8
    $serverStdout = Join-Path $OutDir "server_stdout.log"
    $serverStderr = Join-Path $OutDir "server_stderr.log"
    $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList @('/c', $cmd) -RedirectStandardOutput $serverStdout -RedirectStandardError $serverStderr -PassThru -WindowStyle Hidden
    $serverStartedByScript = $true
    $deadline = (Get-Date).AddSeconds(75)
    do {
      Start-Sleep -Milliseconds 750
      $status = Test-Url "$BaseUrl/taskuri/overview"
      if ($status -eq 200) { break }
      if ($serverProcess.HasExited) { break }
    } while ((Get-Date) -lt $deadline)
    if ($status -ne 200) {
      Write-Warning "Serverul nu raspunde 200. Continui auditul pentru dovezi. Status=$status"
    }
  }
}

Write-Step "Run CDP screenshot audit"
Push-Location $RepoPath
try {
  node $NodeScript --browser $Browser --base $BaseUrl --out $OutDir --width 1440 --height 1100 --waitMs 5000
  $code = $LASTEXITCODE
  if ($code -ne 0) { Write-Warning "CDP audit exit code: $code. Verifica raportul, nu opresc scriptul." }
} finally { Pop-Location }

Write-Step "Audit files"
Get-ChildItem $OutDir | Select-Object Name,Length | Format-Table -AutoSize
Write-Host "`nRezultate: $OutDir" -ForegroundColor Green

if ($serverStartedByScript -and $serverProcess -and -not $serverProcess.HasExited) {
  try { Stop-Process -Id $serverProcess.Id -Force } catch {}
}
