# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.4.0 — Timeline/Gantt Dependency Editor, Calendar Capacity Sync & Real Task Drawer Mutation Queue.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces: action board, hierarchy, task detail, workload, time tracking, updates and request intake.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 added workspace UX hardening: saved view policies, keyboard commands, bulk operations preview, drawer flow and notification queue.
- v9.4.0 adds timeline/Gantt-ready dependencies, calendar capacity sync, drawer mutation queue, approval workflow builder, task templates and policy contracts.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels or a parallel internal Work OS sidebar.

## Next major build

v9.5.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening

Scope:
1. Connect drawer mutation queue to a persistence adapter behind explicit environment gates.
2. Add command palette actions for assign, status, due date, dependency and watcher changes.
3. Harden Gantt/timeline interaction contracts with conflict detection and rollback preview.
4. Add notification routing for approval workflow decisions and policy contract changes.
5. Keep global production writes disabled until manager, database, provider and rollback gates pass.
