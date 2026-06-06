# SERVELECT WORK OS v5.3.0 — Real CRUD Screens & Form Workflows

This release moves the platform closer to the original SERVELECT WORK OS / EMP prompt: a GoodDay / ClickUp / Linear / Asana / Monday-style work platform adapted to an energy/PV company.

## Added

- Real Work OS form workflow layer for projects, tasks, stock reservations, offers and pontaj workload proposals.
- New UI pages for CRUD-style workflows.
- Interactive preview console for form payloads and audit/write-gate envelopes.
- Validation rules per entity.
- Audit contracts per entity.
- API routes for GET preview and POST safe submit.
- Production writes remain controlled by `SERVELECT_WORK_OS_WRITE_MODE` and default to safe/off mode.

## New pages

- `/work-os/forms`
- `/work-os/projects/new`
- `/work-os/tasks/new`
- `/work-os/stock/reservations`
- `/work-os/offers/new`
- `/work-os/pontaj/workload`
- `/admin/work-os-workflows`

## New APIs

- `/api/v1/work-os/forms`
- `/api/v1/work-os/forms/templates`
- `/api/v1/work-os/forms/options`
- `/api/v1/work-os/forms/validate`
- `/api/v1/work-os/forms/projects/create`
- `/api/v1/work-os/forms/tasks/create`
- `/api/v1/work-os/forms/stock/reserve`
- `/api/v1/work-os/forms/offers/create`
- `/api/v1/work-os/forms/pontaj/workload`
- `/api/v1/work-os/workflows`
- `/api/v1/tasks/form-workflows`
- `/api/v1/projects/form-workflows`
- `/api/v1/stock/reservations`
- `/api/v1/offers/form-workflows`
- `/api/v1/pontaj/workload-proposals`

## Next recommended release

v5.4.0 — Persistent CRUD Drafts, Approval Flows & Kanban/Calendar UX Pack.
