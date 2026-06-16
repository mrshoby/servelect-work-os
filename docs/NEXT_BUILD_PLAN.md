# SERVELECT WORK OS — NEXT BUILD PLAN

Current major line: v13.0.0 — Full Taskuri Route Unification, Single Sidebar Enforcement & Screenshot Delivery.

## Current status after v12.0.3

- v12.0.3 route/API passed 29/29 on Vercel.
- Live marker check for `/taskuri` confirmed the internal Taskuri menu markers are gone on the main route.
- However, source audit still found many historical `/taskuri/*` pages not bound to the single-sidebar workspace.
- Therefore v13.0.0 must not start backend/provider mutation yet; it must first bind every existing Taskuri page to one canonical workspace component.

## Non-negotiable navigation rule

Taskuri must use only the global left application sidebar. Do not add an internal Taskuri/Work OS menu, inner sidebar, workspace-tree navigation, or second navigation shell inside the page content. A right task detail drawer is allowed because it is not navigation.

## v13.0.0 scope

1. Rebind all `apps/web/app/taskuri/**/page.tsx` pages to `V130UnifiedTaskuriWorkspace`.
2. Keep all Taskuri legacy/historical URLs working, but render the same single-sidebar workspace shell.
3. Add dense task UI, table, board, tickets, workload, drawer and local persistence boundary.
4. Add screenshot delivery script that outputs PNGs and `audit-results/v1300-screenshots.zip`.
5. Add strict source audit verifying no Taskuri page remains bound to old V9/V10/V11/V12 workspace shells.

## Current progress toward 100%

| Category | Current score | Notes |
|---|---:|---|
| Single canonical sidebar | 100% target after v13 | Must be verified across every Taskuri page, not only `/taskuri`. |
| GoodDay visual similarity | 82% | Dense workspace exists; still not pixel-identical and should not be called 1:1. |
| Taskuri UI density | 90% | Dense local/mock content; needs real DB data later. |
| Functional parity | 84% | Interactive local state; true backend mutation still pending. |
| Buttons | 93% | Main visible actions have handlers; browser click QA must continue. |
| Persistence | 82% | localStorage, not full provider/DB. |
| Production readiness | 65% | Needs DB mutation, RBAC proof, audit ledger and rollback gates. |
| QA confidence | 80% | Depends on v13 screenshots and live marker checks. |

## Next major build after v13

v14.0.0 — Real Drag/Drop Board Persistence, Gantt Edit Engine, Provider Mutation Adapter & Browser Flow QA.

Start v14 only after:
1. `pnpm build` passes with v13.
2. v13 source audit reports all Taskuri pages bound to V130.
3. v13 route/API smoke passes after Vercel deploy.
4. `audit-v1300-screenshots-manual.mjs` produces screenshots and a passing manual UI audit.
5. Vercel confirms old Taskuri inner-menu markers do not appear.

## Do not do next

- Do not create another menu inside Taskuri.
- Do not create demo pages.
- Do not validate only route/API 200.
- Do not start provider/backend mutation before the full Taskuri route unification is confirmed on Vercel.
