# V7.1.0 Changelog — Backend Mutation Adapter, Server Notifications & Multi-User Records

## Added

- New backend mutation adapter: `apps/web/lib/enterprise/work-os-v71-backend-mutation-adapter.ts`.
- New UI routes: `/work-os/backend-mutations`, `/admin/backend-mutations`.
- New API routes: `/api/v1/work-os/v71-mutations`, `/health`, `/tasks`, `/tickets`, `/notifications`.
- Mutation contracts for tasks, tickets, request forms, notifications, approvals, saved views, workflows, custom fields, time entries, timesheets and automations.
- Audit events for every mutation.
- RBAC/department mutation guard.
- Server notification readiness model.
- v7.1 functional route smoke script.
- Updated `docs/NEXT_BUILD_PLAN.md`.

## Changed

- Version alignment to `7.1.0` in package/app release files.
- Release manifest now includes v7.1 milestone, global scores and next build plan.
- Selected Taskuri/Admin routes use v7.1 mutation adapter surfaces.

## Not yet production-final

- Prisma primary writes remain gated.
- Notifications are API-shadow/local-ready, not websocket/email/push.
- Attachments/files storage remains pending.
- Automations still need worker/queue.
