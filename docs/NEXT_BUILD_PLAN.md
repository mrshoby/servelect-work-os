# SERVELECT WORK OS — NEXT BUILD PLAN

Current technical line: v10.0.3 — Table/API Build Fix.

## Current status

- v10.0.0 attempted a major GoodDay UI/content/function parity correction.
- v10.0.0 manual UI density audit remained unacceptable and must not be called final.
- v10.0.1/v10.0.2 focused on route/API completion, but `/taskuri/table` still failed build because it imported a missing component.
- v10.0.3 fixes the build by making `/taskuri/table` redirect to the existing `/taskuri/tabel` page and ensuring the v100 API endpoints exist.

## Rule

Do not continue adding provider/status pages. Do not call route/API PASS a design pass. Do not claim GoodDay parity unless the manual UI density audit and browser-flow QA pass.

## Next major build

v11.0.0 — Major GoodDay Taskuri Workspace Redesign, Browser Flow QA & Shared State Hardening.

Required scope:
1. Replace the remaining simple Taskuri pages with dense, route-specific Work OS views.
2. Implement real browser-flow tests for task creation, drawer edits, board movement, table bulk actions, ticket workflow, saved views, workload recalculation, and refresh persistence.
3. Add real drag/drop or equivalent persisted board movement.
4. Add real Gantt/date editing and workload recalculation.
5. Keep global production writes disabled until explicit backend/rollback gates pass.
6. Manual UI density audit must fail pages that are only screenshots or simple cards.
