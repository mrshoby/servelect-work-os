# SERVELECT Work OS v5.1.0 — Production Source Cutover Rehearsals & Adapter Parity Drills

This release moves the platform from source-of-truth adapter activation into production cutover rehearsals.

## Scope

- Taskuri, Proiecte, Stocuri, Pontaj, Audit, Users, Documents, CRM, Ofertare, Achizitii, IoT/Ops, Reports, Mobile and Admin Controls.
- Adapter parity drills for primary adapters, read-model projections, audit taps and reconciliation adapters.
- Cutover rehearsals with rollback windows, go/no-go evidence and incident playbooks.

## Production write policy

Production writes remain **OFF by default**. This release validates cutover readiness and adapter parity only.

## New admin pages

- `/admin/production-source-cutover-rehearsals`
- `/admin/production-source-cutover-rehearsals-domain-map`
- `/admin/production-source-cutover-rehearsals-adapter-registry`
- `/admin/production-source-cutover-rehearsals-contracts`
- `/admin/production-source-cutover-rehearsals-parity-drills`
- `/admin/production-source-cutover-rehearsals-reconciliation`
- `/admin/production-source-cutover-rehearsals-command-center`
- `/admin/production-source-cutover-rehearsals-incidents`
- `/admin/production-source-cutover-rehearsals-runbook`
- `/admin/production-source-cutover-rehearsals-go-no-go`

## New APIs

See the matching `/api/v1/enterprise/production-source-cutover-rehearsals-*` routes plus domain routes under `/api/v1/tasks`, `/api/v1/projects`, `/api/v1/stock`, `/api/v1/pontaj`, `/api/v1/audit`, `/api/v1/work-os`.

## Next

v5.2.0 should introduce pilot waves and a real unified reconciliation queue.
