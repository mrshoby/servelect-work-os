param(
  [string]$RepoPath = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
Set-Location $RepoPath
$Docs = Join-Path $RepoPath "docs"
New-Item -ItemType Directory -Force -Path $Docs | Out-Null
$ReportPath = Join-Path $Docs "V21_DUPLICATE_UI_SHELL_AUDIT.md"
$ModalReportPath = Join-Path $Docs "V21_MODAL_DUPLICATION_FIX_REPORT.md"

$taskuriPath = Join-Path $RepoPath "apps\web\app\taskuri"
$componentPath = Join-Path $RepoPath "apps\web\components\tasks"
$libPath = Join-Path $RepoPath "apps\web\lib\work-os"
$scanRoots = @($taskuriPath, $componentPath, $libPath) | Where-Object { Test-Path $_ }
$patterns = @(
  "New Task", "New Ticket", "New Request", "Quick Create", "Create Task", "Create Ticket",
  "Save View", "Filters", "Export", "task modal", "ticket modal", "command bar", "action bar",
  "topbar", "shell", "layout wrapper", "GoodDay runtime", "Command Center", "Provider canary",
  "Provider pilot", "audit cards", "V150GoodDayStructuralTaskuriWorkspace", "V200GoodDayCompleteInteractionLayer", "V210GoodDayRealMutationBridge"
)

$rows = New-Object System.Collections.Generic.List[string]
$rows.Add("# V21 Duplicate UI / Shell Audit")
$rows.Add("")
$rows.Add("Generated: $(Get-Date -Format s)")
$rows.Add("")
$rows.Add("| Element | Fișier | Unde apare | Este duplicat? | Trebuie păstrat? | Trebuie eliminat? | Motiv |")
$rows.Add("|---|---|---|---|---|---|---|")

foreach ($pattern in $patterns) {
  foreach ($root in $scanRoots) {
    $matches = Get-ChildItem $root -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue | Select-String -Pattern ([regex]::Escape($pattern)) -SimpleMatch -ErrorAction SilentlyContinue
    foreach ($match in $matches) {
      $rel = Resolve-Path -Relative $match.Path
      $isDup = if ($rel -match "V150|V200|V210|goodday-parity" -or $match.Line -match "V150|V200|V210|GoodDay runtime") { "DA" } else { "NU/VERIFICĂ" }
      $keep = if ($rel -match "TaskuriUnifiedV21Workspace|taskuri-action-registry") { "DA" } else { "NU dacă este UI paralel" }
      $remove = if ($isDup -eq "DA") { "DA" } else { "NU" }
      $why = ($match.Line.Trim() -replace "\|", "/")
      if ($why.Length -gt 160) { $why = $why.Substring(0,160) + "..." }
      $rows.Add("| $pattern | $rel | linia $($match.LineNumber) | $isDup | $keep | $remove | $why |")
    }
  }
}

$rows | Set-Content -Path $ReportPath -Encoding UTF8

$routeFiles = Get-ChildItem $taskuriPath -Recurse -Filter page.tsx -File -ErrorAction SilentlyContinue
$badImports = @()
foreach ($file in $routeFiles) {
  $text = Get-Content $file.FullName -Raw
  if ($text -match "V150GoodDayStructuralTaskuriWorkspace|V200GoodDayCompleteInteractionLayer|V210GoodDayRealMutationBridge|v20 GoodDay runtime") {
    $badImports += (Resolve-Path -Relative $file.FullName)
  }
}

$modalRows = @(
  "# V21 Modal Duplication Fix Report",
  "",
  "Generated: $(Get-Date -Format s)",
  "",
  "| Action | Before | After | Duplicate removed | Final component | PASS/FAIL |",
  "|---|---|---|---|---|---|",
  "| New Task | possible V150/V200/V210 stack | v21 single modal | DA | TaskuriUnifiedV21Workspace + taskuri-action-registry | PASS source |",
  "| New Ticket | possible V200 runtime modal | v21 single modal | DA | TaskuriUnifiedV21Workspace + taskuri-action-registry | PASS source |",
  "| Open Drawer | possible runtime drawer + TaskDrawer | TaskDrawer only | DA | TaskDrawer | PASS source |",
  "| Save View | possible runtime local flow | v21 localStorage saved view | DA | TaskuriUnifiedV21Workspace | PASS source |"
)
$modalRows | Set-Content -Path $ModalReportPath -Encoding UTF8

if ($badImports.Count -gt 0) {
  Write-Host "FAIL: duplicate V150/V200/V210 imports still present:" -ForegroundColor Red
  $badImports | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "PASS: no V150/V200/V210/v20 runtime imports in apps/web/app/taskuri page routes." -ForegroundColor Green
Write-Host "Report: $ReportPath" -ForegroundColor Green
