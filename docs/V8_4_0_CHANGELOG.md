# V8.4.0 Changelog

## Added

- Database adapter transaction execution control plane.
- Provider dispatch worker with lease, retry/backoff and dead-letter state.
- API v8.4 route group.
- Work OS/Admin v8.4 pages.
- Additive Prisma migration for adapter execution, dispatch leases and dead-letter events.
- Functional and screenshot audit scripts with safe report output paths.

## Safety

- Global production writes remain OFF.
- Primary adapter remains dry-run unless policy proofs and RLS evidence are complete.
