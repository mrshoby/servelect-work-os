# V57 QA Report

## Expected local commands

The apply script runs:

```powershell
pnpm typecheck
pnpm build
```

`pnpm install` is intentionally skipped by default because dependencies are already installed and no new packages are introduced.

## Routes to verify after Vercel deploy

- `/work-os/data-switchboard`
- `/admin/work-os-data-switchboard`
- `/api/v1/work-os/data-switchboard`
- `POST /api/v1/work-os/data-switchboard/mutations`

## Build notes

This patch uses only existing dependencies and existing Work OS components. It imports mock/source data from `@servelect/shared` using existing exports: `tasks`, `projects`, `users`, `approvals`, `inventory`, `iotAlerts`, `maintenanceTickets`.

## Deployment expectation

After `git push origin HEAD:main`, Vercel should automatically deploy from GitHub if the project is connected.
