# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Current known target
Project: SERVELECT WORK OS / SERVELECT EMP  
Current build package prepared: **v2.6.0 — Task UI API Wiring Pack**

## Product vision
The application must be a task-first enterprise Work OS for Servelect, similar in direction to GoodDay/ClickUp/Linear/Asana/Monday, but adapted to photovoltaic/energy operations.

Core must remain centered on:
- projects
- tasks/subtasks
- Kanban/list/table/Gantt/calendar/workload
- timesheet
- documents
- chat/updates
- approvals
- reports
- workflows
- roles/RBAC

Energy/IoT/equipment/maintenance/CRM/funding/HR are operational modules integrated into the same task/project system, not separate apps.

## Latest build v2.6.0
Added:
- `/admin/task-api-wiring`
- `/admin/release-status`
- `/changelog`
- `/api/v1/enterprise/task-api-wiring`
- `/api/v1/enterprise/task-api-wiring-health`
- `/api/v1/enterprise/task-ui-api-contract`
- `/api/v1/enterprise/task-api-wiring-plan`
- `apps/web/lib/task-api/client.ts`
- `apps/web/hooks/useTaskApiBridge.ts`
- visible release status and product completion percentages.

## Current completion estimates after v2.6
- Website/Web App: 78%
- Task & Project Core: 64%
- Backend/API: 58%
- Database/Prisma/Seed: 52%
- Auth/RBAC: 40%
- IoT/Ops: 36%
- Mobile App: 22%

## Important truth
The task module is NOT yet fully functional production. It has UI, mock/localStorage store, API contracts, API client and feature-flag bridge, but not complete DB-backed production CRUD.

Missing for full task production:
- UI task list/board/drawer reading directly from API
- create/update/delete/status-change through API in visible UI
- optimistic update + rollback
- comments/subtasks API endpoints
- persistent activity log
- RBAC enforcement on all mutations
- DB-backed writes via Prisma
- server pagination/filter/sort
- attachments/documents persistence

## Known defensive fixes to preserve
Every future patch should preserve:
- remove `mobile` prop passed to Sidebar in AppShell
- remove duplicate `generatedAt` in performance audit route
- return task-project-health directly without duplicate `ok`
- remove any `db-ready` status from TS/TSX source or normalize it to `ready`
- update localStorage key with each major build to avoid stale browser state

## Next recommended build
**v2.7.0 — API-backed Task Board & Drawer Pack**

Goals:
1. Add feature flag controlled API read mode for `/taskuri`.
2. Task table/list reads from `/api/v1/tasks` when flag enabled.
3. Kanban status change calls API and rolls back on failure.
4. Task drawer refreshes selected task from API after mutation.
5. Keep exact same visual interface.
6. Update `/admin/release-status` and `/changelog` with v2.7.
