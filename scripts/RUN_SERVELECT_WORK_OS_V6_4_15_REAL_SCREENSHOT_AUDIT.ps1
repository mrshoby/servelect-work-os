param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [string]$BrowserPath = "",
  [int]$Port = 3100,
  [switch]$SkipScreenshots
)
$ErrorActionPreference = "Stop"
$BaseUrl = "http://127.0.0.1:$Port"
$OutputDir = Join-Path $env:USERPROFILE "Downloads\SERVELECT_WORK_OS_v6.4.15_REAL_SCREENSHOTS"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
function Find-Browser {
  param([string]$ExplicitPath)
  if ($ExplicitPath -and (Test-Path $ExplicitPath)) { return $ExplicitPath }
  $candidates = @("$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe")
  foreach ($path in $candidates) { if ($path -and (Test-Path $path)) { return $path } }
  $cmd = Get-Command msedge.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $cmd = Get-Command chrome.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return ""
}
function Wait-HttpOk {
  param([string]$Url, [int]$Seconds = 45)
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try { $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return $true } } catch { Start-Sleep -Milliseconds 900 }
  }
  return $false
}
$WebPath = Join-Path $RepoPath "apps\web"
$Browser = Find-Browser -ExplicitPath $BrowserPath
if (!$Browser) { throw "Nu gasesc Microsoft Edge sau Chrome. Ruleaza cu -BrowserPath explicit." }
if (-not (Wait-HttpOk -Url $BaseUrl -Seconds 3)) {
  $stdout = Join-Path $OutputDir "server_stdout.log"
  $stderr = Join-Path $OutputDir "server_stderr.log"
  $proc = Start-Process -FilePath "cmd.exe" -ArgumentList "/c pnpm exec next start -p $Port -H 127.0.0.1" -WorkingDirectory $WebPath -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  if (-not (Wait-HttpOk -Url $BaseUrl -Seconds 60)) { throw "Serverul local nu a pornit la $BaseUrl. Vezi logurile in $OutputDir" }
}
if ($SkipScreenshots) { Write-Host "Server OK: $BaseUrl"; exit 0 }
$routes = @(
  @{ name = "01_taskuri_overview"; path = "/taskuri/overview" }, @{ name = "02_taskuri_my_work"; path = "/taskuri/my-work" }, @{ name = "03_taskuri_tickets_notificari"; path = "/taskuri/tickets-notificari" }, @{ name = "04_taskuri_proiecte_active"; path = "/taskuri/proiecte-active" }, @{ name = "05_taskuri_proiecte_viitoare"; path = "/taskuri/proiecte-viitoare" }, @{ name = "06_taskuri_proiecte_finalizate"; path = "/taskuri/proiecte-finalizate" }, @{ name = "07_taskuri_board"; path = "/taskuri/board" }, @{ name = "08_taskuri_tabel"; path = "/taskuri/tabel" }, @{ name = "09_taskuri_calendar_gantt"; path = "/taskuri/calendar-gantt" }, @{ name = "10_taskuri_workload_aprobari"; path = "/taskuri/workload-aprobari" }
)
$reportLines = @("# SERVELECT WORK OS v6.4.15 real screenshot audit", "", "Browser: $Browser", "BaseUrl: $BaseUrl", "OutputDir: $OutputDir", "Generated: $(Get-Date -Format o)", "", "| Screen | Route | HTTP | Screenshot | Status |", "|---|---|---:|---|---|")
foreach ($route in $routes) {
  $url = "$BaseUrl$($route.path)"; $png = Join-Path $OutputDir "$($route.name).png"; $status = 0
  try { $status = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15).StatusCode } catch { $status = 0 }
  & $Browser --headless=new --disable-gpu --hide-scrollbars --window-size=2048,1152 --screenshot="$png" "$url" | Out-Null
  $state = if ((Test-Path $png) -and $status -eq 200) { "CAPTURED" } else { "FAIL" }
  $reportLines += "| $($route.name) | $url | $status | $png | $state |"
}
Set-Content -Path (Join-Path $OutputDir "SCREENSHOT_AUDIT_REPORT.md") -Value $reportLines -Encoding UTF8
Write-Host "Screenshot audit complete: $OutputDir"
