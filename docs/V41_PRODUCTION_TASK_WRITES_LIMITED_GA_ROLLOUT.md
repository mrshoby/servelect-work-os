# v4.1.0 — Production Task Writes Limited GA Rollout

This package introduces the limited GA rollout layer for production task writes.

## Status / percentages visible on site

- Website/Web App: 97%
- Task & Project Core: 98%
- Backend/API: 96%
- Database/Prisma/Seed: 96%
- Auth/RBAC: 91%
- IoT/Ops: 58%
- Mobile App: 54%

## Included routes

- `/admin/production-task-writes-limited-ga`
- `/api/v1/enterprise/production-task-writes-limited-ga`
- `/api/v1/enterprise/production-task-writes-limited-ga-health`
- `/api/v1/enterprise/production-task-writes-limited-ga-waves`
- `/api/v1/enterprise/production-task-writes-limited-ga-monitoring`
- `/api/v1/enterprise/production-task-writes-limited-ga-rollback`
- `/api/v1/enterprise/production-task-writes-limited-ga-plan`
- `/api/v1/tasks/limited-ga`

## Production stance

Limited GA is ready, but production writes stay OFF by default. Operators must enable the explicit environment gate and activate a rollout wave.

## Limited GA requirements

- Wave 0 Admin limited GA can run with explicit environment gate.
- RBAC preflight is mandatory before every write.
- Persistent before/after audit is mandatory.
- Rollback playbooks must be ready before each wave.
- Kill switch remains available without redeploy.
- Full GA remains blocked until limited GA evidence is stable.
