# SERVELECT WORK OS v6.7.2 Global Command Route Repair

This hotfix force-copies the missing global command routes introduced in v6.7.0/v6.7.1 and validates that the files exist in the local Next.js app.

Repaired routes:

- `/work-os/dashboard`
- `/search`
- `/api/v1/work-os/global-command`

Also keeps:

- `/notifications`
- `/work-os/notification-center`
- `/work-os/approvals`
- `/action-center`
- taskuri bridge routes

Run after applying:

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v672-global-command-functional-test.ps1 -BaseUrl "http://127.0.0.1:3100"
```
