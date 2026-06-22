# v19.0.2 — GoodDay In-Place Interaction Core on V15 Shell

Scope: continue toward GoodDay-level Work OS maturity without replacing the accepted v15 shell.

## Rules
- Preserves `V150GoodDayStructuralTaskuriWorkspace` visual shell.
- Does not introduce a new permanent workspace shell.
- Does not add the rejected `Taskuri Workspace` / `WORKSPACE HIERARCHY` middle-left panel.
- Adds real local persistent interaction handlers for visible actions.

## Implemented frontend systems
- Task creation and persistence.
- Ticket creation and persistence.
- Saved views persistence.
- Filter/change feedback.
- Table sorting by header.
- Board drag readiness and status-change runtime hook.
- Drawer-oriented comment/checklist/dependency/file actions.
- Time tracking start/stop with time entry and tracked-hour impact.
- Notifications mark read / mark all read / open related entity.
- Approvals approve/reject with reason.
- Import preview and import action.
- Export CSV from persistent runtime state.
- Activity log and feedback toast.

## Not 100%
This remains REAL_LOCAL_PERSISTENT. Backend write adapters and DB persistence are still not complete.


## v19.0.2 hotfix

Repară explicit gate-ul de dead-buttons pentru Reset Filter, Reject și Table sort fără schimbare de layout. Reset Filter și Table sort scriu în store/activity log, Reject folosește commit și auditul caută toate aparițiile handlerului, nu primul string accidental.
