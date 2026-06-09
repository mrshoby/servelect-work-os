# SERVELECT WORK OS v6.4.10 — Real post-build audit correction

## Verdict pre-audit
v6.4.7 cannot be accepted as a verified post-build because `pnpm typecheck` failed on `project.risks` in `components/work-os/V64TaskuriFunctionalArea.tsx`.

Therefore no honest 1:1 screenshot audit can be claimed for v6.4.7 until the build compiles and the local app runs.

## Fix applied in v6.4.10
- Removed the invalid `project.risks` access.
- Replaced it with a derived risk count from actual project tasks:
  - `status === "Blocat"`
  - `priority === "Critic"`
  - `priority === "Urgent"`
- Kept the same visual design intent and KPI label `Riscuri deschise`.
- Added scripts that run QA before screenshots.
- Added local screenshot capture for the 10 Taskuri pages after a successful build.

## Routes to verify
1. `/taskuri/overview`
2. `/taskuri/my-work`
3. `/taskuri/tickets-notificari`
4. `/taskuri/proiecte-active`
5. `/taskuri/proiecte-viitoare`
6. `/taskuri/proiecte-finalizate`
7. `/taskuri/board`
8. `/taskuri/tabel`
9. `/taskuri/calendar-gantt`
10. `/taskuri/workload-aprobari`

## Required truth rule
The report is only valid after:
- `pnpm typecheck` PASS
- `pnpm lint` PASS
- `pnpm build` PASS
- local screenshots generated from the running app

If any of these fail, the build remains FAIL and must not be called final.
