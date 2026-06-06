# v4.4.0 — Production Task Writes Full Enablement Runbook

This release adds the full enablement runbook for production task writes.

## Added

- Admin page: `/admin/production-task-writes-full-enablement-runbook`
- Enterprise runbook endpoint
- Health endpoint
- Runbook endpoint
- Enablement gates endpoint
- Rollback endpoint
- Plan endpoint
- Task-side endpoint: `/api/v1/tasks/full-enablement`

## Status percentages

- Website/Web App: 99%
- Task & Project Core: 99%
- Backend/API: 99%
- Database/Prisma/Seed: 99%
- Auth/RBAC: 98%
- IoT/Ops: 70%
- Mobile App: 66%

## Production write status

Production writes remain OFF by default. v4.4.0 documents the full enablement runbook and requires explicit environment gate activation before real production task writes are enabled.

## Next build

`v4.5.0 — Production Task Writes Real Enable Switch`
