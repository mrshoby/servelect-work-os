# V8.4.0 QA Report

Required local checks:

| Command | Status |
|---|---|
| pnpm typecheck | To run locally |
| pnpm lint | To run locally |
| pnpm build | To run locally |
| scripts/work-os-v840-functional-test.ps1 | To run after deploy |
| scripts/audit-v840-screenshots.mjs | To run after deploy |

The update pack avoids live Vercel tests during apply because the new routes are unavailable until push/deploy completes.
