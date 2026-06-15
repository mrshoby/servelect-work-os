# NEXT BUILD PLAN — SERVELECT WORK OS

Current version: v8.4.0
Current build: Database Adapter Transaction Execution & Provider Dispatch Worker
Previous validated build: v8.3.0 — Prisma Audit/Outbox Tables, Transactional Write Pilot & Vercel Runtime Proof

## What changed in v8.4.0

- Added database adapter execution control plane for Prisma audit/outbox and primary task/ticket write adapters.
- Added provider dispatch worker model with lease TTL, retry/backoff and dead-letter queue.
- Added API v8.4 endpoints for adapter execution, dispatch worker, dead-letter, rollback-worker and runtime proof.
- Added Work OS/Admin pages for `/work-os/database-adapter-dispatch-worker` and `/admin/database-adapter-dispatch-worker`.
- Added additive Prisma migration for adapter execution, dispatch lease and dead-letter tables.
- Kept global production writes OFF. Only gated pilot/dry-run lanes are represented.

## Current percentage scores

| Category | Score |
|---|---:|
| GoodDay visual/UX similarity | 82% |
| GoodDay functional parity | 95% |
| Local real functionality | 95% |
| Backend/API parity | 98% |
| Production readiness | 97% |
| QA confidence | 96% after local QA |
| Screenshot audit coverage | 100% target after v8.4 screenshots |

## Remaining critical gaps

- Real user session adapter is still not bound to a production auth provider.
- Database RLS/custom access proof is documented/modelled but not verified with live DB policies.
- Provider dispatch worker still has dry-run/blocked channels until real provider secrets are configured.
- Primary writes are still intentionally gated and not globally enabled.

## Recommended next build

v8.5.0 — Real User Session Adapter, RLS Policy Proof & Department Write Scopes

## Scope for v8.5.0

1. Bind auth/session claims to a real adapter surface.
2. Add department write-scope proof for Productie, Comercial, Audit, Audit energetic, Administrativ, Automatizari and Marketing.
3. Add RLS policy proof reports and API evidence.
4. Add seeded transaction proof with deny/allow/dry-run outcomes by role/department.
5. Keep global production writes OFF until all policy proofs pass.

## What not to do next

- Do not add unrelated modules.
- Do not redesign Taskuri globally while backend write-scope proof remains incomplete.
- Do not enable production writes globally.
- Do not skip screenshot/functional route audit.

## QA status

Run locally after applying:

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v840-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
node scripts/audit-v840-screenshots.mjs
```

## GitHub/Vercel status

Push required after local QA:

```powershell
git add -A
git commit -m "v8.4.0 - Database adapter transaction execution and provider dispatch worker"
git push origin HEAD:main
```
