# SERVELECT WORK OS — NEXT BUILD PLAN

Current technical line: v12.0.1 — Single Canonical Sidebar Taskuri Route Export Build Fix.

## Current status

- v10.0.3 stabilized Taskuri/v100 routes and API at 27/27.
- v11.0.1 stabilized v110 routes and API at 29/29.
- v12.0.0 targeted the real UI problem: duplicate internal Taskuri/Work OS menu. It must keep only the global left sidebar.
- v12.0.0 source audits passed, but `pnpm build` failed because the v120 route file exported an arbitrary `payload` helper.
- v12.0.1 fixes the Next.js route export contract by keeping helper functions internal and exporting only `GET`.

## Non-negotiable navigation rule

Taskuri must use only the global left application sidebar. Do not add an internal Taskuri/Work OS menu, inner sidebar, workspace tree nav, or second navigation shell inside the page content. A right drawer for task details is allowed because it is not navigation.

## Quality status

- Route/API 200 is not enough.
- Screenshot captured is not enough.
- UI acceptance requires visual review that no duplicate menu exists and Taskuri remains dense, functional and usable.

## Current progress toward 100%

| Category | Current score | Notes |
|---|---:|---|
| Single canonical sidebar | 90% | Code aims to remove second menu; Vercel visual confirmation still required. |
| GoodDay visual similarity | 78% | Better density, still needs final visual polish. |
| Taskuri UI density | 88% | Dense panels and data exist; must be confirmed live. |
| Functional parity | 81% | Local interactive logic exists; true backend mutation still pending. |
| Buttons | 91% | Interactive local/mock handlers exist; browser click QA still needed. |
| Persistence | 80% | localStorage, not full DB/provider. |
| Production readiness | 63% | Needs DB mutation, RBAC proof, audit ledger and rollback gates. |

## Next major build

v13.0.0 — Real Drag/Drop Board Persistence, Gantt Edit Engine, Provider Mutation Adapter & Browser Flow QA.

Only start v13 after:
1. `pnpm build` passes with v12.0.1.
2. v12 route/API smoke passes after Vercel deploy.
3. visual check confirms the duplicate inner Taskuri/Work OS menu is gone.

## Do not do next

- Do not create another menu inside Taskuri.
- Do not create demo pages.
- Do not validate only API routes.
- Do not continue to provider/backend mutation before single-sidebar UI is confirmed on Vercel.
