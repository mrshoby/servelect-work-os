# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.3.0 — GoodDay-like Workspace UX Hardening, Saved View Policies & Keyboard Drawer Flow.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces: action board, hierarchy, task detail, workload, time tracking, updates, request intake.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 hardens the real Taskuri workspace UX with drawer flow, saved view policies, keyboard commands, bulk operations preview and notification queue. It also cleans old wording that could imply a separate non-production surface.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels or a parallel internal Work OS sidebar.

## Next major build

v9.4.0 — Timeline/Gantt Dependency Editor, Calendar Capacity Sync & Real Task Drawer Mutation Queue

Scope:
1. Add dependency editor and timeline/Gantt-ready task relations inside Taskuri.
2. Add calendar capacity sync view tied to workload and due dates.
3. Connect task drawer staged updates to a mutation queue with audit/rollback envelope.
4. Expand saved view policies into persistent policy contracts.
5. Keep global production writes disabled until all gates pass.
