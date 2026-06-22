# NEXT_BUILD_PLAN — after v19.0.2

## Current baseline
- Visual baseline: `taskuri-ui-v15-goodday-baseline-restored` / `V150GoodDayStructuralTaskuriWorkspace`.
- Do not introduce a new shell.
- Continue in-place improvements only.

## Next major build
`v20.0.0 — Real Backend Mutation Adapter & DB Persistence Bridge`

## Reason
The lowest remaining category is Backend/API real persistence. v19 improves frontend interaction and local persistence, but 100% GoodDay parity requires durable backend mutations.

## Scope
- Prisma-backed task/ticket/comment/time-entry/saved-view mutation adapter.
- Safe write mode and shadow mode.
- API endpoints for create/update task, ticket, comments, time entries, saved views, approvals.
- Frontend runtime switches from localStorage-only to backend-first with local fallback.
- Replay queue for offline/failed mutations.
- Full browser E2E with refresh persistence from backend.
- Screenshot/manual UI audit without visual shell regression.

## Acceptance
- No `Taskuri Workspace` / `WORKSPACE HIERARCHY` regression.
- V15 shell marker remains present.
- All principal buttons have handlers, feedback, state changes, and persistence.
- No 100% unless backend persistence and browser flow are verified.
