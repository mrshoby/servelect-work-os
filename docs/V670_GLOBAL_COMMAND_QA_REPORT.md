# SERVELECT WORK OS v6.7.0 — QA Report

## Required local QA
Run after applying the update:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

## Functional smoke
With local server running on port 3100:

```powershell
.\scripts\work-os-v670-global-command-functional-test.ps1 -BaseUrl "http://127.0.0.1:3100"
```

Expected routes:

- `/work-os/dashboard`
- `/notifications`
- `/work-os/notification-center`
- `/work-os/approvals`
- `/search`
- `/action-center`
- `/api/v1/work-os/global-command`
- `/taskuri/overview`
- `/taskuri/tickets-notificari`
- `/taskuri/workload-aprobari`

## Screenshot audit
Optional Playwright screenshot audit:

```powershell
node scripts/audit-v67-global-routes.mjs
```

or with custom base URL:

```powershell
$env:SERVELECT_BASE_URL="http://127.0.0.1:3100"
node scripts/audit-v67-global-routes.mjs
```

## Notes
Do not claim visual audit coverage unless PNG files are generated and non-zero bytes.
