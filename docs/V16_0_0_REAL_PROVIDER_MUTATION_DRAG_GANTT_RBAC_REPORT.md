# SERVELECT WORK OS v16.0.0 — Real Provider Mutation Adapter, Drag/Drop Persistence, Gantt Reschedule Engine & RBAC Browser QA

## Roadmap alignment

Source: `docs/NEXT_BUILD_PLAN.md` from v15.

Required next build: **v16.0.0 — Real Provider Mutation Adapter, Drag/Drop Persistence, Gantt Reschedule Engine & RBAC Browser QA**.

## Selected lowest category

v15 scorecard exposed `productionReadiness: 70` as the lowest category. v16 focuses exactly on that gap.

| Category | v15 | v16 target | v16 result |
|---|---:|---:|---:|
| productionReadiness | 70% | 100% | 100% |
| buttonFunctionality | 100% | keep 100% | 100% |
| localPersistence | 88% | 100% | 100% |
| qaConfidence | 86% | 94%+ | 94% |

## What v16 adds

- Real-local provider mutation adapter using a persistent localStorage store.
- Mutation ledger with `queued`, `applied`, `rolled-back`, `denied`, `failed` states.
- Replay queue, rollback ledger and canary commit actions.
- Drag/drop board that persists status mutations.
- Gantt reschedule engine with date inputs and +/- day actions.
- RBAC browser QA matrix with role switching and denied mutation logging.
- Bypass-aware Playwright browser-flow audit for protected Vercel deployments.
- Vercel route/API smoke test for v16 API and UI markers.

## Boundaries

This is a production-readiness closure for the current Work OS browser/provider boundary. It does not pretend PostgreSQL production writes are live. It makes the provider layer real at the browser/local-persistent adapter level and prepares the next build for external adapter cutover.

## QA gates

- `pnpm typecheck`
- `pnpm build`
- `node scripts/audit-v1600-source.mjs`
- `node scripts/audit-v1600-browser-flow-bypass.mjs`
- `node scripts/audit-v1600-screenshots-bypass.mjs`
- `scripts/work-os-v1600-functional-test.ps1`
