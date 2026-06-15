# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.7.1 — Visual Density Taskuri Workspace Correction.

## Current status

- v9.0.4 removed the legacy internal Work OS sidebar and kept Taskuri as the single canonical entry.
- v9.1.0 added GoodDay-like task execution surfaces.
- v9.2.0 added provider dispatch ledger, webhook intake ledger, task mutation pilot, dead-letter ledger, task object model and activity stream.
- v9.3.0 added workspace UX hardening.
- v9.4.0 added timeline/Gantt dependencies, calendar capacity sync, drawer mutation queue, approval workflows, templates and policy contracts.
- v9.5.0 added collaboration hub, checklists, files/evidence ledger, SLA escalation, workload forecast, decision register and request bridge.
- v9.6.0 added live inline persistence adapter, command palette actions, Gantt conflict review, notification routing, saved view persistence and manager gate inbox.
- v9.7.0 added portfolio WorkGraph/reporting routes but was visually too simple.
- v9.7.1 corrects the v9.7 surface with a denser Taskuri workspace: workspace tree, view tabs, command toolbar, board/table, timeline lane, reporting panel, task drawer and saved layouts.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility/execution routing only, not a second visible app shell. Do not reintroduce legacy labels, a parallel internal Work OS sidebar, demo wording, or a separate non-production surface.

## Next major build

v9.8.0 — Advanced Task Detail Interactions, Persisted Layout Preferences & Exportable Reporting Packs

Planned scope:
1. Deeper task detail drawer interactions: comments, subtasks, checklist gates, attachments and approval actions in the drawer.
2. Persisted layout preferences per role/team/department behind safe adapters.
3. Exportable reporting packs for SLA, workload, evidence and executive summary.
4. Denser board/table/timeline interactions with real filters, row grouping and swimlanes.
5. Screenshot and source audit must verify Taskuri remains the single canonical navigation surface and the UI is dense enough for a real workspace.
