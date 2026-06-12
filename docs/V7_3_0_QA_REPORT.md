# v7.3.0 QA Report

Apply script runs:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Build is not final if any of these fail.

Functional route test:
- `scripts/work-os-v730-functional-test.ps1`

Screenshot audit:
- `scripts/audit-v730-screenshots.mjs`

Expected screenshot baseline is 10 / 10 after Vercel deployment.
