# v8.2.0 — Real Auth Session Claims, Audit Event Trail & Provider Event Outbox

## Added
- Auth/session claim model for actor, role, department, team, client scope and max write mode.
- Audit event trail with before/after hashes, rollback ids and optional outbox correlation.
- Provider event outbox for in-app, email, push, websocket and webhook lanes.
- Policy simulator endpoints for ACL proof checks.
- Replay drill status for capture -> audit -> outbox -> mutation -> rollback -> reconciliation.
- Real Work OS/Admin routes, not a separate demo.

## Guardrails
- Global primary writes remain disabled.
- Email/push/websocket providers remain dry-run/blocked unless credentials are configured locally.
- Next mandatory step is DB-backed Prisma audit_event/provider_outbox tables.
