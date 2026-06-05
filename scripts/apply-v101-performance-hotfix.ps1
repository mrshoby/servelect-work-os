$ErrorActionPreference = "Stop"

# ============================================================
# SERVELECT WORK OS v1.0.1 PERFORMANCE + BUG HOTFIX
# - Fix build error PageHeader actions prop
# - Fix /taskuri browser freeze by rendering only active view
# - Remove topbar text that overlaps search
# - Add /admin/performance + /api/v1/performance/audit
# - Bump package versions to 1.0.1
# - Build, commit, push
# ============================================================

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$patchRoot = Join-Path (Split-Path -Parent $scriptRoot) "patch-files"

Write-Host ""
Write-Host "=== SERVELECT WORK OS v1.0.1 PERFORMANCE HOTFIX ===" -ForegroundColor Cyan
Write-Host "Repo:      $repo" -ForegroundColor Cyan
Write-Host "PatchRoot: $patchRoot" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $repo)) {
  throw "Nu exista folderul repo: $repo"
}

if (!(Test-Path $patchRoot)) {
  throw "Nu exista folderul patch-files: $patchRoot"
}

cd $repo

Write-Host "Verific remote Git..." -ForegroundColor Cyan
git remote -v
$remote = git remote get-url origin
if ($remote -notmatch "mrshoby/servelect-work-os") {
  throw "Remote gresit. Remote actual: $remote"
}

if ((Test-Path ".git\rebase-merge") -or (Test-Path ".git\rebase-apply")) {
  Write-Host "Exista rebase in curs. Il opresc..." -ForegroundColor Yellow
  git rebase --abort
}

Write-Host ""
Write-Host "Sincronizez cu GitHub main..." -ForegroundColor Cyan
git checkout main
git pull origin main

Write-Host ""
Write-Host "Copiez fisierele schimbate peste repo..." -ForegroundColor Green
Copy-Item "$patchRoot\*" $repo -Recurse -Force

cd $repo
Remove-Item ".\servelect-work-os" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Setez versiunea la 1.0.1 in package.json-uri..." -ForegroundColor Green
$packageFiles = @(
  "package.json",
  "apps\web\package.json",
  "apps\mobile\package.json",
  "packages\shared\package.json"
)

foreach ($file in $packageFiles) {
  if (Test-Path $file) {
    $json = Get-Content $file -Raw | ConvertFrom-Json
    $json.version = "1.0.1"
    $json | ConvertTo-Json -Depth 100 | Set-Content $file -Encoding UTF8
    Write-Host "Updated $file -> 1.0.1" -ForegroundColor DarkGreen
  }
}

Write-Host ""
Write-Host "Schimb localStorage key store v3/v4 -> v5 ca sa evit date vechi care pot bloca browserul..." -ForegroundColor Green
$storeFile = "apps\web\lib\store.ts"
if (Test-Path $storeFile) {
  $storeContent = Get-Content $storeFile -Raw
  $storeContent = $storeContent -replace 'name: "servelect-work-os-store-v3"', 'name: "servelect-work-os-store-v5"'
  $storeContent = $storeContent -replace 'name: "servelect-work-os-store-v4"', 'name: "servelect-work-os-store-v5"'
  $storeContent = $storeContent -replace 'version: 3', 'version: 5'
  $storeContent = $storeContent -replace 'version: 4', 'version: 5'
  Set-Content $storeFile -Value $storeContent -Encoding UTF8
}

Write-Host ""
Write-Host "Sterg cache Next.js..." -ForegroundColor Green
Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Git status dupa patch:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Rulez build web..." -ForegroundColor Cyan
pnpm --filter @servelect/web build

if ($LASTEXITCODE -ne 0) {
  throw "Build-ul a picat. Nu fac commit/push. Trimite log-ul de eroare."
}

Write-Host ""
Write-Host "Build OK. Fac commit..." -ForegroundColor Green
git add .
git commit -m "Fix v1.0.1 task performance and topbar overlap"

Write-Host ""
Write-Host "Push pe GitHub..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "GATA. v1.0.1 a fost urcat pe GitHub." -ForegroundColor Green
Write-Host "Vercel va porni automat deploy nou." -ForegroundColor Cyan
Write-Host ""
Write-Host "Testeaza dupa deploy:" -ForegroundColor Cyan
Write-Host "https://servelect-work-os-web.vercel.app/taskuri"
Write-Host "https://servelect-work-os-web.vercel.app/admin/performance"
Write-Host "https://servelect-work-os-web.vercel.app/api/v1/performance/audit"
Write-Host ""
Write-Host "Daca /taskuri inca pare blocat local, deschide Incognito sau sterge localStorage pentru domeniul Vercel." -ForegroundColor Yellow
