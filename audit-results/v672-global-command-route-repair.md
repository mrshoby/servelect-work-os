# SERVELECT WORK OS v6.7.2 Global Command Route Repair

Status: patch applied locally.

This repair force-copied the missing global command route files:

- apps/web/app/work-os/dashboard/page.tsx
- apps/web/app/search/page.tsx
- apps/web/app/api/v1/work-os/global-command/route.ts
- apps/web/components/work-os/V67GlobalCommandIntegrationClient.tsx

Run:

- pnpm typecheck
- pnpm lint
- pnpm build
- .\scripts\work-os-v672-global-command-functional-test.ps1 -BaseUrl "http://127.0.0.1:3100"
