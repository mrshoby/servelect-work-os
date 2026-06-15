# v8.6.0 — Auth.js Runtime Binding, Prisma RLS Middleware & Department Pilot Writes

Major release, not a small incremental patch.

## Added

- `/taskuri/enterprise-control-room`
- `/work-os/auth-rls-department-pilot`
- `/admin/auth-rls-department-pilot`
- `/api/v1/work-os/v86-auth-rls-department-pilot/*`
- Additive Prisma migration for auth runtime claims, RLS middleware proof and department pilot writes.
- GoodDay-like command-center lanes for My Work, Tickets/Forms, Workflows, Time/Workload, RLS and Providers.
- Functional and screenshot audit scripts for v8.6.0.

## Safety

- Global primary writes remain disabled.
- Pilot writes are department-scoped and require rollback checkpoint.
- Provider secrets are not stored in repository.
