# v21.0.0 — Remove Duplicate Taskuri Shell and Enforce GoodDay Functional UI Parity

## Ce repară

- Elimină stack-ul paralel V150/V200/V210 din rutele Taskuri.
- Înlocuiește toate rutele reale `/taskuri/*` cu o singură componentă de conținut: `TaskuriUnifiedV21Workspace`.
- Păstrează shell-ul global SERVELECT (`AppShell`, sidebar, topbar) și nu creează wrapper/shell nou.
- Creează `apps/web/lib/work-os/taskuri-action-registry.ts` ca sursă unică pentru acțiuni.
- New Task, New Ticket și New Request folosesc același modal controlat, fără overlay duplicat.
- Task drawer final este `TaskDrawer` existent, nu drawer paralel runtime.
- `/taskuri/goodday-parity` redirecționează către `/taskuri`.

## Acțiuni conectate

New Task, New Ticket, New Request, Save View, Filter, Export, Bulk Actions, Open Drawer, Add Comment, Start Timer, Stop Timer, Approve, Reject, Mark Read, Escalate, Convert to Task.

## QA obligatoriu după aplicare

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scriptsudit-taskuri-v21-duplicates.ps1
```

Dacă live încă afișează `v20 GoodDay runtime · Command Center`, buildul este FAIL.
