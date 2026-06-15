# v8.6.0 QA Report

Run locally:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

After deploy:

```powershell
.\scripts\work-os-v860-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
$env:BASE_URL = "https://servelect-work-os-web.vercel.app"
node scripts/audit-v860-screenshots.mjs
```
