$ErrorActionPreference = "Stop"

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-v11-enterprise-operations-release.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-v11-enterprise-operations"

if (!(Test-Path $repo)) { throw "Repo folder not found: $repo" }
if (!(Test-Path $zip)) { throw "Patch ZIP not found in Downloads: $zip" }

cd $repo

$remote = git remote get-url origin
if ($remote -notmatch "mrshoby/servelect-work-os") { throw "Wrong remote: $remote" }

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

$packageFiles = @("package.json", "apps\web\package.json", "apps\mobile\package.json", "packages\shared\package.json")
foreach ($file in $packageFiles) {
  if (Test-Path $file) {
    $json = Get-Content $file -Raw | ConvertFrom-Json
    $json.version = "1.1.0"
    $json | ConvertTo-Json -Depth 100 | Set-Content $file -Encoding UTF8
  }
}

$storeFile = "apps\web\lib\store.ts"
if (Test-Path $storeFile) {
  $store = Get-Content $storeFile -Raw
  $store = $store -replace 'servelect-work-os-store-v1', 'servelect-work-os-store-v11'
  $store = $store -replace 'servelect-work-os-store-v2', 'servelect-work-os-store-v11'
  $store = $store -replace 'servelect-work-os-store-v3', 'servelect-work-os-store-v11'
  $store = $store -replace 'servelect-work-os-store-v4', 'servelect-work-os-store-v11'
  $store = $store -replace 'servelect-work-os-store-v5', 'servelect-work-os-store-v11'
  $store = $store -replace 'servelect-work-os-store-v6', 'servelect-work-os-store-v11'
  $store = $store -replace 'version: 1', 'version: 11'
  $store = $store -replace 'version: 2', 'version: 11'
  $store = $store -replace 'version: 3', 'version: 11'
  $store = $store -replace 'version: 4', 'version: 11'
  $store = $store -replace 'version: 5', 'version: 11'
  $store = $store -replace 'version: 6', 'version: 11'
  Set-Content $storeFile -Value $store -Encoding UTF8
}

Remove-Item ".\apps\web\.next" -Recurse -Force -ErrorAction SilentlyContinue
pnpm --filter @servelect/web build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

git add .
git commit -m "Add v1.1 enterprise operations release"
git push origin main
