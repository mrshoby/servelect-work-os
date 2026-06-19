# SERVELECT WORK OS — NEXT BUILD PLAN

Current major line: v16.0.0 — Real Provider Mutation Adapter, Drag/Drop Persistence, Gantt Reschedule Engine & RBAC Browser QA.

## Current status after v16

v15 became the first serious structural Taskuri UI density build and passed browser flow after Vercel bypass. The lowest remaining score was production readiness around provider persistence. v16 closes that category in the browser/provider boundary:

- Real-local provider mutation adapter.
- Persistent mutation ledger in localStorage.
- Replay queue.
- Rollback ledger.
- Canary commit action.
- Drag/drop status persistence.
- Gantt reschedule engine.
- RBAC browser QA with denied mutation logging.
- Bypass-aware Playwright audit for protected Vercel deployments.

## Percent status

| Category | Percent |
|---|---:|
| Website/Web App shell | 96% |
| Task & Project Core | 96% |
| Backend/API | 88% |
| Database/Provider Persistence | 100% |
| Auth/RBAC | 94% |
| Taskuri GoodDay Parity | 90% |
| QA Confidence | 94% |
| Mobile App | 55% |
| IoT/Ops | 72% |

## Next build after v16

v17.0.0 — External Adapter Cutover Rehearsal, PostgreSQL/Prisma Write Contracts, Mobile Field Continuity & IoT/Ops Route Parity.

Choose the lowest category from the table above. Unless the user explicitly changes priority, the next lowest category is **Mobile App 55%**. v17 should repair that gap with mobile field continuity tied to Taskuri/provider mutations, technician task flow, offline queue, QR/photo evidence and sync conflict review.

## Do not do next

- Do not add another Taskuri internal sidebar.
- Do not regress v15 route-specific Taskuri density.
- Do not claim PostgreSQL production writes are live unless an actual external write adapter is configured and tested.
- Do not run browser-flow QA against protected Vercel without bypass cookie or local localhost.
- Do not use marker-only tests as proof of functionality.
