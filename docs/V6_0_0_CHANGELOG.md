# v6.0.0 Changelog

## Added

- Enterprise operating layer route and API.
- Role-aware dashboard module.
- RBAC matrix with 12 roles and 37 permissions.
- Account/team/task/notification/approval data contracts.
- Manager hierarchy and visibility helper functions.
- Assignment/reassignment API route.
- GoodDay compliance score API.
- Admin enterprise governance page.
- Smoke test script.

## Changed

- Version target moved to 6.0.0.
- Roadmap continues from v5.9 account/RBAC hardening into broader Work OS operating layer.

## Safety

- No real destructive writes are enabled.
- Assignment API returns shadow-safe mutation preview and notification preview.
- Data is self-contained and compatible with later Prisma adapter connection.

## Known limitations

- Real DB-backed persistence is still controlled by the existing v5.7/v5.8 adapter/cutover roadmap.
- Native mobile offline workflow remains a future major release.
