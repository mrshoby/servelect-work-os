$ErrorActionPreference = "Stop"

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-v13-database-activation-pack.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-v13-database-activation"

Write-Host "=== SERVELECT WORK OS v1.3.0 DATABASE ACTIVATION PACK ===" -ForegroundColor Cyan
Write-Host "Repo: $repo" -ForegroundColor Cyan
Write-Host "ZIP:  $zip" -ForegroundColor Cyan

if (!(Test-Path $repo)) { throw "Nu exista folderul repo: $repo" }
if (!(Test-Path $zip)) { throw "Nu gasesc ZIP-ul in Downloads: $zip" }

cd $repo

$remote = git remote get-url origin
if ($remote -notmatch "mrshoby/servelect-work-os") { throw "Remote gresit: $remote" }

if ((Test-Path ".git\rebase-merge") -or (Test-Path ".git\rebase-apply")) {
  git rebase --abort
}

git fetch origin
git checkout main
git reset --hard origin/main

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tmp | Out-Null
Expand-Archive -Path $zip -DestinationPath $tmp -Force

$patchRoot = $tmp
$children = Get-ChildItem $tmp
if ($children.Count -eq 1 -and $children[0].PSIsContainer) {
  $candidate = $children[0].FullName
  if ((Test-Path (Join-Path $candidate "apps")) -or (Test-Path (Join-Path $candidate "docs")) -or (Test-Path (Join-Path $candidate "scripts"))) {
    $patchRoot = $candidate
  }
}

Copy-Item "$patchRoot\*" $repo -Recurse -Force
cd $repo
Remove-Item ".\servelect-work-os" -Recurse -Force -ErrorAction SilentlyContinue

# Fix-uri de compatibilitate ramase din build-urile anterioare
$appShellFile = "apps\web\components\layout\AppShell.tsx"
if (Test-Path $appShellFile) {
  $appShell = Get-Content $appShellFile -Raw
  $appShell = $appShell -replace '\s+mobile\s*/>', ' />'
  $appShell = $appShell -replace '\s+mobile\s+', ' '
  Set-Content $appShellFile -Value $appShell -Encoding UTF8
}

$performanceRoute = "apps\web\app\api\v1\performance\audit\route.ts"
if (Test-Path $performanceRoute) {
  $content = Get-Content $performanceRoute -Raw
  $content = $content -replace '(?m)^\s*const\s*\{\s*generatedAt:\s*manifestGeneratedAt,\s*\.\.\.manifestWithoutGeneratedAt\s*\}\s*=\s*manifest;\s*\r?\n', ''
  $content = $content -replace '(?m)^\s*generatedAt:\s*new Date\(\)\.toISOString\(\),\s*\r?\n', ''
  $content = $content -replace '(?m)^\s*manifestGeneratedAt,?\s*\r?\n', ''
  $content = $content -replace 'manifestWithoutGeneratedAt', 'manifest'
  Set-Content $performanceRoute -Value $content -Encoding UTF8
}

# Setare versiune
$packageFiles = @("package.json", "apps\web\package.json", "apps\mobile\package.json", "packages\shared\package.json")
foreach ($file in $packageFiles) {
  if (Test-Path $file) {
    $json = Get-Content $file -Raw | ConvertFrom-Json
    $json.version = "1.3.0"
    $json | ConvertTo-Json -Depth 100 | Set-Content $file -Encoding UTF8
  }
}

# localStorage key nou pentru a evita state vechi
$storeFile = "apps\web\lib\store.ts"
if (Test-Path $storeFile) {
  $store = Get-Content $storeFile -Raw
  $store = $store -replace 'servelect-work-os-store-v\d+', 'servelect-work-os-store-v13'
  $store = $store -replace 'version:\s*\d+', 'version: 13'
  Set-Content $storeFile -Value $store -Encoding UTF8
}

Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue

git status --short
pnpm --filter @servelect/web build
if ($LASTEXITCODE -ne 0) { throw "Build-ul a picat. Nu fac commit/push." }

git add .
git commit -m "Add v1.3 enterprise database activation pack"
git push origin main

Write-Host "GATA. v1.3.0 a fost urcat pe GitHub." -ForegroundColor Green
Write-Host "Testeaza: /admin/database, /api/v1/enterprise/database-activation, /api/v1/enterprise/database-health" -ForegroundColor Cyan
