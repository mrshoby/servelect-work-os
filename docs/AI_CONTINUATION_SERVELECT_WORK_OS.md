# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Current target version

Current requested build: **v2.3.0 — Prisma Runtime Shadow Mode Pack**

## Product goal

SERVELECT WORK OS / SERVELECT EMP is intended to be a task-first Work OS for Servelect:
- projects
- tasks
- subtasks
- Kanban/list/table/calendar/Gantt
- workload
- timesheet
- documents
- comments/activity
- approvals
- CRM, IoT, equipment, maintenance, funding/ESG, HR/admin integrated around tasks/projects.

## Honest current status

The web app is an advanced enterprise beta / architecture prototype with many admin readiness modules and mock/API foundations.

The task module is **not yet fully functional production**.

Current task capabilities:
- task UI exists;
- task table/board/calendar/approvals exist as optimized UI;
- localStorage/Zustand still exists;
- API contracts for tasks/projects were introduced in v1.7;
- UI store integration and flags were introduced in v1.8/v1.9;
- beta stabilization v2.0 and DB provider runtime v2.1 were planned;
- Prisma schema/seed planning v2.2 was introduced.

Missing for full task functionality:
- real Prisma/PostgreSQL persistence;
- UI hydrated from API provider by default;
- create/update/delete persisted in DB;
- comments/subtasks/attachments/dependencies CRUD;
- persistent time tracking;
- audit log on every mutation;
- RBAC enforcement per mutation;
- server-side filtering/pagination/sorting;
- E2E task lifecycle tests.

## Build history relevant problems

Repeated TypeScript/Vercel build failures were fixed defensively:
- `PageHeader actions` prop issue on `/taskuri`;
- Sidebar `mobile` prop issue in `AppShell`;
- duplicate `generatedAt` in performance audit route;
- missing `manifestWithoutGeneratedAt`;
- `db-ready` type/tone mismatches;
- duplicate `ok` in task-project-health route.

Future scripts should keep defensive cleanups:
- remove Sidebar `mobile` prop;
- normalize performance audit route;
- force task-project-health route to return `NextResponse.json(getTaskProjectPersistenceHealth())`;
- remove all `db-ready` references from `apps/web` TS/TSX.

## v2.3.0 adds

- Prisma shadow runtime readiness module;
- task functionality status dashboard;
- shadow mode health endpoints;
- explicit answer that task module is not full production yet;
- plan for v2.4 repository adapter and seed execution.

## New v2.3 files

- `apps/web/lib/enterprise/prisma-shadow-mode.ts`
- `apps/web/lib/enterprise/task-functionality-status.ts`
- `apps/web/app/admin/prisma-shadow/page.tsx`
- `apps/web/app/admin/task-completeness/page.tsx`
- `apps/web/app/api/v1/enterprise/prisma-shadow/route.ts`
- `apps/web/app/api/v1/enterprise/prisma-shadow-health/route.ts`
- `apps/web/app/api/v1/enterprise/prisma-shadow-plan/route.ts`
- `apps/web/app/api/v1/enterprise/task-functionality-status/route.ts`
- `scripts/prisma-shadow-mode-test.ps1`
- `docs/V23_PRISMA_RUNTIME_SHADOW_MODE_PACK.md`

## Next logical build

**v2.4.0 — Prisma Seed Execution & Repository Adapter Pack**

Recommended scope:
1. add `prisma/seed.ts`;
2. add repository adapter interfaces;
3. add mock-memory vs prisma-shadow provider switch;
4. add safe read-only shadow tests;
5. do not enable production writes yet;
6. expose route-level provider diagnostics.

## User preference

The user wants larger, meaningful version releases, not tiny incremental patches. Continue with bigger v2.x builds that move the app closer to a real production Work OS.
