# AI Continuation — SERVELECT WORK OS / SERVELECT EMP

## Current target version

v2.4.0 — Prisma Seed Execution & Repository Adapter Pack

## Current project goal

Build SERVELECT WORK OS / SERVELECT EMP as a task-first enterprise Work OS for Servelect: projects, tasks, subtasks, Kanban, list/table, Gantt/timeline, calendar, workload, timesheet, documents, chat/updates, approvals, reports, workflows, roles/permissions, and operational modules for energy/IoT/equipment/maintenance/CRM/funding/HR.

## Important user requirement

The site must always show:

- current version;
- changelog per version;
- what was done;
- what is still missing;
- what must be done in the next updates;
- website completion percentage;
- mobile app completion percentage;
- honest status of whether tasks/projects are production-ready.

## Current honest status

- Website/Web App: advanced enterprise beta, around 72%.
- Task & Project Core: around 46%, not full production yet.
- Backend/API: around 42%, contracts exist but provider is mostly mock-memory.
- Database/Prisma/Seed: around 38%, not active production writes yet.
- Auth/RBAC: around 36%, no production SSO/Auth.js yet.
- IoT/Ops: around 34%, mock data and simulated alerts.
- Mobile App: around 18%, mostly concept/skeleton.

## v2.4 files added

- `apps/web/lib/enterprise/release-status.ts`
- `apps/web/lib/enterprise/prisma-seed-execution.ts`
- `apps/web/app/admin/release-status/page.tsx`
- `apps/web/app/changelog/page.tsx`
- `apps/web/app/admin/prisma-seed-execution/page.tsx`
- `apps/web/app/api/v1/enterprise/release-status/route.ts`
- `apps/web/app/api/v1/enterprise/release-changelog/route.ts`
- `apps/web/app/api/v1/enterprise/product-completion/route.ts`
- `apps/web/app/api/v1/enterprise/next-updates/route.ts`
- `apps/web/app/api/v1/enterprise/prisma-seed-execution/route.ts`
- `apps/web/app/api/v1/enterprise/prisma-seed-execution-health/route.ts`
- `apps/web/app/api/v1/enterprise/repository-adapter-plan/route.ts`
- `scripts/prisma-seed-adapter-test.ps1`
- `docs/V24_PRISMA_SEED_EXECUTION_REPOSITORY_ADAPTER_PACK.md`

## Known recurring build fixes to preserve

Always keep defensive fixes in PowerShell scripts until the source is fully stabilized:

- Remove invalid `mobile` prop from `Sidebar` usage in `AppShell.tsx`.
- Remove duplicate `generatedAt` and `manifestWithoutGeneratedAt` issues from `performance/audit/route.ts`.
- Ensure `task-project-health/route.ts` returns `NextResponse.json(getTaskProjectPersistenceHealth())` directly.
- Remove all `db-ready` from `apps/web` TS/TSX or normalize it consistently if used again.
- Keep localStorage store key bumped per major version to avoid stale broken state.

## Next recommended build

v2.5.0 — DB-backed Task Mutations Pack

Must deliver:

- real server-side task create/update/delete contract;
- provider switch: mock-memory | prisma-shadow | prisma-active;
- validation schema for task mutations;
- audit event per mutation;
- shadow write comparison report;
- no UI regression on `/taskuri`.

## Do not claim production-ready yet

The app is not yet 100% complete. Website is beta; mobile is early foundation; task module is not full DB-backed production.
