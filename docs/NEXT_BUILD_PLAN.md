# SERVELECT WORK OS — NEXT BUILD PLAN

Current validated line: v9.0.3 — API Subroute Completion & Production Pilot Cutover Stabilization.

## Current status

- v8.9.0 was validated with 66/66 functional/API and 50/50 screenshot checks.
- v9.0.0 introduced the Production Pilot Cutover surfaces.
- v9.0.1 unified navigation and removed the stale Work OS shell/version label problem.
- v9.0.2 restored the release manifest TypeScript contract.
- v9.0.3 completes the 15 missing v90 API subroutes that returned 404 on Vercel.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry from the main dashboard. `/work-os/*` remains as compatibility/execution routes, not as a second visible top-level app shell. Do not reintroduce `SERVELECT Work OS v7.9.0 · Provider Canary / ACL / Primary Pilot`.

## Next major build

v9.1.0 — DB-Backed Provider Dispatch Worker, Real Webhook Intake Ledger & Task Mutation Pilot

Scope:
1. DB-backed provider dispatch ledger.
2. Real webhook intake ledger with idempotency proof.
3. Task mutation pilot with manager approval gates.
4. Replay/dead-letter recovery into real records.
5. GoodDay-like task object model foundation: task type, custom fields, recurrence, dependencies and activity stream.
6. Keep global production writes disabled until all gates pass.
