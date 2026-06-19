# v17.0.0 — GoodDay Functional Parity Layer on V15 UI Baseline

## Reguli respectate

- Baseline vizual: `taskuri-ui-v15-goodday-baseline-restored` / `91c4036`.
- Nu folosește `V160RealProviderMutationTaskuriWorkspace` ca shell UI principal.
- Nu copiază logo/brand/texte/imagini/assets GoodDay.
- Folosește doar pattern-uri structurale publice: workspace hierarchy, views, My Work, Action Required, Board, Table, Calendar, Gantt, Workload, resource planning, comments/activity/files.

## Implementat real în frontend

- Store unic `REAL_LOCAL_PERSISTENT` în localStorage.
- Taskuri conectate între Table, Board, My Work, Calendar/Gantt, Workload și Drawer.
- New Task creează task și persistă.
- New Ticket creează ticket, notificare și persistă.
- Saved View persistă filtre/query/densitate.
- Filters schimbă datele afișate și pot fi resetate.
- Board mută taskuri și schimbă status.
- Bulk action mută selecțiile în Review.
- Drawer salvează title/status/assignee/due/estimate.
- Comments cresc count și scriu activity log.
- Checklist/dependency/attachment mock schimbă state.
- Timer start/stop creează time entry și actualizează tracked time.
- Notifications mark read/all read actualizează badge.
- Approvals approve/reject schimbă status și scriu activity.
- Import mock detectează/mapare/preview/import ca flux demonstrabil interactiv.
- Export generează CSV.

## QA inclus

- `scripts/audit-v1700-source.mjs`
- `scripts/audit-v1700-dead-buttons.mjs`
- `scripts/audit-v1700-browser-functional-flow.mjs`
- `scripts/work-os-v1700-functional-test.ps1`
- `docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md`
- `docs/V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT.md`
- `docs/V17_0_0_PROGRESS_SCORECARD.md`

## Nu este declarat 100%

Persistența este locală, nu backend real. Importul este mock-interactive. Costuri/Aprovizionare/Achiziții/Bugetare sunt inițiate, dar nu complete 100%.
