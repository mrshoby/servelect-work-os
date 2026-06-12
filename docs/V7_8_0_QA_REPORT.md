# v7.8.0 QA Report

The apply script runs:

| Command | Expected |
|---|---|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm build | PASS |

Post-deploy checks:

| Script | Purpose |
|---|---|
| scripts/work-os-v780-functional-test.ps1 | Route smoke for Taskuri, admin, work-os and API v7.8 routes |
| scripts/audit-v780-screenshots.mjs | Real screenshot capture with Vercel bypass header support |

Do not continue to v7.9 until v7.8 smoke and screenshot audit pass on the production alias.
