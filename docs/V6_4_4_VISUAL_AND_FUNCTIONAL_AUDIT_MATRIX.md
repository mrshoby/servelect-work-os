# v6.4.4 — Visual + functional audit matrix

| Imagine | Pagină | Similaritate estimată | Structură 1:1? | Funcționalitate după fix | Observații |
|---|---|---:|---|---|---|
| 01_taskuri_overview.png | /taskuri, /taskuri/overview | 86% | Parțial DA | Task drawer, links, panels, workload, activity | Necesită reglaj pixel-level după screenshot real. |
| 02_taskuri_my_work.png | /taskuri/my-work | 85% | Parțial DA | filtre My Work, drawer, comments, quick create | Role-aware demo prin user curent. |
| 03_taskuri_tickets_notificari.png | /taskuri/tickets, /taskuri/tickets-notificari | 86% | Parțial DA | creare ticket, status, escaladare, notificări | SLA mock calculat din date seed. |
| 04_taskuri_proiecte_active.png | /taskuri/proiecte-active | 84% | Parțial DA | proiecte, urgent tasks, approvals, docs modal, chat mock | Progress încă demo din seed/taskuri. |
| 05_taskuri_proiecte_viitoare.png | /taskuri/proiecte-viitoare | 85% | Parțial DA | kickoff checklist, approvals, missing docs | Ready score demo. |
| 06_taskuri_proiecte_finalizate.png | /taskuri/proiecte-finalizate | 86% | Parțial DA | export modal, handover, reports, lessons | Export real PDF/CSV rămâne backend TODO. |
| 07_taskuri_board.png | /taskuri/board | 85% | Parțial DA | status move, add task, filters/saved view state | Drag-and-drop complet rămâne TODO. |
| 08_taskuri_tabel.png | /taskuri/tabel | 87% | Parțial DA | multi-select, bulk actions, density, grouping | Table grouping reparat în v6.4.4. |
| 09_taskuri_calendar_gantt.png | /taskuri/calendar, /taskuri/calendar-gantt | 81% | Parțial | calendar, gantt visual, filters, drawer | Gantt resize/drag real rămâne TODO. |
| 10_taskuri_workload_aprobari.png | /taskuri/workload, /taskuri/workload-aprobari | 86% | Parțial DA | approve/reject, heatmap, workload, alerts | Capacity planning încă demo. |

## Verdict

Gata pentru retestare: DA.
Gata 100% pixel-perfect: NU, până nu se face screenshot comparison real după deploy.
