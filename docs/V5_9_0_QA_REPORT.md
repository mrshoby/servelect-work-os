# V5_9_0_QA_REPORT.md

## Required local QA
Run after applying the update:

```powershell
pnpm typecheck
pnpm build
```

`pnpm install` is not run by default. Use it only if dependencies or lockfile changed.

## Expected checks
- `/my-work`
- `/account/profile`
- `/account/settings`
- `/account/security`
- `/account/notifications`
- `/team/workload`
- `/team/tasks`
- `/admin/users`
- `/admin/users/u1`
- `/admin/roles`
- `/admin/permissions`
- `/admin/departments`
- `/admin/teams`
- `/admin/audit-log`
- `/work-os/goodday-compliance`
- `/api/v1/work-os/accounts`
- `/api/v1/work-os/team`
- `/api/v1/work-os/rbac`
- `/api/v1/work-os/goodday-compliance`

## Known existing warnings
Existing unused import warnings may remain from older admin pages. v5.9 avoids adding ESLint errors intentionally.
