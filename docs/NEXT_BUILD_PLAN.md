# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.5.0 — GoodDay Collaboration Files SLA Operations Layer.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces: action board, hierarchy, task detail, workload, time tracking, updates and request intake.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 added workspace UX hardening: saved view policies, keyboard commands, bulk operations preview, drawer flow and notification queue.
- v9.4.0 added timeline/Gantt dependencies, calendar capacity sync, drawer mutation queue, approval workflow builder, task templates and policy contracts.
- v9.5.0 added collaboration hub, checklists, files/evidence ledger, SLA escalation, workload forecast, decision register and request portal bridge.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels, a parallel internal Work OS sidebar, or wording that suggests a separate non-production surface.

## Current major build

v9.6.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening

Scope:
1. Connect drawer mutation queue to a persistence adapter behind explicit environment gates.
2. Add command palette actions for assign, status, due date, dependency and watcher changes.
3. Harden Gantt/timeline interaction contracts with conflict detection and rollback preview.
4. Add notification routing for approval workflow decisions and policy contract changes.
5. Persist saved view policies as governed records, not only local filters.
6. Keep global production writes disabled until manager, database, provider and rollback gates pass.

## Next major build

v9.7.0 — Portfolio Hierarchy, Board Swimlanes & Cross-Module Task Rollups

Planned scope:
1. Project/folder/subproject hierarchy rollups inside Taskuri.
2. Board swimlanes by assignee, priority, department and SLA risk.
3. Cross-module task rollups from Pontaj, Stocuri, CRM, Mentenanță and Documente.
4. Better GoodDay-like view switching without duplicating data.
5. Source, screenshot and functional audits must confirm Taskuri remains the single canonical navigation surface.
