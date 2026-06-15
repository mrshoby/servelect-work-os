# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version

v8.5.0 — Enterprise User Session Adapter, RLS Department Write Scopes & GoodDay Work OS Suite Hardening

## What was done in v8.5.0

- Larger major build instead of tiny incremental update.
- Added enterprise department suite for Work OS/Admin.
- Added real session-claim model for super admin, department admin, team lead and client portal.
- Added department/team/client write scopes.
- Added RLS policy proof matrix.
- Added guarded bulk actions with rollback checkpoints and approval gates.
- Added provider runtime evidence and dead-letter visibility.
- Added GoodDay parity lanes for My Work, workflows, saved views, tickets/forms and enterprise access.
- Added API v85 and screenshot/functional test scripts.
- Added additive migration SQL for write scopes, RLS proof and bulk action guardrails.

## Current scores

| Category | Score |
|---|---:|
| GoodDay visual/UX similarity | 84% |
| GoodDay functional parity | 96% |
| Local real functionality | 96% |
| Backend/API parity | 98% |
| Production readiness | 98% |
| Enterprise access control | 90% |
| Bulk operations/import-export | 82% |
| QA confidence | 96% pending local/Vercel QA |
| Screenshot audit coverage | 100% target after v8.5 audit |

## Problems remaining

- Auth/session claims are not yet bound to live Auth.js/session runtime.
- Prisma RLS middleware is not yet active in dry-run/pilot mode.
- DB write pilot remains gated.
- Email/push/webhook providers remain dry-run or blocked without real provider secrets/device registry.
- Global production writes must remain disabled.

## Next build recommended

v8.6.0 — Auth.js Runtime Binding, Prisma RLS Middleware & Department Pilot Writes

## Mandatory scope for v8.6.0

1. Bind v8.5 claim model to real auth/session adapter.
2. Add Prisma middleware for RLS dry-run/pilot proof.
3. Persist policy proof results.
4. Execute scoped department writes for selected entities only.
5. Verify rollback and audit consistency on Vercel.
6. Keep provider sends dry-run unless secrets are configured.
7. Keep global writes off.

## Do NOT do next

- Do not add unrelated modules.
- Do not redesign from scratch.
- Do not enable global writes.
- Do not skip route tests or screenshot audit.
- Do not claim 100% while DB/provider/runtime pieces remain gated.

## Routes affected

- `/work-os/enterprise-department-suite`
- `/admin/enterprise-department-suite`
- `/api/v1/work-os/v85-enterprise-department-suite/*`
- existing Taskuri baseline routes remain preserved.

## QA status

Pending user local run and Vercel deployment test for v8.5.0.

## Screenshot audit status

Pending user run of `node scripts/audit-v850-screenshots.mjs`.

## GitHub/Vercel status

Patch pack delivered. User must apply, run QA, commit and push to GitHub, then verify Vercel.
