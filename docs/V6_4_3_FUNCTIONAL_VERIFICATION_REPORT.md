# v6.4.3 — Functional verification report

| Zonă | Funcțional? | Persistă? | Observații |
|---|---|---|---|
| Navigare Taskuri | Da | N/A | Sidebar are 11 subview-uri + aliasuri pentru rutele cerute. |
| Search global local | Da | Nu e nevoie | Filtrează taskuri/proiect/client/departament/tags. |
| Filtre Board/Tabel | Da | Parțial | Saved view persistă; filtrele active sunt state local. |
| Saved views | Da | Da | Se salvează în localStorage. |
| Task Detail Drawer | Da | Da | Editează task, status, assignee, comentarii, checklist, attachment mock. |
| Status change | Da | Da | Actualizează task și activity log. |
| Assignee change | Da | Da | Verifică v64CanAssignTask, actualizează department/assignee și notifică userul. |
| Comentarii | Da | Da | Se adaugă în task.comments + activityLog. |
| Checklist | Da | Da | Toggle done/undone. |
| Attachments mock | Da | Da | Adaugă document_mock.pdf în task.attachments. |
| Tickets | Da | Da | Create, update status, escalate. |
| Notifications | Da | Da | Mark read / mark all read + badge unread. |
| Board | Da | Da | Move prin status select / buton add task. DnD complet nu este implementat. |
| Tabel | Da | Da | Select/multiselect/bulk status/priority/assignee/delete/density. |
| Calendar & Gantt | Parțial | Da pentru task edits | Click task deschide drawer; mod view stateful; drag/resize nu există. |
| Workload & Aprobări | Da | Da | Approve/reject, heatmap calculată din estimate/tracked. |
| Proiecte viitoare checklist | Da | Da | toggleKickoff persistă în projects localStorage. |
| Export/handover/lessons | Mock funcțional | Nu modifică date business | Deschide modal de acțiune; backend real TODO. |
| RBAC | Parțial | N/A | v64CanViewTask/v64CanAssignTask există; role test real trebuie făcut în browser. |

## Flow-uri critice

| Flow | Status static-audit | Observații |
|---|---|---|
| Deschid `/taskuri/overview` | PASS pregătit | Alias `/taskuri/overview` adăugat. |
| Deschid task din Overview | PASS | TaskMiniTable/AlertList folosesc openTask. |
| Schimb status/assignee/comentariu | PASS | Drawer apelează store update/status/assign/comment. |
| Refresh persistă modificări | PASS pregătit | storageKey salvează tasks/tickets/projects/approvals/notifications/savedViews. |
| My Work pe user curent | PASS | filtrează assignee/owner/watchers pentru currentUser. |
| Tickets escaladare | PASS | escalateTicket schimbă status/prioritate/notificare. |
| Board move status | PASS | BoardColumn apelează changeTaskStatus. |
| Tabel bulk action | PASS | BulkActions apelează bulkUpdate/deleteTasks. |
| Calendar/Gantt click task | PASS | MonthCalendar/Gantt trimit openTask. |
| Workload approval approve/reject | PASS | decideApproval updatează status și notificare. |

## Limitări rămase

- Nu există backend real pentru export/raport/handover.
- Nu există DnD complet pe Board.
- Nu există resize/drag real pe Gantt.
- Nu există comparație pixel-perfect automată cu imaginile după deploy.
