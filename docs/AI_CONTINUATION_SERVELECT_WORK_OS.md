# AI Continuation Context — SERVELECT WORK OS / SERVELECT EMP

## Current target version

Current planned build: **v1.6.0 — Task & Project Persistence Pack**

Repo: `https://github.com/mrshoby/servelect-work-os`

Production URL: `https://servelect-work-os-web.vercel.app`

Local repo path used by user:

```text
D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live
```

## Product direction

SERVELECT WORK OS / SERVELECT EMP is a task-first enterprise Work OS inspired by GoodDay, ClickUp, Linear, Asana Enterprise and Monday.com, adapted for an energy / photovoltaic company.

The system must remain centered on:

- projects
- tasks
- subtasks
- Kanban / table / list
- Gantt / timeline
- calendar
- workload
- timesheet
- documents
- updates/chat
- approvals
- reports
- workflows
- RBAC

Energy/IoT/equipment/maintenance/CRM/funding/HR modules must stay integrated through tasks/projects, not as separate apps.

## Important build history

- v1.1 introduced Enterprise Operations pages and continuation docs.
- v1.2 introduced Data Foundation.
- v1.3 introduced Database Activation Pack.
- v1.4 introduced WorkGraph Persistence Core.
- v1.5 introduced Auth & RBAC Production Pack.
- v1.6 now introduces Task & Project Persistence Pack.

## Known recurring build fixes

When applying future patches, preserve these compatibility fixes:

1. Remove unsupported `mobile` prop from `Sidebar` usage in `AppShell.tsx`.
2. Remove duplicate `generatedAt` / missing `manifestWithoutGeneratedAt` from `apps/web/app/api/v1/performance/audit/route.ts`.
3. Clean all `db-ready` string references from `apps/web/**/*.ts` and `apps/web/**/*.tsx`, normalizing to `ready`.
4. Keep `DatabaseActivationStatus` normalized to `"ready" | "partial" | "mock" | "blocked"`.
5. Update package versions consistently across root, web, mobile and shared package.json files.
6. Bump localStorage store key when major UI/store changes are introduced.

## v1.6 files added

- `apps/web/lib/enterprise/task-project-persistence.ts`
- `apps/web/app/admin/task-projects/page.tsx`
- `apps/web/app/api/v1/enterprise/task-project-persistence/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-health/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-schema/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-migration-plan/route.ts`
- `scripts/task-project-readiness-test.ps1`
- `docs/V16_TASK_PROJECT_PERSISTENCE_PACK.md`

## v1.6 validation

Run local build:

```powershell
pnpm --filter @servelect/web build
```

After deploy:

```powershell
.\scripts\task-project-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Manual test URLs:

- `/admin/task-projects`
- `/api/v1/enterprise/task-project-persistence`
- `/api/v1/enterprise/task-project-health`
- `/api/v1/enterprise/task-project-schema`
- `/api/v1/enterprise/task-project-migration-plan`
- `/taskuri`
- `/proiecte`

## Next build after v1.6

**v1.7.0 — Real Task CRUD & API-backed Store**

Recommended scope:

- implement API route handlers for projects/tasks CRUD;
- introduce provider switch `WORKOS_DATA_PROVIDER=mock|prisma`;
- connect `/taskuri` reads to API-backed store;
- implement task create/status update through API with optimistic UI;
- write audit events for task create/update/status/timer;
- keep mock fallback if `DATABASE_URL` is missing.

---
v1.6.1 fix: task-project-health duplicate ok
Date: 2026-06-05 10:40:18
Fixed apps/web/app/api/v1/enterprise/task-project-health/route.ts.
Problem: Vercel build failed because ok was specified twice: ok: true plus spread from getTaskProjectPersistenceHealth().
Fix: route now returns NextResponse.json(getTaskProjectPersistenceHealth()) directly.
