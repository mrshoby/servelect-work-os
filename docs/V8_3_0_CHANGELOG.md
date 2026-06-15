# v8.3.0 Changelog — Prisma Audit/Outbox Transaction Pilot

## Added
- New Work OS/Admin production-control pages for Prisma audit/outbox transaction pilot.
- New API namespace `/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot`.
- Additive Prisma schema patch documentation and SQL migration.
- Transactional write pilot model with lockVersion, rollback checkpoint and runtime proof.
- Provider outbox event state prepared for dispatch worker.
- Functional route test script for 34 routes/API endpoints.
- Screenshot audit script for v8.3.0.

## Changed
- Version target moves to `8.3.0` through apply script.
- `docs/NEXT_BUILD_PLAN.md` updated to continue toward v8.4.0.

## Safety
- Global production writes remain disabled.
- Migration is additive and must be applied intentionally.
- Rollback replay is dry-run/gated.
