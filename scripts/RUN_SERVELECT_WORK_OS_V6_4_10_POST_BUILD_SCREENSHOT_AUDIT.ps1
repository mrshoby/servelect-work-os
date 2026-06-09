param(
  [string]$RepoPath = "D:\01_digitalizare_automatizare\servelect-work-os-main",
  [int]$Port = 4173,
  [string]$OutDir = "C:\Users\Vlad Taran\Downloads\SERVELECT_WORK_OS_v6.4.10_REAL_SCREENSHOTS"
)

$ErrorActionPreference = "Stop"
function Find-Browser {
  $Candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
  )
  foreach ($Candidate in $Candidates) {
    if (Test-Path $Candidate) { return $Candidate }
  }
  return $null
}

if (!(Test-Path $RepoPath)) { throw "Nu gasesc repo-ul: $RepoPath" }
if (Test-Path $OutDir) { Remove-Item $OutDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$Browser = Find-Browser
if (!$Browser) {
  throw "Nu gasesc Microsoft Edge sau Google Chrome pentru screenshot headless."
}

Set-Location $RepoPath
$StartInfo = New-Object System.Diagnostics.ProcessStartInfo
$StartInfo.FileName = "powershell.exe"
$StartInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command pnpm --filter @servelect/web start -- -p $Port"
$StartInfo.WorkingDirectory = $RepoPath
$StartInfo.RedirectStandardOutput = $true
$StartInfo.RedirectStandardError = $true
$StartInfo.UseShellExecute = $false
$Proc = [System.Diagnostics.Process]::Start($StartInfo)

try {
  Start-Sleep -Seconds 8
  $Routes = @(
    @{Name="01_taskuri_overview"; Path="/taskuri/overview"},
    @{Name="02_taskuri_my_work"; Path="/taskuri/my-work"},
    @{Name="03_taskuri_tickets_notificari"; Path="/taskuri/tickets-notificari"},
    @{Name="04_taskuri_proiecte_active"; Path="/taskuri/proiecte-active"},
    @{Name="05_taskuri_proiecte_viitoare"; Path="/taskuri/proiecte-viitoare"},
    @{Name="06_taskuri_proiecte_finalizate"; Path="/taskuri/proiecte-finalizate"},
    @{Name="07_taskuri_board"; Path="/taskuri/board"},
    @{Name="08_taskuri_tabel"; Path="/taskuri/tabel"},
    @{Name="09_taskuri_calendar_gantt"; Path="/taskuri/calendar-gantt"},
    @{Name="10_taskuri_workload_aprobari"; Path="/taskuri/workload-aprobari"}
  )
  foreach ($Route in $Routes) {
    $Url = "http://localhost:$Port$($Route.Path)"
    $File = Join-Path $OutDir ($Route.Name + ".png")
    Write-Host "Screenshot: $Url -> $File"
    & $Browser --headless --disable-gpu --window-size=1920,1080 --screenshot="$File" "$Url" | Out-Null
    if (!(Test-Path $File)) { throw "Screenshot failed for $Url" }
  }

  $Report = Join-Path $OutDir "POST_BUILD_SCREENSHOT_AUDIT_README.md"
  @"
# SERVELECT WORK OS v6.4.10 screenshot audit output

Screenshots generated from local running app after successful build.

Compare each file manually with the reference images:
- 01_taskuri_overview.png
- 02_taskuri_my_work.png
- 03_taskuri_tickets_notificari.png
- 04_taskuri_proiecte_active.png
- 05_taskuri_proiecte_viitoare.png
- 06_taskuri_proiecte_finalizate.png
- 07_taskuri_board.png
- 08_taskuri_tabel.png
- 09_taskuri_calendar_gantt.png
- 10_taskuri_workload_aprobari.png

If any page is below 95%, it remains FAIL and needs another differential visual fix.
"@ | Set-Content $Report -Encoding UTF8
}
finally {
  if ($Proc -and -not $Proc.HasExited) { $Proc.Kill() }
}
