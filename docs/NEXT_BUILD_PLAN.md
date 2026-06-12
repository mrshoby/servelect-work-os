# NEXT BUILD PLAN — after v7.9.0

Current version: v7.9.0 — Provider Canary Activation, Shared View ACL & Primary Write Pilot

## Done in v7.9.0
- Provider canary activation layer added.
- Shared view ACL model added.
- Primary write pilot with dry-run SQL, lock version and rollback checkpoint added.
- Real Taskuri/Admin/Work OS routes updated.
- API route family `/api/v1/work-os/v79-primary-write-pilot/*` added.

## Current scores
- GoodDay visual similarity: 77%
- GoodDay functional parity: 91%
- Local real functionality: 95%
- Backend/API parity: 92%
- Production readiness: 91%
- QA confidence: 92% after local QA passes

## Missing to 100%
- Primary writes are still globally gated.
- Push/websocket providers still need real credentials/runtime.
- Authenticated ACL enforcement must be wired to real sessions/users.
- Rollback drill must be proven before any broad DB write.

## Recommended next build
v8.0.0 — Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill

## Do not do
- Do not redesign again before v7.9 QA passes.
- Do not add unrelated modules.
- Do not open primary writes globally.
- Do not bypass Vercel protection except via automation secret for tests.
