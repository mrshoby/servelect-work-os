# v7.4.0 QA Report

Required local checks:
- pnpm typecheck
- pnpm lint
- pnpm build

Required route smoke after deploy:
- scripts/work-os-v740-functional-test.ps1

Required screenshot audit after deploy:
- node scripts/audit-v740-screenshots.mjs

Build is incomplete until the user confirms these checks on local/Vercel.
