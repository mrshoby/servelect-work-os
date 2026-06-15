# NEXT BUILD PLAN — after v8.1.0

Current version: v8.1.0 — Primary Write Session Binding, Provider Runtime Evidence & Reconciliation Queue

## Done in v8.1.0
- Continued after v8.0.0 production pilot.
- Added session-bound ACL model for primary write pilot.
- Added primary write queue with lockVersion, rollback checkpoint, provider and reconciliation state.
- Added provider runtime evidence for in_app/email/push/websocket.
- Added reconciliation lanes for shadow -> canary -> primary pilot -> rollback.
- Added routes `/work-os/primary-write-session-provider` and `/admin/primary-write-session-provider`.
- Added API family `/api/v1/work-os/v81-primary-write-session-provider/*`.
- Added v8.1 functional route/API smoke script and screenshot audit script.

## Current scores
- GoodDay visual similarity: 79%
- GoodDay functional parity: 93%
- Local real functionality: 95%
- Backend/API parity: 95%
- Production readiness: 94%
- QA confidence: 94% after local QA passes
- Screenshot audit coverage: 100% only after v8.1 screenshot script passes

## Missing to 100%
- Session-bound ACL is still modeled; it must be wired to real Auth/session claims.
- Primary writes remain gated and not broadly enabled.
- Provider runtime needs real credentials/secrets for email/push/websocket.
- Reconciliation needs real Postgres/audit event persistence.
- Need interaction E2E tests for actual create/edit/approve/escalate flows, not only route/API smoke.

## Recommended next build
v8.2.0 — Real Auth Session Claims, Audit Event Table & Provider Event Outbox

## Scope for v8.2.0
1. Connect session ACL model to real session/user claims or the existing auth facade.
2. Add audit event/outbox model for provider events and write-intent reconciliation.
3. Add DB adapter switch for audit/outbox while keeping production writes gated.
4. Add E2E-style smoke for task/ticket/saved-view/time-entry write intent lifecycle.
5. Keep GoodDay-like Taskuri routes stable; no unrelated redesign.

## Do not do
- Do not open primary writes globally.
- Do not add unrelated modules.
- Do not redesign the whole UI before auth/outbox/reconciliation are real.
- Do not treat provider email/push/websocket as production-ready without credentials.
- Do not skip QA, route smoke or screenshot audit.

## Status GitHub/Vercel
- Commit/push required after QA.
- Vercel must be verified after deploy on `/taskuri`, v8.0 routes and v8.1 routes.
