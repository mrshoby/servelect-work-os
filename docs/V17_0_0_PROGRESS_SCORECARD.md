# v17.0.0 Progress Scorecard — GoodDay Functional Parity on V15 UI Baseline

Baseline restored: `taskuri-ui-v15-goodday-baseline-restored` / `91c4036`.

| Categorie | Înainte | După | Ce s-a îmbunătățit | Ce lipsește până la 100% |
|---|---:|---:|---|---|
| GoodDay visual similarity | 78% | 84% | Păstrează structura vizuală v15 și adaugă zone de lucru funcționale dense. | Audit manual comparativ pe screenshots pentru toate rutele. |
| GoodDay UI density | 82% | 90% | Table, board, drawer, filters, inbox, workload, right panel, activity. | Mai multă ierarhie multi-level pe toate departamentele. |
| GoodDay functional parity | 45% | 78% | Store local persistent, view-uri conectate, handlers, flow test. | Backend real, imports reale cu fișier, drag/drop avansat, permissions server-side. |
| Taskuri | 55% | 82% | New Task, drawer, comments, checklist, dependency, timer, persistence. | Recurențe, subtasks avansate, SLA-uri native. |
| My Work | 52% | 75% | Folosește același store și filtre reale. | Inbox priority scoring și daily planning complet. |
| Inbox | 45% | 76% | Mark read/all read, open entity, badge updates. | Email-like grouping și snooze real. |
| Board | 50% | 80% | Click move + HTML5 drag/drop + counts conectate. | Drag/drop test automat complet între coloane. |
| Table | 54% | 82% | Bulk select, status actions, filters, export. | Sorting multi-column și column manager complet. |
| Calendar/Gantt | 42% | 72% | Due date edits conectate cu task store. | Critical path, baselines, dependencies graph real. |
| Workload | 38% | 72% | Capacity bars, assign changes, tracked time connection. | Calendar capacity per day și holidays. |
| Tickets | 46% | 78% | Ticket create, escalate, convert to task, notifications. | SLA timers, ticket queues, customer portal. |
| Costuri & Aprovizionare | 20% | 45% | Workflow UI interactiv și mock import. | Flux complet oferte/furnizori/facturi cu store dedicat. |
| Achiziții | 22% | 42% | Inclus în Costuri flow ca mock-interactive. | PO real, supplier comparison, approvals. |
| Bugetare | 20% | 38% | Raportare și cost flow inițial. | Budget lines, variance, invoice linking. |
| Buttons functionality | 52% | 82% | Source audit + browser flow pentru butoane principale. | Audit pe fiecare icon/dropdown/row action din toate modulele. |
| Frontend systems functionality | 44% | 76% | 20+ sisteme legate de același store local. | Backend/API real și module non-Taskuri complete. |
| Persistence | 35% | 80% | localStorage store pentru tasks/tickets/views/comments/timers. | Sync server-side și conflict resolution. |
| Backend/API | 30% | 45% | API contract v17 marker + mode. | Prisma/DB real pentru mutații. |
| QA | 40% | 72% | Source, dead buttons, browser functional flow, route/API. | Screenshot audit manual nou și click exhaustiv 100%. |
| Vercel readiness | 75% | 82% | Script deploy curat + route test. | Verificare screenshot cu bypass după deploy. |
| Production readiness | 70% | 82% | Deploy gate și audits obligatorii. | Rollout control, telemetry, monitoring real. |

Nu se declară 100%. Următorul build major trebuie să continue din aceste gap-uri, nu să schimbe UI-ul de bază.
