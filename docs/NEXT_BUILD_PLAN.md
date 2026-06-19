# SERVELECT WORK OS — NEXT BUILD PLAN

Current major line: v15.0.0 — GoodDay 1:1 Structural Taskuri Parity.

## Current status

v13 proved route unification and single-sidebar behavior, but review showed too many Taskuri pages still looked like the same enterprise table/list template. v14 introduced route-family content but still did not reach real GoodDay-like visual/page differentiation.

v15 must be validated as the first serious structural UI density build:

- 16 core Taskuri routes must look visibly different.
- No duplicate inner menu.
- No repeated generic table-only page.
- All buttons must have handlers, state changes, persistence or feedback.
- Screenshot/manual audit must judge density and function, not just screenshot existence.

## Next build after v15

v16.0.0 — Real Provider Mutation Adapter, Drag/Drop Persistence, Gantt Reschedule Engine & RBAC Browser QA.

Only start v16 after:

1. `pnpm build` passes.
2. v15 source and browser-flow source audits pass.
3. v15 route/API smoke passes on Vercel.
4. v15 screenshot/manual audit confirms route-specific GoodDay-like density.
5. v15 functional browser flow verifies real button behavior on localhost or Vercel.

## Do not do next

- Do not add another Taskuri internal sidebar.
- Do not claim 1:1 final unless manual screenshot review confirms it.
- Do not proceed to provider/backend if pages still visually repeat the same template.
- Do not accept button marker tests as proof of functionality without browser-flow QA.
