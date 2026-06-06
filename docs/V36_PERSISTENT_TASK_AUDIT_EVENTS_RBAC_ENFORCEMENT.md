# SERVELECT WORK OS v3.6.0 — Persistent Task Audit Events & RBAC Enforcement

This release is a larger governance update after v3.5.0.

## Visible completion status

- Website/Web App: 92%
- Task & Project Core: 89%
- Backend/API: 85%
- Database/Prisma/Seed: 82%
- Auth/RBAC: 69%
- IoT/Ops: 46%
- Mobile App: 36%

## Added

- Admin page: `/admin/persistent-task-audit-rbac`
- Enterprise API: `/api/v1/enterprise/persistent-task-audit-rbac`
- Health API: `/api/v1/enterprise/persistent-task-audit-rbac-health`
- RBAC matrix API: `/api/v1/enterprise/persistent-task-audit-rbac-rbac`
- Audit contract API: `/api/v1/enterprise/persistent-task-audit-rbac-audit`
- Rollout plan API: `/api/v1/enterprise/persistent-task-audit-rbac-plan`
- Task API surface: `/api/v1/tasks/audit-rbac`

## Status

Production Prisma writes remain disabled by default. This release defines persistent audit event contracts and RBAC enforcement gates for task mutations.

## Next build

v3.7.0 — Controlled Prisma Task Writes Staging
