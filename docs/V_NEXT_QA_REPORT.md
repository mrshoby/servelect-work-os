# v11.0.0 QA report

## Required commands

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v1100-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
$env:BASE_URL="https://servelect-work-os-web.vercel.app"
node scripts/audit-v1100-goodday-ui-source.mjs
node scripts/audit-v1100-interactive-flow.mjs
node scripts/audit-v1100-screenshots-manual.mjs
```

## Acceptance

- Build cannot be called final until Vercel visual review passes.
- Route/API PASS is required but not enough.
- Screenshot capture is required but not enough.
- Manual density verdict must be considered.

## Known constraints

- Global production writes remain disabled.
- Persistence is localStorage + API readiness boundary, not full database mutation adapter.
- Real multi-user backend sync remains future work.
