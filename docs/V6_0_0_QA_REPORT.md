# v6.0.0 QA Report

## Expected local commands

The apply script runs:

```powershell
pnpm typecheck
pnpm build
```

`pnpm install` is intentionally skipped by default because the local workspace already has dependencies. Vercel will run install automatically.

## Manual checks after deploy

- `/work-os/enterprise-operating-layer`
- `/work-os/accounts-v2`
- `/work-os/team-command`
- `/work-os/role-dashboards`
- `/work-os/notification-center`
- `/admin/enterprise-governance`
- `/api/v1/work-os/enterprise-operating-layer`
- `/api/v1/work-os/enterprise-operating-layer/accounts`
- `/api/v1/work-os/enterprise-operating-layer/tasks/assignments`
- `/api/v1/work-os/enterprise-operating-layer/notifications`
- `/api/v1/work-os/enterprise-operating-layer/approvals`
- `/api/v1/work-os/enterprise-operating-layer/compliance`

## Vercel blockers addressed by design

- New pages use self-contained imports and avoid `<a>` for internal Next navigation.
- New API routes use typed JSON responses.
- New TypeScript module avoids importing non-existent shared mocks.
- No `any` types are introduced in the v6 files.
