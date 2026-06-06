# v4.0.0 — Production Task Writes General Availability Gate

This package introduces the general availability gate for production task writes.

## Status / percentages visible on site

- Website/Web App: 96%
- Task & Project Core: 97%
- Backend/API: 95%
- Database/Prisma/Seed: 95%
- Auth/RBAC: 88%
- IoT/Ops: 55%
- Mobile App: 50%

## Included routes

- `/admin/production-task-writes-ga-gate`
- `/api/v1/enterprise/production-task-writes-ga-gate`
- `/api/v1/enterprise/production-task-writes-ga-gate-health`
- `/api/v1/enterprise/production-task-writes-ga-gate-evidence`
- `/api/v1/enterprise/production-task-writes-ga-gate-go-no-go`
- `/api/v1/enterprise/production-task-writes-ga-gate-rollback`
- `/api/v1/enterprise/production-task-writes-ga-gate-rollout`
- `/api/v1/tasks/production-ga`

## Production stance

Production writes are still OFF by default. The GA gate is active and requires explicit environment activation after all go/no-go checks pass.

## GA requirements

- Clean canary evidence.
- RBAC decision before every write.
- Persistent before/after audit envelope.
- Rollback drill passed.
- Hard delete blocked.
- Production kill switch verified.
