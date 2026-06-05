$ErrorActionPreference = "Stop"

$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-v26-task-ui-api-wiring-pack.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-v26-task-api-wiring"

if (!(Test-Path $repo)) { throw "Repo not found: $repo" }
if (!(Test-Path $zip)) { throw "Zip not found: $zip" }

cd $repo
git fetch origin
git checkout main
git reset --hard origin/main
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tmp | Out-Null
Expand-Archive -Path $zip -DestinationPath $tmp -Force
Copy-Item "$tmp\*" $repo -Recurse -Force
Remove-Item ".\servelect-work-os" -Recurse -Force -ErrorAction SilentlyContinue
pnpm --filter @servelect/web build
git add .
git commit -m "Add v2.6 task UI API wiring pack"
git push origin main
