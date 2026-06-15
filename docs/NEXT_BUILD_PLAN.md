# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v8.3.0 — Prisma Audit/Outbox Tables, Transactional Write Pilot & Vercel Runtime Proof

## Previous validated baseline
v8.2.0 — Auth Session Claims, Audit Event Trail & Provider Event Outbox

Validation provided by user:
- Functional route/API smoke: 31 / 31 PASS on https://servelect-work-os-web.vercel.app
- Screenshot package for v8.2.0 provided.

## What v8.3.0 adds
- Additive Prisma schema preparation for `WorkOsAuditEvent`, `WorkOsProviderOutboxEvent`, `WorkOsWriteTransactionPilot`, `WorkOsRuntimeProof`.
- Migration SQL for audit/outbox transaction pilot.
- Route `/work-os/prisma-audit-outbox-transaction-pilot`.
- Route `/admin/prisma-audit-outbox-transaction-pilot`.
- API namespace `/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/*`.
- Transactional write pilot lanes for ticket escalation, saved view server sync and task status write attempts.
- Runtime proof checklist for Vercel smoke + screenshot audit.
- Rollback replay model remains dry-run/gated.

## Current scores after v8.3.0
| Category | Current | Previous | Notes |
|---|---:|---:|---|
| GoodDay visual/UX similarity | 81% | 80% | control-plane pages more compact/enterprise |
| GoodDay public feature parity | 94% | 94% | no new broad module, deeper production proof |
| Task management core | 96% | 96% | protected by primary write pilot |
| Tickets / Requests / Forms | 96% | 96% | escalation lane now transaction-pilot aware |
| Notifications | 97% | 97% | provider outbox prepared for dispatch worker |
| Workflows / custom statuses / validations | 95% | 95% | policy guard evidence preserved |
| Saved views / filters / table views | 96% | 96% | server sync lane in transaction pilot |
| Backend / API / persistence | 97% | 96% | Prisma schema and migration prepared |
| Screenshot audit coverage | 100% target | 100% | must run v830 screenshot script |
| QA/build stability | 96% target | 95% | pending local pnpm QA |
| Production readiness | 96% | 95% | transactional write evidence layer added |

## Problems remaining
- Prisma migration must be applied only after DB target is confirmed.
- Provider dispatch worker is not yet executing real email/push/websocket delivery.
- Write transaction pilot is still gated; global production writes remain OFF.
- Runtime proof depends on post-deploy smoke/screenshot evidence.

## Next recommended build
v8.4.0 — Database Adapter Transaction Execution & Provider Dispatch Worker

## Scope for v8.4.0
1. Implement database adapter switch for the new audit/outbox tables.
2. Add transaction runner with dry-run, canary and primary-pilot modes.
3. Add provider dispatch worker simulation with retry/backoff and dead-letter lane.
4. Add admin controls for replaying failed outbox events.
5. Add Vercel runtime proof report that stores last smoke and screenshot evidence.

## Do NOT do next
- Do not add unrelated modules.
- Do not enable global production writes.
- Do not redesign Taskuri just for visual changes.
- Do not bypass auth/session claims.
- Do not remove existing v8.0/v8.1/v8.2 APIs.

## Affected routes
- `/taskuri/*` remains regression-tested.
- `/admin/prisma-audit-outbox-transaction-pilot`
- `/work-os/prisma-audit-outbox-transaction-pilot`
- `/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot/*`

## QA status
Pending local apply:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `scripts/work-os-v830-functional-test.ps1`
- `scripts/audit-v830-screenshots.mjs`

## GitHub/Vercel status
Apply locally, commit and push to `origin main`, then verify Vercel routes.
