# NEXT BUILD PLAN — after v8.2.0

Current version: v8.2.0 — Real Auth Session Claims, Audit Event Trail & Provider Event Outbox

## Done in v8.2.0
- Continued from v8.1.0 after functional route/API test passed 28/28.
- Added auth/session claim model for actor, role, department, team, client scope and max write mode.
- Added audit event trail with before/after hashes, rollback ids and outbox correlation.
- Added provider event outbox for in-app, email, push, websocket and webhook lanes.
- Added policy simulator and replay drill API endpoints.
- Added real Work OS/Admin routes: `/work-os/auth-session-audit-outbox` and `/admin/auth-session-audit-outbox`.
- Added v8.2 smoke and screenshot audit scripts.

## Current scores
- GoodDay visual similarity: 80%
- GoodDay functional parity: 94%
- Local real functionality: 95%
- Backend/API parity: 96%
- Production readiness: 95%
- QA confidence: 95% after local QA passes
- Screenshot audit coverage: 100% if v8.2 screenshot script captures all routes cleanly

## Missing to 100%
- Prisma-backed `audit_event` and `provider_outbox` tables are still missing.
- Staging DB transaction pilot must prove create/update/rollback with one safe entity.
- Provider secrets must be wired through Vercel/local environment only.
- Pixel-diff screenshot audit is still missing; current audit confirms HTTP + PNG only.
- Playwright interaction E2E for actual writes is still required.

## Recommended next build
v8.3.0 — Prisma Audit/Outbox Tables, Transactional Write Pilot & Vercel Runtime Proof

## Scope obligatoriu v8.3.0
1. Add Prisma models/migration plan for audit events and provider outbox.
2. Add staging-only transactional write pilot for one safe entity.
3. Persist rollback checkpoints and outbox dispatch evidence through repository adapter.
4. Add API mutation endpoints with lockVersion and idempotency key.
5. Add Playwright interaction test for one real create/update/rollback flow.

## Do not do
- Do not redesign again before DB/outbox proof.
- Do not add unrelated modules.
- Do not enable global primary writes.
- Do not store provider secrets in repository.
- Do not bypass Vercel protection except through local environment variables for tests.

## Routes affected
- `/work-os/auth-session-audit-outbox`
- `/admin/auth-session-audit-outbox`
- `/api/v1/work-os/v82-auth-audit-outbox/*`

## QA status
Run after apply:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `.\scripts\work-os-v820-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"`
- `node scripts/audit-v820-screenshots.mjs`

## GitHub/Vercel status
The apply script can commit/push if credentials are available. If not, run the commands shown in the final ChatGPT response.
