# SERVELECT WORK OS — NEXT BUILD PLAN

Current corrective line: v12.0.3 — Taskuri Route Binding Fix for Single Canonical Sidebar.

## Current status

- v12.0.0 attempted to remove the internal Taskuri workspace menu.
- v12.0.1 fixed the Next.js route export build contract.
- v12.0.2/v12.0.3 complete the v120 API root route and bind all `/taskuri/*` pages to `V120SingleSidebarTaskuriWorkspace`.
- The priority remains: only one global left sidebar; no internal `SERVELECT EMP / Taskuri Workspace / Canonical Work / Reports` menu.

## Quality rule

Do not proceed to v13 until Vercel confirms:
- `data-v120-single-canonical-sidebar = True`
- `Meniul intern a fost eliminat = True`
- `Work OS · Taskuri = False`
- `Workspace hierarchy = False`
- `Canonical Work = False`

## Next major build

v13.0.0 — Real Drag/Drop Board Persistence, Gantt Edit Engine, Provider Mutation Adapter & Browser Flow QA.

Only start v13 after single canonical sidebar is confirmed on Vercel.
