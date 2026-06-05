# AI Continuation — SERVELECT WORK OS / SERVELECT EMP

## Current target version
v2.0.0 — Enterprise Beta Stabilization.

## Project purpose
SERVELECT WORK OS / SERVELECT EMP is a task-first Work OS inspired by GoodDay, ClickUp, Linear, Asana Enterprise and Monday, adapted for Servelect / energy / photovoltaic operations.

The app must remain centered on projects, tasks, subtasks, Kanban, task table, Gantt/timeline, calendar, workload, timesheet, documents, chat/updates, approvals, reports, workflows and RBAC. Energy, IoT, equipment, maintenance, CRM, financing, ESG and HR are operational modules inside the same Work OS, not separate apps.

## Current technical stack
- Monorepo.
- Web: Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS.
- State: Zustand/localStorage with API migration in progress.
- Backend current: Next.js route handlers, mock-memory contracts.
- Future backend: PostgreSQL, Prisma, Redis, TimescaleDB, WebSocket, Auth.js/JWT/RBAC/audit log.
- Mobile: Expo/React Native skeleton only, not production-ready.

## Version history summary
- v0.7: protected app + user management foundation.
- v0.8: persistence/governance core.
- v0.9: action center + audit automation.
- v1.0: enterprise release baseline.
- v1.1: enterprise operations release.
- v1.2: enterprise data foundation.
- v1.3: database activation pack.
- v1.4: WorkGraph persistence core.
- v1.5: Auth/RBAC production pack.
- v1.6: Task & Project persistence pack.
- v1.7: Real Task CRUD & API-backed store contracts.
- v1.8: API-backed UI Store integration pack.
- v1.9: UI Task Store feature flag pack.
- v2.0: Enterprise Beta Stabilization.

## Important recurring build fixes
Keep these defensive fixes in future install scripts until the codebase is fully cleaned:
1. Remove `mobile` prop passed to `Sidebar` from `AppShell` if present.
2. Remove duplicate `generatedAt` / `manifestWithoutGeneratedAt` from `/api/v1/performance/audit`.
3. Ensure `/api/v1/enterprise/task-project-health` returns `NextResponse.json(getTaskProjectPersistenceHealth())` directly, without `ok: true` spread duplication.
4. Remove all `db-ready` strings from `apps/web/**/*.ts(x)` and normalize DB status to `ready | partial | mock | blocked`.
5. Keep `/taskuri` performance-safe: render only active view, limit heavy lists, do not render full heavy TanStack/Kanban simultaneously.
6. Update localStorage key on major builds to avoid old browser state freezing the app.

## v2.0.0 additions
Files added:
- `apps/web/lib/enterprise/beta-stabilization.ts`
- `apps/web/app/admin/beta-stabilization/page.tsx`
- `apps/web/app/api/v1/enterprise/beta-stabilization/route.ts`
- `apps/web/app/api/v1/enterprise/beta-health/route.ts`
- `apps/web/app/api/v1/enterprise/beta-route-audit/route.ts`
- `apps/web/app/api/v1/enterprise/beta-release-checklist/route.ts`
- `scripts/beta-stabilization-test.ps1`
- `docs/V20_ENTERPRISE_BETA_STABILIZATION.md`

## Current state after v2.0
Website is intended to be an internal beta candidate, not production.
Mobile remains not beta-ready.
Task/project API contracts exist, but DB provider remains mock-memory/local-first.
Auth/RBAC production still needs real provider wiring.

## Required tests after v2.0 deploy
```powershell
pnpm --filter @servelect/web build
.\scripts\beta-stabilization-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Routes to test manually:
- `/admin/beta-stabilization`
- `/api/v1/enterprise/beta-stabilization`
- `/api/v1/enterprise/beta-health`
- `/api/v1/enterprise/beta-route-audit`
- `/api/v1/enterprise/beta-release-checklist`
- `/taskuri`
- `/proiecte`
- `/api/v1/tasks`
- `/api/v1/projects`

## Next recommended build
v2.1.0 — DB Provider Wiring & Prisma Runtime Pack.

Goals:
- configure DB provider contract;
- add Prisma runtime health endpoint;
- define seed/rollback flow;
- keep mock provider fallback;
- do not enable production DB writes by default without feature flag.
