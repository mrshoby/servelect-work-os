$ErrorActionPreference = "Stop"

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-v102-site-stability-performance-patch.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-v102-site-stability-performance"

if (!(Test-Path $repo)) { throw "Nu exista repo: $repo" }
if (!(Test-Path $zip)) { throw "Nu gasesc ZIP-ul: $zip" }

cd $repo
$remote = git remote get-url origin
if ($remote -notmatch "mrshoby/servelect-work-os") { throw "Remote gresit: $remote" }

if ((Test-Path ".git\rebase-merge") -or (Test-Path ".git\rebase-apply")) { git rebase --abort }

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

$packageFiles = @("package.json", "apps\web\package.json", "apps\mobile\package.json", "packages\shared\package.json")
foreach ($file in $packageFiles) {
  if (Test-Path $file) {
    $json = Get-Content $file -Raw | ConvertFrom-Json
    $json.version = "1.0.2"
    $json | ConvertTo-Json -Depth 100 | Set-Content $file -Encoding UTF8
  }
}

$storeFile = "apps\web\lib\store.ts"
if (Test-Path $storeFile) {
  $store = Get-Content $storeFile -Raw
  $store = $store -replace 'servelect-work-os-store-v3', 'servelect-work-os-store-v6'
  $store = $store -replace 'servelect-work-os-store-v4', 'servelect-work-os-store-v6'
  $store = $store -replace 'servelect-work-os-store-v5', 'servelect-work-os-store-v6'
  $store = $store -replace 'version: 3', 'version: 6'
  $store = $store -replace 'version: 4', 'version: 6'
  $store = $store -replace 'version: 5', 'version: 6'
  Set-Content $storeFile -Value $store -Encoding UTF8
}

Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue
pnpm --filter @servelect/web build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

git add .
git commit -m "Fix v1.0.2 site stability and performance audit"
git push origin main
