# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.4.0 — Timeline/Gantt Dependency Editor, Calendar Capacity Sync & Real Task Drawer Mutation Queue.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces: action board, hierarchy, task detail, workload, time tracking, updates and request intake.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 hardened workspace UX with drawer flow, saved view policies, keyboard commands, bulk operations preview and notification queue.
- v9.4.0 added timeline dependency editor, calendar capacity sync, drawer mutation queue, approval workflow builder, task templates, recurrence and policy contracts.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels or a parallel internal Work OS sidebar.

## Current major build

v9.5.0 — Collaboration, Files/Evidence, SLA Inbox & Decision Register

Scope:
1. Add task collaboration hub with watchers, owner responses and unified activity.
2. Add checklist quality gates connected to task evidence and approvals.
3. Add files/evidence ledger for photos, PDFs, signed PV documents and provider receipts.
4. Add SLA escalation inbox tied to workload and manager decisions.
5. Add decision register and client request bridge inside Taskuri.
6. Keep global production writes disabled until all gates pass.

## Next major build

v9.6.0 — Portfolio/Project Program Board, Cross-Module WorkGraph & Reporting Command Layer

Planned scope:
1. Connect Taskuri execution to project/program boards without creating a second app shell.
2. Add WorkGraph relationship map for projects, tasks, tickets, evidence, decisions and workload.
3. Add reporting command layer for operational summaries, SLA, workload and evidence readiness.
4. Add tighter GoodDay-like workspace polish: compact density, saved layout preferences and command navigation.
5. Screenshot and source audit must verify Taskuri remains the single canonical navigation surface.
