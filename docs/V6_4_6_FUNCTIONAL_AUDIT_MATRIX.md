# v6.4.6 — Functional audit matrix

| Zonă | Funcționalitate verificată static | Status |
|---|---|---|
| Navigare Taskuri | rute principale + aliasuri overview/tickets-notificari/calendar-gantt/workload-aprobari | OK |
| Search topbar | setează `filters.query` și filtrează taskuri/proiecte/tags/departament | OK |
| Saved views | salvează în localStorage și reaplică filtrele custom | OK |
| Board | status dropdown pe card, add task pe coloană, click drawer | OK demo |
| Tabel | multi-select, bulk status, bulk priority, bulk assignee, delete | OK demo |
| Tabel setări | density + checkbox stateful `Fixează coloane` | REPARAT |
| Calendar filters | proiect/status/type/echipă sunt controlate și aplică filtre | REPARAT |
| Task drawer | editare titlu, descriere, status, prioritate, assignee, owner, deadline, estimare, comments, checklist, attachment mock | OK demo |
| Tickets | create, status update, escalation, linked task open | OK demo |
| Notifications | mark read / mark all read, badge unread | OK demo |
| Approvals | approve/reject, notification generated | OK demo |
| Kickoff checklist | toggle checklist project | OK demo |
| Persistență | localStorage key `servelect-work-os-v64-taskuri-state` | OK demo |
| RBAC | `v64CanViewTask` + `v64CanAssignTask` folosite pentru visibility/assign | OK demo |

Limitări rămase: backend real, DnD complet, Gantt drag/resize și screenshot pixel comparison după deploy.
