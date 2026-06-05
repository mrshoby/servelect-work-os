# SERVELECT WORK OS — Progress Log

## v1.0 — Enterprise Release Baseline

Status: patch pregătit pentru deploy Vercel-safe.

Adăugat:

- `/admin/release` — Release Console v1.
- `/api/v1/release/manifest`.
- `/api/v1/release/checklist`.
- `apps/web/lib/release/manifest.ts`.
- system capabilities actualizate la `1.0.0`.
- system status include release readiness summary.
- sidebar include `Release v1`.
- fix compatibilitate v0.9: `approvalRequests` → `approvals`.

Scop:

- marchează baseline-ul enterprise v1;
- păstrează deploy-ul sigur pe Vercel fără DB obligatorie;
- clarifică release gates și roadmap v1.x;
- pregătește trecerea către Database Activation Pack.

## v0.9 — Action Center & Audit Automation

Adăugat:

- `/action-center`.
- `/admin/audit`.
- `/api/v1/action-center`.
- `/api/v1/audit/events`.
- `/api/v1/workflows/executions`.
- upgrade pentru workflow run cu execution + audit event.

## v0.8 — Persistence & Governance Core

Adăugat:

- `/admin/system`.
- `/workflows`.
- `/api/v1/system/status`.
- `/api/v1/system/readiness`.
- `/api/v1/workflows/templates`.
- `/api/v1/workflows/run`.

## v0.7 — Protected App + User Management

Adăugat:

- protected app foundation;
- unauthorized page;
- admin users;
- authorize API;
- impersonate demo;
- user detail/patch demo.
