# SERVELECT WORK OS — NEXT BUILD PLAN

Current corrective line: v9.8.0 — GoodDay UI Content Density and Functional Parity Correction.

## Current status

- v9.7.0 passed route/API/source/screenshot checks but user live review confirmed the UI still looked too simple and not close enough to a mature Work OS.
- v9.8.0 must correct direction: dense Taskuri workspace, realistic content, interactive drawer/table/board/tickets/workload and local persistence.
- Route/API 200 is no longer sufficient as a design acceptance criterion.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility routing only and must not introduce a second visible shell.

## Quality rule

Do not call a page GoodDay-like if it only has simple cards. A page must include dense data, shared state, interactive actions, local/mock/API persistence, filters, drawer/table/board/workload/tickets logic and manual UI audit.

## Next major build after v9.8.0

v9.9.0 — True Drag/Drop Board, Real Gantt Interaction & Backend Mutation Adapter Pilot

Planned scope:
1. Real drag/drop Kanban with persisted column movement.
2. Real Gantt dependency editing and timeline resizing.
3. Server-backed mutation adapter pilot for selected fields behind explicit gates.
4. File/evidence preview panel and upload adapter boundary.
5. Role/RBAC enforcement proof for Manager/Technician/Viewer.
6. Keep global production writes disabled until all rollback/provider/database gates pass.
