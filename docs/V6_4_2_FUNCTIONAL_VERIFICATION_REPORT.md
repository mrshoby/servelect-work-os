# v6.4.2 — Functional verification report for Taskuri

| Pagina | Este statică? | Filtre funcționale? | Butoane funcționale? | Datele se modifică? | Persistă după refresh? | Probleme / observații |
|---|---:|---:|---:|---:|---:|---|
| Taskuri / Overview | Nu | Da, prin filtre globale/search | Da: task open, links, create | Da | Da, localStorage | Layout trebuie verificat vizual după build |
| Taskuri / My Work | Nu | Da: taburi personalizate/search | Da: task drawer, quick create | Da | Da | Filtrarea depinde de userul demo curent |
| Tickets & Notificări | Nu | Da: status/SLA/priority | Da: update status, escalate, read | Da | Da | SLA este mock calculat din seed data |
| Proiecte active | Nu | Da | Da: deschide task/proiect/chat mock | Da parțial | Da | Progress calculat din taskuri mock |
| Proiecte viitoare | Nu | Da | Da: kickoff checklist, task generate mock | Da | Da | Dependency flow este vizual mock |
| Proiecte finalizate | Nu | Da | Da: export/handover/lessons modal mock | Da parțial | Da | Exportul este mock, pregătit pentru backend |
| Board | Nu | Da | Da: move status, add task, open drawer | Da | Da | Drag-and-drop real nu este inclus; status dropdown/mutare este fallback funcțional |
| Tabel | Nu | Da | Da: bulk status/priority/assignee/delete | Da | Da | Column visibility avansat este simplificat |
| Calendar & Gantt | Nu | Da | Da: click task, open drawer, edit dates | Da | Da | Gantt nu are drag resize, dar se actualizează prin drawer |
| Workload & Aprobări | Nu | Da | Da: approve/reject, open task | Da | Da | Workload pe mock estimates/tracked |

## Flow-uri principale acoperite de cod

| Flow | Status așteptat după build | Observații |
|---|---:|---|
| Open `/taskuri` | PASS | Ruta redă `V64TaskuriFunctionalArea` view overview |
| Open task drawer | PASS | Orice task list/card/table deschide drawer |
| Change status | PASS | Update în state + activity log + notification |
| Change assignee | PASS | Validare RBAC `v64CanAssignTask` + update + notification |
| Add comment | PASS | Comment + activity log persistă localStorage |
| Refresh persistence | PASS | Store salvat în `servelect-work-os-v64-taskuri-functional-state` |
| Board move status | PASS | Fallback prin status/move; nu drag-drop real |
| Table bulk action | PASS | Multi-select + bulk update/delete |
| Ticket escalate | PASS | Status/prioritate/SLA + notification |
| Approval decision | PASS | Approve/reject + activity area |

## Entități / persistență

| Entitate | Creez? | Editez? | Șterg? | Persistă? | Backend ready? | Observații |
|---|---:|---:|---:|---:|---:|---|
| Taskuri | Da | Da | Da | Da localStorage | Da, prin adapter/API mock | Principalul model funcțional |
| Tickets | Da/mock | Da | Nu complet | Da localStorage | Da | Escalare/status funcționale |
| Notificări | Da automat | Read/unread | Nu complet | Da | Da | Bell/topbar depinde de shell |
| Comentarii | Da | Nu complet | Nu | Da | Da | Prin drawer |
| Checklist | Da toggle | Da | Nu complet | Da | Da | Per task/proiect kickoff |
| Attachments mock | Da mock | Nu | Nu | Da | Da | Fără upload real |
| Approvals | Nu direct | Approve/reject | Nu | Da | Da | Decision status persistă |
| Saved views | Da | Select | Nu complet | Da | Da | LocalStorage |
| Calendar events | Vizual | Prin task date | Nu | Da | Da | Legat de taskuri |
| Workload | Calculat | Prin task estimate | Nu | Da | Da | Derivat din taskuri |
