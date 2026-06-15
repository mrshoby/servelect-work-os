# v8.5.0 QA Report

Expected local QA:

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v850-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
node scripts/audit-v850-screenshots.mjs
```

The apply script runs typecheck/lint/build locally and does not block local apply on Vercel pre-deploy route checks.
