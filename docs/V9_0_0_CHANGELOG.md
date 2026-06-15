# SERVELECT WORK OS v9.0.0 — Production Pilot Cutover Console, Live Provider Dispatch & Signed Webhook Hardening

## Major scope

v9.0.0 is a major Work OS release, not a minor incremental patch. It extends the real Taskuri, Admin and Work OS surfaces with a production pilot command layer inspired by GoodDay-style work management: Action Required, hierarchy, workload, workflows, approvals, activity stream, API/webhook readiness and reporting.

## Added

- Production Pilot Cutover Console.
- Live Provider Dispatch model with dry-run/live split.
- Signed Webhook Hardening with HMAC, timestamp drift and idempotency.
- GoodDay-like Action Required and command layer pages.
- Workload capacity, project hierarchy and cross-module activity surfaces.
- Admin rollback drill, RBAC access gates and pixel-diff release gates.
- v90 API namespace with runtime proof endpoints.
- Additive-only Prisma migration for pilot cutover gates, provider dispatch ledger and webhook intake proof.
- GitHub Actions pixel-diff and route gate workflow.
- Functional and screenshot audit scripts.

## Safety

Global production writes remain disabled. v9.0.0 models scoped pilot readiness only. Real provider credentials must remain in ENV/Vercel/GitHub secrets, never committed to the repository.
