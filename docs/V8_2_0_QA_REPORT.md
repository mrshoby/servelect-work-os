# v8.2.0 QA Report

Run after apply:

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v820-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
node scripts/audit-v820-screenshots.mjs
```

Build is incomplete until local QA, Vercel smoke and screenshot audit pass.
