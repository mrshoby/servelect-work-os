# V7.6.0 QA Report

Required local checks run by apply script:
- pnpm typecheck
- pnpm lint
- pnpm build

Required post-deploy checks:
- scripts/work-os-v760-functional-test.ps1
- scripts/audit-v760-screenshots.mjs

Build is incomplete until these pass on the user's environment and Vercel.
