# SERVELECT WORK OS — NEXT BUILD PLAN

Current technical line: v10.0.2 — Route/API + Table Import Build Fix.

## Current status

- v10.0.0 attempted a major GoodDay UI/content/function parity correction.
- The source audit was cleaned and passed.
- The route/API test initially failed 19 / 27 because `/taskuri/table` and the v100 parity API endpoints were missing on live Vercel.
- v10.0.1 added the missing route/API endpoints but introduced a build-breaking import in `/taskuri/table` by importing a named component as default.
- v10.0.2 fixes the import and keeps the v100 route/API completion.
- Manual UI density audit remains failed: v10.0.0 screenshot/manual audit reported 0 / 19 pages as GoodDay-density acceptable.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains compatibility routing only and must not introduce a second visible shell.

## Quality rule

Do not call a page GoodDay-like if it only has simple cards. Route/API PASS and screenshot captured are necessary but not sufficient.

## Required verification after v10.0.2

1. `pnpm typecheck`
2. `pnpm build`
3. `node scripts/audit-v1002-source.mjs`
4. `./scripts/work-os-v1002-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"` after deploy

Expected technical target: `27 / 27` route/API smoke.

## Next major build

v11.0.0 — Major GoodDay Taskuri Workspace Redesign, Browser Flow QA & Shared State Hardening.

Planned scope:
1. Replace simple Taskuri pages with page-specific dense layouts, not one generic template everywhere.
2. Add a browser-tested interactive task drawer with edit/save/comment/checklist/dependency/timer flows.
3. Add true shared state across My Work, Board, Table, Calendar/Gantt and Workload.
4. Add drag/drop board or an equivalent tested move control that persists and updates counts.
5. Add real tickets/request center workflows with escalation, conversion to task and notifications.
6. Add browser flow QA that tests the user flows, not only HTTP 200.
7. Re-run manual screenshot UI density acceptance and fail pages that still look simple.

## What must not be done

- Do not create a parallel Work OS shell.
- Do not create a separate non-production surface.
- Do not rely only on route/API smoke.
- Do not mark UI parity as passed until the manual UI audit passes.
