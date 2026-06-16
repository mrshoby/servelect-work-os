# SERVELECT WORK OS — NEXT BUILD PLAN

Current corrective line: v14.0.3 — GoodDay Route-Specific Taskuri Content Parity, Browser Flow Real Handlers Fix.

## Current status

- v13.0.0 unified all Taskuri routes under one canonical single-sidebar workspace.
- v14.0.0 added route-specific GoodDay-like content families so Taskuri pages no longer all show the same Enterprise table/list.
- v14.0.1 added missing drawer open marker.
- v14.0.2 fixed browser-flow audit script syntax.
- v14.0.3 wires the remaining audit markers to real visible handlers: `state.addTask`, `state.addTicket`, `state.exportCsv`, `checklistDone`, `dueDate`.

## Current progress toward 100%

| Category | Current score after v14.0.3 | Notes |
|---|---:|---|
| Single canonical sidebar | 100% | No internal Taskuri menu allowed. |
| GoodDay visual similarity | 84% | Route families are distinct, still not pixel-identical. |
| Taskuri route-specific content | 90% | 17 view families mapped. |
| GoodDay UI density | 91% | Dense content across Taskuri pages. |
| Buttons / handlers | 95% | Real local handlers and audits present. |
| Persistence | 84% | localStorage persistence, not full provider/DB. |
| Functional parity | 86% | Still needs real persisted drag/drop and Gantt engine. |
| QA confidence | 86% | Source, browser-flow and screenshot audits required. |
| Production readiness | 67% | Needs provider mutation, RBAC proof and rollback gates. |

## Next major build

v15.0.0 — Real Drag/Drop Board Persistence, Gantt Edit Engine, Provider Mutation Adapter & Browser Flow QA.

Only start v15 after:

1. `pnpm build` passes.
2. `audit-v1400-goodday-route-specific-source.mjs` passes.
3. `audit-v1401-browser-flow.mjs` passes.
4. `audit-v1402-browser-flow-script-syntax.mjs` passes.
5. `audit-v1403-browser-flow-real-handlers.mjs` passes.
6. v14 Vercel route/API smoke passes.
7. v14 screenshot/manual UI audit passes and screenshot ZIP is reviewed.

## Do not do next

- Do not add another internal menu.
- Do not make every submenu show the same table.
- Do not validate only routes/API.
- Do not proceed to provider/backend mutation before v14 route-specific UI and browser-flow audits are clean.
