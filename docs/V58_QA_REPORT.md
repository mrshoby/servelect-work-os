# v5.8.0 QA Report

Expected local commands after applying patch:

```bash
pnpm typecheck
pnpm build
```

`pnpm install` is intentionally skipped by default unless dependencies change.

## Build expectations

- New files avoid `any` types.
- New pages use Next.js App Router server components.
- Interactive UI is isolated in a client component.
- API routes return JSON only and keep writes shadow-safe.

## Smoke test

```powershell
.\scripts\work-os-prisma-cutover-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Routes to verify

- `/work-os/prisma-cutover`
- `/work-os/seed-parity`
- `/work-os/mutation-audit`
- `/work-os/rollback-center`
- `/admin/work-os-prisma-cutover`
- `/api/v1/work-os/prisma-cutover`
- `/api/v1/work-os/prisma-cutover/status`
- `/api/v1/work-os/prisma-cutover/parity`
- `/api/v1/work-os/prisma-cutover/mutations`
- `/api/v1/work-os/prisma-cutover/rollback`
