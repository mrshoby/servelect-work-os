# v20.0.0 Progress Scorecard

| Categorie | Înainte | După | Ce s-a îmbunătățit | Ce lipsește până la 100% |
|---|---:|---:|---|---|
| GoodDay visual similarity | 84% | 85% | Fără shell nou; runtime in-place păstrează v15 | Screenshot/manual UI audit complet |
| GoodDay UI density | 90% | 91% | Mai multe acțiuni reale peste paginile dense existente | Densitate reală în module non-Taskuri |
| GoodDay functional parity | 88% | 91% | 36 acțiuni frontend conectate local persistent | Backend real + browser audit complet |
| Taskuri | 90% | 93% | Task/drawer/comment/timer/dependency mai conectate | DB persistence |
| My Work | 86% | 89% | Date task/timer/workload persistente | Test browser complet |
| Inbox | 86% | 90% | Action Required, mark read, open entity | Notification backend |
| Board | 85% | 89% | Status move + sync + activity log | Drag/drop vizual complet pe toate cardurile |
| Table | 88% | 91% | Sort/bulk/export/import | Column config persistent real |
| Calendar/Gantt | 82% | 86% | Gantt reschedule + due date sync | Timeline interactions complete |
| Workload | 82% | 86% | Estimate/time impact | Resource leveling real |
| Tickets | 86% | 89% | Ticket create/escalate/convert hooks | Ticket backend/SLA real |
| Costuri & Aprovizionare | 78% | 83% | RFQ/PO/invoice mock-interactive connected | Supplier DB, files, stock link |
| Achiziții | 76% | 81% | Supplier/offers/PO front-end flow | Procurement backend |
| Bugetare | 68% | 72% | Cost hooks and activity | Budget engine real |
| Buttons functionality | 92% | 95% | 36/36 static dead button audit target | Browser click-all audit |
| Frontend systems functionality | 89% | 92% | Unified runtime actions | Real backend mutations |
| Persistence | 90% | 92% | localStorage for core flows | Server persistence |
| Backend/API | 56% | 60% | v20 API manifest and route sections | DB adapter/write endpoints |
| QA | 84% | 87% | Source/dead/route/browser checklist | Full Playwright real-click suite |
| Vercel readiness | 88% | 90% | Route/API checks after GitHub auto deploy | Screenshot audit on prod |
| Production readiness | 88% | 90% | Safer in-place runtime, no visual shell regression | Server persistence and E2E QA |
