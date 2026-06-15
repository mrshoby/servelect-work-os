# v8.9.0 QA Report

Expected local checks:

| Command | Expected |
|---|---|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm build | PASS |
| scripts/work-os-v890-functional-test.ps1 | 65 / 65 PASS after deploy |
| scripts/audit-v890-screenshots.mjs | 50 / 50 PASS after deploy |

The apply script does not push to GitHub when `-SkipGitPush` is used. Commit and deploy must be confirmed after local QA.
