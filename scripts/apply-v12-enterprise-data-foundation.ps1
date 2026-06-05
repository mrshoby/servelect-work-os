$ErrorActionPreference = "Stop"

# ============================================================
# SERVELECT WORK OS v1.2.0 ENTERPRISE DATA FOUNDATION RELEASE
# Ia ZIP-ul din Downloads, il extrage, aplica patch-ul, build, commit, push
# ============================================================

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-v12-enterprise-data-foundation-release.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-v12-enterprise-data-foundation"

Write-Host ""
Write-Host "=== SERVELECT WORK OS v1.2.0 ENTERPRISE DATA FOUNDATION RELEASE ===" -ForegroundColor Cyan
Write-Host "Repo: $repo" -ForegroundColor Cyan
Write-Host "ZIP:  $zip" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $repo)) {
  throw "Nu exista folderul repo: $repo"
}

if (!(Test-Path $zip)) {
  throw "Nu gasesc ZIP-ul in Downloads: $zip"
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
Write-Host "Sincronizez curat cu GitHub main..." -ForegroundColor Cyan
git fetch origin
git checkout main
git reset --hard origin/main

Write-Host ""
Write-Host "Sterg temp vechi si extrag ZIP-ul..." -ForegroundColor Green
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tmp | Out-Null
Expand-Archive -Path $zip -DestinationPath $tmp -Force

$patchRoot = $tmp
$children = Get-ChildItem $tmp

if ($children.Count -eq 1 -and $children[0].PSIsContainer) {
  $candidate = $children[0].FullName
  if (
    (Test-Path (Join-Path $candidate "apps")) -or
    (Test-Path (Join-Path $candidate "docs")) -or
    (Test-Path (Join-Path $candidate "scripts")) -or
    (Test-Path (Join-Path $candidate "packages")) -or
    (Test-Path (Join-Path $candidate "package.json"))
  ) {
    $patchRoot = $candidate
  }
}

Write-Host "Patch root detectat: $patchRoot" -ForegroundColor Cyan

Write-Host ""
Write-Host "Copiez patch-ul peste repo..." -ForegroundColor Green
Copy-Item "$patchRoot\*" $repo -Recurse -Force

cd $repo

Remove-Item ".\servelect-work-os" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Aplic fixuri de compatibilitate pentru build-urile anterioare..." -ForegroundColor Green

# Fix AppShell Sidebar mobile prop, daca exista.
$appShellFile = "apps\web\components\layout\AppShell.tsx"
if (Test-Path $appShellFile) {
  $appShell = Get-Content $appShellFile -Raw
  $appShell = $appShell -replace '\s+mobile\s*/>', ' />'
  $appShell = $appShell -replace '\s+mobile\s+', ' '
  Set-Content $appShellFile -Value $appShell -Encoding UTF8
}

# Fix performance audit route generatedAt / manifestWithoutGeneratedAt, daca exista.
$performanceRoute = "apps\web\app\api\v1\performance\audit\route.ts"
if (Test-Path $performanceRoute) {
  $content = Get-Content $performanceRoute -Raw
  $content = $content -replace '(?m)^\s*const\s*\{\s*generatedAt:\s*manifestGeneratedAt,\s*\.\.\.manifestWithoutGeneratedAt\s*\}\s*=\s*manifest;\s*\r?\n', ''
  $content = $content -replace '(?m)^\s*generatedAt:\s*new Date\(\)\.toISOString\(\),\s*\r?\n', ''
  $content = $content -replace '(?m)^\s*manifestGeneratedAt,?\s*\r?\n', ''
  $content = $content -replace 'manifestWithoutGeneratedAt', 'manifest'
  Set-Content $performanceRoute -Value $content -Encoding UTF8
}

Write-Host ""
Write-Host "Setez versiunea la 1.2.0 in package.json-uri..." -ForegroundColor Green

$packageFiles = @(
  "package.json",
  "apps\web\package.json",
  "apps\mobile\package.json",
  "packages\shared\package.json"
)

foreach ($file in $packageFiles) {
  if (Test-Path $file) {
    $json = Get-Content $file -Raw | ConvertFrom-Json
    $json.version = "1.2.0"
    $json | ConvertTo-Json -Depth 100 | Set-Content $file -Encoding UTF8
    Write-Host "Updated $file -> 1.2.0" -ForegroundColor DarkGreen
  }
}

Write-Host ""
Write-Host "Schimb cheia localStorage la v12 ca sa nu mai incarce state vechi/blocat..." -ForegroundColor Green

$storeFile = "apps\web\lib\store.ts"
if (Test-Path $storeFile) {
  $store = Get-Content $storeFile -Raw
  $store = $store -replace 'servelect-work-os-store-v\d+', 'servelect-work-os-store-v12'
  $store = $store -replace 'version:\s*\d+', 'version: 12'
  Set-Content $storeFile -Value $store -Encoding UTF8
}

Write-Host ""
Write-Host "Sterg cache Next.js..." -ForegroundColor Green
Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Git status dupa patch:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Rulez build web local..." -ForegroundColor Cyan
pnpm --filter @servelect/web build

if ($LASTEXITCODE -ne 0) {
  throw "Build-ul a picat. Nu fac commit/push."
}

Write-Host ""
Write-Host "Build OK. Fac commit v1.2.0..." -ForegroundColor Green
git add .
git commit -m "Add v1.2 enterprise data foundation release"

Write-Host ""
Write-Host "Push pe GitHub main..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "GATA. v1.2.0 a fost urcat pe GitHub." -ForegroundColor Green
Write-Host "Vercel ar trebui sa porneasca automat deploy nou." -ForegroundColor Cyan

Write-Host ""
Write-Host "Dupa deploy testeaza:" -ForegroundColor Cyan
Write-Host "https://servelect-work-os-web.vercel.app/admin/data-foundation"
Write-Host "https://servelect-work-os-web.vercel.app/api/v1/enterprise/data-foundation"
Write-Host "https://servelect-work-os-web.vercel.app/api/v1/enterprise/data-readiness"
Write-Host "https://servelect-work-os-web.vercel.app/taskuri"
Write-Host "https://servelect-work-os-web.vercel.app/enterprise"

Write-Host ""
Write-Host "Dupa deploy ruleaza audit complet:" -ForegroundColor Cyan
Write-Host ".\scripts\site-deep-audit.ps1 -BaseUrl `"https://servelect-work-os-web.vercel.app`""
