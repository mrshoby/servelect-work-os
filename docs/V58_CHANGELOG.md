# v5.8.0 Changelog

## Added

- Controlled Prisma Cutover dashboard
- Seed parity dashboard
- Live mutation audit center
- Rollback center
- Admin Prisma Cutover Control Room
- API endpoints for cutover, status, parity, mutations and rollback
- Adapter lanes across 10 Work OS domains
- Mutation contracts with idempotency keys and rollback plans
- Cutover waves for gradual production activation
- Updated visible Work OS status/progress percentages
- Sidebar links for Prisma Cutover, Mutation Audit and Admin Prisma

## Changed

- Package versions update to 5.8.0 via apply script.
- Sidebar visible build label updated to v5.8.
- Workflow direction continues original Work OS vision: task/project first, with energy/stock/IoT modules integrated.

## Safety

- No dangerous production writes enabled by default.
- Mutations are simulated/shadow-safe unless environment write mode is intentionally configured.

## Known limitations

- Prisma real production mutations still require final schema/env validation.
- SSO/Auth.js production auth remains a future hardening stage.
- Mobile offline sync remains next major build target.
