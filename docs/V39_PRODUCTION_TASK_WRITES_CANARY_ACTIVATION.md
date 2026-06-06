# v3.9.0 — Production Task Writes Canary Activation

This package introduces a controlled canary layer for production task writes.

## Status / percentages visible on site

- Website/Web App: 95%
- Task & Project Core: 96%
- Backend/API: 93%
- Database/Prisma/Seed: 92%
- Auth/RBAC: 83%
- IoT/Ops: 52%
- Mobile App: 46%

## Included routes

- `/admin/production-task-writes-canary`
- `/api/v1/enterprise/production-task-writes-canary`
- `/api/v1/enterprise/production-task-writes-canary-health`
- `/api/v1/enterprise/production-task-writes-canary-rings`
- `/api/v1/enterprise/production-task-writes-canary-rollback`
- `/api/v1/enterprise/production-task-writes-canary-plan`
- `/api/v1/tasks/production-canary`

## Production stance

Canary writes are ON as a controlled contract layer. Full production writes remain OFF until the v4.0 general availability gate.

## Safety requirements

- RBAC decision before every write.
- Before/after audit envelope for every canary mutation.
- Canary write rate limit by ring.
- Hard delete blocked.
- Rollback guard required for create, update, status movement and assignment.
