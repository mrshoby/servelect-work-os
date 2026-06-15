# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.6.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces: action board, hierarchy, task detail, workload, time tracking, updates and request intake.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 hardened workspace UX with drawer flow, saved view policies, keyboard commands, bulk operations preview and notification queue.
- v9.4.0 added timeline dependency editor, calendar capacity sync, drawer mutation queue, approval workflow builder, task templates, recurrence and policy contracts.
- v9.5.0 added collaboration hub, files/evidence ledger, SLA inbox, workload forecast, decision register and request portal bridge.
- v9.6.0 added inline persistence adapter gates, command palette actions, Gantt conflict review, notification routing, saved view persistence, task change audit and manager gate inbox.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels or a parallel internal Work OS sidebar.

## Current major build

v9.7.0 — Portfolio Program Board, Cross-Module WorkGraph & Reporting Command Layer

Scope:
1. Connect Taskuri execution to project/program boards without creating a second app shell.
2. Add WorkGraph relationship map for projects, tasks, tickets, evidence, decisions and workload.
3. Add reporting command layer for operational summaries, SLA, workload and evidence readiness.
4. Add tighter GoodDay-like workspace polish: compact density, saved layout preferences and command navigation.
5. Keep global production writes disabled until manager, database, provider and rollback gates pass.

## Next major build

v9.8.0 — Advanced Portfolio Permissions, Report Exports & Persisted Layout Preferences

Planned scope:
1. Permission matrix for portfolio/program/report visibility by role and department.
2. Report export contracts for executive summary, SLA, workload and evidence readiness.
3. Persisted layout preferences behind explicit environment gates.
4. Cross-module search refinement for projects, tasks, tickets, files and decisions.
5. Screenshot and source audit must verify Taskuri remains the single canonical navigation surface.
