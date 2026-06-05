# AI Continuation — SERVELECT WORK OS / SERVELECT EMP

## Current version
v2.5.0 — DB-backed Task Mutations Pack

## Project goal
SERVELECT WORK OS is a task-first enterprise Work OS for Servelect: projects, tasks, subtasks, Kanban, table/list, calendar, workload, timesheet, documents, approvals, CRM, IoT/energy monitoring, equipment/logistics, maintenance, financing/ESG, HR/admin and mobile field operations.

## Current status
The web app is an advanced enterprise beta, not final production.

Estimated completion after v2.5:
- Website/Web App: ~76%
- Task & Project Core: ~58%
- Backend/API: ~52%
- Database/Prisma/Seed: ~48%
- Auth/RBAC: ~38%
- IoT/Ops: ~35%
- Mobile App: ~20%

## Important honest note
Task management is still not fully production complete. It has UI, mock/localStorage fallback, API contracts, feature flags and now DB-backed mutation planning/shadow mode. Real PostgreSQL writes are still gated/off by default.

## v2.5 changes
Added:
- apps/web/lib/enterprise/task-mutations.ts
- apps/web/app/admin/task-mutations/page.tsx
- apps/web/app/api/v1/enterprise/task-mutations/route.ts
- apps/web/app/api/v1/enterprise/task-mutations-health/route.ts
- apps/web/app/api/v1/enterprise/task-mutations-plan/route.ts
- apps/web/app/api/v1/enterprise/task-mutation-audit/route.ts
- updated release-status and changelog data to show v2.5 status and next updates
- scripts/task-mutations-test.ps1
- docs/V25_DB_BACKED_TASK_MUTATIONS_PACK.md

## Required checks after deployment
Test:
- /admin/task-mutations
- /admin/release-status
- /changelog
- /api/v1/enterprise/task-mutations
- /api/v1/enterprise/task-mutations-health
- /api/v1/enterprise/task-mutations-plan
- /api/v1/enterprise/task-mutation-audit
- /api/v1/enterprise/release-status
- /taskuri

Run:
```powershell
.\scripts\task-mutations-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Previous recurring build issues to guard against
- Do not use `PageHeader actions={...}` because PageHeader uses children, not actions.
- Do not pass `mobile` prop to `Sidebar` from AppShell.
- Avoid duplicate properties in response objects such as `ok` or `generatedAt` before spreading objects.
- Remove/normalize all `db-ready` references in TS/TSX if the status type does not include it.
- Keep localStorage key bumped per release to avoid old browser state freezes.

## Next build
v2.6.0 — Task UI API Wiring Pack

Must deliver:
- load tasks from `/api/v1/tasks` under feature flag;
- create task modal posts to API;
- task status change uses PATCH API;
- fallback to localStorage if API fails;
- no freeze on `/taskuri`;
- release-status/changelog updated visibly on site.
