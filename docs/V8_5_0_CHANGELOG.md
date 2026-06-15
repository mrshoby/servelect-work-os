# v8.5.0 — Enterprise User Session Adapter, RLS Department Write Scopes & GoodDay Work OS Suite Hardening

## Why this build is larger

Starting with v8.5.0, SERVELECT WORK OS releases must stop being small single-route increments. This release combines several critical GoodDay-parity and production-readiness areas into one coherent major step:

- real session-claim model;
- department/team/client-scoped write boundaries;
- RLS policy proof matrix;
- guarded bulk actions;
- provider runtime evidence;
- GoodDay-like Work OS lanes for My Work, workflows, tickets, saved views and enterprise access;
- additive database migration for department write scopes, RLS policy proof and bulk action guardrails.

## Added

- `/work-os/enterprise-department-suite`
- `/admin/enterprise-department-suite`
- `/api/v1/work-os/v85-enterprise-department-suite`
- `/api/v1/work-os/v85-enterprise-department-suite/health`
- `/session-adapter`
- `/rls-policy-proof`
- `/department-write-scopes`
- `/bulk-actions`
- `/goodday-parity-workspace`
- `/provider-runtime`
- `/rbac-drill`
- `/runtime-proof`
- `scripts/work-os-v850-functional-test.ps1`
- `scripts/audit-v850-screenshots.mjs`

## Not enabled

- global production writes;
- real email/push/webhook sending without provider secrets;
- Auth.js live session binding;
- Prisma middleware activation outside dry-run/pilot proof.

## Next

v8.6.0 must bind the session claims to real auth/runtime and activate Prisma RLS middleware in dry-run/pilot mode.
