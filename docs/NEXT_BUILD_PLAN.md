# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.1.0 — GoodDay-like Task Execution Parity Layer.

## Current status

- v9.0.3 stabilized the Production Pilot Cutover API surface with 91/91 functional route/API checks.
- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical execution entry.
- v9.1.0 added GoodDay-like Taskuri execution surfaces: workspace command, action board, hierarchy map, task detail, workload planner, time tracking, updates stream, request intake and admin governance.
- v9.1.0 validation received: 15/15 functional/API, 10/10 screenshot audit and source audit PASS.

## Canonical navigation rule

Taskuri remains the single canonical Work OS execution entry from the main dashboard. `/work-os/*` may remain as compatibility/execution routes, but must not reintroduce a second visible shell or a competing navigation system.

## Current major build

v9.2.0 — DB-Backed Provider Dispatch Ledger, Real Webhook Intake Ledger & Task Mutation Pilot

Scope:
1. Provider dispatch ledger visible in Taskuri and Admin.
2. Webhook intake ledger with signature/idempotency proof.
3. Task mutation pilot with manager approval gates and rollback checkpoint.
4. Dead-letter/replay recovery into task activity and provider evidence.
5. GoodDay-like task object model foundation: task type, custom fields, recurrence, dependencies, watchers and activity stream.
6. Keep global production writes disabled until all database, provider and manager gates pass.

## Next major build

v9.3.0 — Inline Task Drawer Mutations, Comments Persistence Adapter & Approval Workflow Builder

Planned scope:
1. Inline task drawer with editable status, owner, priority, due date, dependencies and custom fields.
2. Comments/update stream persistence adapter with optimistic local queue and audit envelope.
3. Approval workflow builder for manager gates by department.
4. Task templates and recurring task rules closer to GoodDay operational workflows.
5. Screenshot and source audit must verify Taskuri remains the single canonical navigation surface.
