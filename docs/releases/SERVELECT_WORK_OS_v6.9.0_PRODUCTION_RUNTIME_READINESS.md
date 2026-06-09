# SERVELECT WORK OS v6.9.0

## Production Runtime Readiness & Deployment Command Center

v6.9.0 adds a production/runtime layer for the release workflow after Taskuri, Global Command and Persistence/API pages were introduced.

### Added

- `/work-os/production-runtime`
- `/work-os/deployment-command`
- `/admin/production-runtime`
- `/api/v1/work-os/production-runtime`
- `/api/v1/work-os/production-runtime/readiness`
- `/api/v1/work-os/production-runtime/deployments`
- `/api/v1/work-os/production-runtime/gates`
- `scripts/work-os-v690-production-runtime-functional-test.ps1`
- `scripts/work-os-v690-vercel-production-smoke.ps1`

### Purpose

The build clarifies that local server testing is only local QA. Public deployment is done by GitHub push and Vercel automatic build when the Vercel project is linked to the GitHub main branch.

### Gates

- Local QA: typecheck/lint/build.
- Route smoke: Taskuri, global command, persistence API and runtime pages.
- GitHub push gate.
- Vercel deployment gate.
- Production URL smoke gate.
- Persistence shadow-readiness gate.
- Stock and document primary-write blocks.

### Notes

This build does not enable real Prisma primary writes. Stock and documents remain intentionally blocked until ledger/storage contracts are implemented.
