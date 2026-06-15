# v8.3.0 QA Report

## Required local QA
| Command | Expected |
|---|---|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS or only documented legacy lint issues |
| `pnpm build` | PASS |
| `./scripts/work-os-v830-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"` | PASS 34/34 after Vercel deploy |
| `node scripts/audit-v830-screenshots.mjs` | Real PNG output, no NO_PNG |

## Known condition
Do not run the Vercel route smoke before the GitHub push and Vercel deployment complete, otherwise new v8.3 routes will return 404 from the previous deployment.
