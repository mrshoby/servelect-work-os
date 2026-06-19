# v14.0.0 — GoodDay Route-Specific Taskuri Content Parity

## Why this build exists

v13.0.0 successfully unified the Taskuri route shell and removed the duplicate inner menu. However, many Taskuri subpages still looked like the same enterprise table/list. This build fixes that product-level issue: every Taskuri submenu must render content appropriate to its purpose, similar to GoodDay-style work views.

## Non-negotiable rule

Taskuri uses one navigation system only: the global left sidebar. No internal Taskuri/Work OS/Workspace menu is allowed inside page content.

## What changed

- Added `V140GoodDayRouteSpecificTaskuriWorkspace`.
- All `apps/web/app/taskuri/**/page.tsx` pages are rewritten by the apply script to bind to V140.
- Route-specific content families are implemented:
  - dashboard
  - my work
  - inbox / updates
  - tickets / requests
  - board / Kanban
  - table
  - calendar
  - Gantt / timeline / dependencies
  - workload / capacity
  - reports / analytics
  - automations / workflow
  - forms / intake
  - timesheets / My Time
  - projects / hierarchy / portfolio
  - files / evidence
  - provider / mutation queue
  - approvals / SLA / decisions
- Adds v14 API routes under `/api/v1/work-os/v140-goodday-route-specific-taskuri`.
- Adds screenshot ZIP generator under `scripts/audit-v1400-screenshots-manual.mjs`.

## Progress before vs after

| Category | Before v14 | After v14 target | Notes |
|---|---:|---:|---|
| Single canonical sidebar | 100% | 100% | must remain unchanged |
| GoodDay visual similarity | 82% | 84% | route-specific layouts improve parity |
| GoodDay UI density | 90% | 91% | more varied and purpose-built content |
| Taskuri route-specific content | 55% | 88% | main improvement |
| Functional parity | 84% | 86% | more actions in page context |
| Buttons | 93% | 94% | actions remain local/persistent |
| Persistence | 82% | 84% | localStorage retained across route-specific views |
| QA confidence | 80% | 84% | screenshots ZIP and source audit expanded |
| Production readiness | 65% | 67% | DB/provider write still gated |

## Still missing to 100%

- True database/provider mutation adapter for task fields.
- Browser click QA with actual DnD and form interactions, not just source markers.
- Gantt dependency auto-reschedule engine.
- RBAC runtime proof per department/role on live data.
- Audit ledger and rollback gates for production writes.
- Final pixel-level visual polish after real screenshots.

## QA expectations

- `pnpm typecheck`
- `pnpm build`
- `node scripts/audit-v1400-goodday-route-specific-source.mjs`
- `node scripts/audit-v1400-browser-flow.mjs`
- `scripts/work-os-v1400-functional-test.ps1`
- `node scripts/audit-v1400-screenshots-manual.mjs`

## Final acceptance

Do not accept v14 if:

- any Taskuri route still shows the old internal workspace menu;
- every route still looks like the same generic table/list;
- route/API passes but screenshot/manual audit fails;
- buttons exist only visually without handlers.
