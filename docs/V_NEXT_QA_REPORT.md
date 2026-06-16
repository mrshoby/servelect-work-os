# V_NEXT_QA_REPORT

## Required commands

```powershell
pnpm typecheck
pnpm build
node scripts/audit-v1300-taskuri-route-unification-source.mjs
node scripts/audit-v1300-browser-flow.mjs
.\scripts\work-os-v1300-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
$env:BASE_URL = "https://servelect-work-os-web.vercel.app"
node scripts/audit-v1300-screenshots-manual.mjs
```

## Acceptance

- Build must pass.
- Source audit must report every Taskuri page bound to V130.
- Route/API smoke must pass.
- Screenshot script must create `audit-results/v1300-screenshots.zip`.
- Old inner-menu markers must be absent on Vercel.
