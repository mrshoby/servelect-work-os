# v4.5.0 — Production Task Writes Real Enable Switch

This release adds the real enable switch layer for production task writes.

## Default safety state

Production writes remain OFF by default.

The switch requires explicit environment gates and evidence before any real production task write can be enabled.

## Visible status percentages

- Website/Web App: 99%
- Task & Project Core: 99%
- Backend/API: 99%
- Database/Prisma/Seed: 99%
- Auth/RBAC: 99%
- IoT/Ops: 74%
- Mobile App: 70%

## New admin page

- `/admin/production-task-writes-real-enable-switch`

## New APIs

- `/api/v1/enterprise/production-task-writes-real-enable-switch`
- `/api/v1/enterprise/production-task-writes-real-enable-switch-health`
- `/api/v1/enterprise/production-task-writes-real-enable-switch-gates`
- `/api/v1/enterprise/production-task-writes-real-enable-switch-commands`
- `/api/v1/enterprise/production-task-writes-real-enable-switch-rollback`
- `/api/v1/enterprise/production-task-writes-real-enable-switch-plan`
- `/api/v1/tasks/real-enable-switch`

## Required enable gates

- `TASK_WRITES_SHADOW_CONFIRMED=true`
- `TASK_WRITES_LIMITED_GA=true`
- `TASK_WRITES_PRODUCTION_ENABLED=true`
- `TASK_WRITES_REAL_ENABLE_SWITCH=approved`

## Kill switch

- `TASK_WRITES_PRODUCTION_KILL_SWITCH=true`
