# V_NEXT QA Report

## QA strategy changed

Previous route/API smoke tests were insufficient for design acceptance. v9.8.0 adds:

1. GoodDay public-reference audit.
2. Vercel/UI reality audit.
3. Button functionality audit.
4. Functional flow report.
5. Source audit for density/content/action handlers.
6. Screenshot audit with manual UI acceptance table.
7. Browser flow script for localStorage and visible state changes.

## Expected commands

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v980-functional-test.ps1 -BaseUrl "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app"
$env:BASE_URL = "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app"
node scripts/audit-v980-screenshots.mjs
node scripts/audit-v980-goodday-ui-source.mjs
node scripts/audit-v980-interactive-flow.mjs
```

## Build acceptance

Do not call the build final unless all four audits pass and live Vercel visually shows the dense workspace.
