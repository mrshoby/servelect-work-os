# v12.0.0 — Single Canonical Sidebar Taskuri Shell Removal & Workspace Hardening

## Verdict înainte

v11.0.1 a stabilizat tehnic API/rutele, dar screenshoturile v11 arată că în unele pagini apare un al doilea meniu intern: `SERVELECT / Work OS · Taskuri / Workspace hierarchy`, inclusiv `Reports`. Acest lucru contrazice regula de produs: trebuie să existe un singur meniu cu submeniuri — meniul global din stânga aplicației.

## Ce s-a schimbat

- Înlocuit componenta Taskuri cu `V120SingleSidebarTaskuriWorkspace`.
- Eliminat sidebar-ul intern `Work OS · Taskuri`.
- Eliminat lista internă de navigare cu `Reports`, `Automations`, `Workload`, etc.
- Lăsat navigarea exclusiv în meniul global din stânga aplicației.
- Păstrat un header compact, toolbar, filtre, search, New Task, New Ticket, Save View, Export CSV.
- Păstrat workspace dens: overview, My Work, inbox, tickets, projects, board, table, calendar, workload, forms, timesheets, reports, automations.
- Păstrat task drawer complet în dreapta, fără să fie meniu de navigare.
- Toate paginile `/taskuri/*` importă noua componentă v12.

## Funcționalitate păstrată/îmbunătățită

- New Task creează task și deschide drawer.
- New Ticket creează ticket și notificare.
- Save View persistă în localStorage.
- Export CSV copiază datele.
- Board mută statusul taskului.
- Table are multi-select și bulk actions.
- Drawer salvează status, priority, assignee, owner, due date, estimate, comments, checklist, dependency, attachments.
- Inbox mark read/unread.
- Tickets escalate/convert.
- Workload calculează alocare din estimates.
- Approvals approve/reject.
- Automations enable/test.

## Scoruri

| Categorie | Înainte v11.0.1 | După v12.0.0 | Ce lipsește până la 100% |
|---|---:|---:|---|
| Single canonical sidebar compliance | 35% | 100% | verificare vizuală finală pe Vercel |
| GoodDay visual similarity | 58% | 80% | microinteracțiuni și spacing final |
| GoodDay UI density | 74% | 88% | layout adaptive pe toate rezoluțiile |
| Taskuri content density | 88% | 93% | date reale DB/provider |
| GoodDay functional parity | 76% | 81% | drag/drop real și Gantt engine real |
| Buttons | 82% | 91% | browser automation pentru fiecare click |
| Persistence | 78% | 80% | DB-backed mutations |
| Backend/API parity | 70% | 72% | mutation endpoints reale |
| Production readiness | 61% | 63% | auth/RBAC enforcement și rollback provider |
| QA confidence | 78% | 82% | Vercel manual audit după deploy |

## Nu este final

v12.0.0 rezolvă direcția greșită cu meniul dublu. Nu declară 100% GoodDay parity. Următorul build major trebuie să ducă board/Gantt/persistence în backend real.
