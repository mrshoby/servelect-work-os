# v9.1.0 — GoodDay-like Task Execution Parity Layer

Build major după v9.0.4. Acest update pornește din `docs/NEXT_BUILD_PLAN.md` la aplicare și continuă strict direcția validată: `Taskuri` este fluxul canonic, fără shell Work OS paralel și fără demo separat.

## Ce adaugă

- Workspace Command Center sub `/taskuri/workspace-command`.
- Action Required Board sub `/taskuri/action-board`.
- Project/folder/task hierarchy sub `/taskuri/hierarchy-map-v91`.
- Task detail drawer parity sub `/taskuri/task-detail-v91`.
- Workload planner sub `/taskuri/workload-planner-v91`.
- Time tracking/timesheet view sub `/taskuri/time-tracking-v91`.
- Updates stream sub `/taskuri/updates-stream-v91`.
- Request intake convertibil în task sub `/taskuri/request-intake-v91`.
- Admin governance sub `/admin/taskuri-workspace-governance`.
- API v9.1 sub `/api/v1/work-os/v91-goodday-task-execution`.

Production writes rămân `pilot_only` / gated. Nu se activează global writes.

## QA țintă

- `pnpm typecheck` PASS
- `pnpm lint` PASS
- `pnpm build` PASS
- `work-os-v910-functional-test.ps1`: 15 / 15 PASS
- `audit-v910-screenshots.mjs`: 10 / 10 PASS
- `audit-v910-goodday-task-execution-source.mjs`: PASS
