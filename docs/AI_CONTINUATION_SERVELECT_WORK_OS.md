# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Context proiect

Proiectul este `SERVELECT WORK OS / SERVELECT EMP`, o platformă Work OS task-first pentru Servelect: project management, task management, Kanban, list/table, Gantt/timeline, calendar, workload, timesheet, documente, approvals, rapoarte, workflow-uri, roluri/permisiuni, plus module operaționale pentru energie/IoT, echipamente, mentenanță, CRM, finanțări/ESG și HR.

Repo GitHub: `https://github.com/mrshoby/servelect-work-os`
Vercel: `https://servelect-work-os-web.vercel.app`
Folder local folosit: `D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`

## Reguli de lucru stabilite

- Versiunile trebuie să fie build-uri majore `v1.X.0`, nu doar `v1.0.X`, când se adaugă funcționalități importante.
- Pentru patch-uri se livrează ZIP cu fișierele schimbate + comandă PowerShell completă.
- Documentul acesta trebuie actualizat la fiecare build, ca alt chat/AI să continue fără pierdere de context.
- Interfața vizuală trebuie păstrată, dar optimizată pentru performanță.
- Orice eroare Vercel trebuie reparată cu build local înainte de commit/push.

## Istoric relevant

- v1.1 — Enterprise Operations Release.
- v1.2 — Enterprise Data Foundation.
- v1.3 — Database Activation Pack.
- v1.4 — WorkGraph Persistence Core.
- v1.5 — Auth & RBAC Production Pack.
- v1.6 — Task & Project Persistence Pack.
- v1.7 — Real Task CRUD & API-backed Store.

## Erori reparate anterior

- `PageHeader actions` invalid; PageHeader folosește children.
- `Topbar` search overlap; eliminate textele SERVELECT WORK OS / Live / Demo auth din topbar.
- `/taskuri` freeze; optimizare prin randare doar a view-ului activ.
- `repository.dashboard().catch` când dashboard nu era Promise.
- `approvalRequests` export inexistent; corect la `approvals`.
- `generatedAt` dublat în performance audit route.
- `manifestWithoutGeneratedAt` lipsă.
- `Sidebar mobile` prop invalid.
- `db-ready` status inconsistency; normalizat la `ready`.
- `task-project-health` avea `ok` dublat; ruta trebuie să returneze direct health payload.

## Stadiu la v1.7.0

v1.7.0 introduce API CRUD pentru taskuri și proiecte:

- `GET/POST/PATCH/DELETE /api/v1/tasks`
- `GET/POST/PATCH/DELETE /api/v1/projects`
- `/admin/task-crud`
- `/api/v1/enterprise/task-crud`
- `/api/v1/enterprise/task-crud-health`
- `/api/v1/enterprise/task-crud-schema`

Providerul este `mock-memory`, deci nu este încă DB persistent, dar este API-backed și pregătit pentru înlocuire cu Prisma/PostgreSQL.

## Ce trebuie făcut în continuare

### v1.8.0 — API-backed UI Store Integration Pack

1. `/taskuri` să citească taskurile prin `/api/v1/tasks`.
2. Create task din UI să folosească `POST /api/v1/tasks`.
3. Update status din Kanban/tabel să folosească `PATCH /api/v1/tasks`.
4. Delete task să folosească `DELETE /api/v1/tasks`.
5. `/proiecte` să citească proiectele prin `/api/v1/projects`.
6. Fallback localStorage doar când API-ul pică.
7. Optimistic UI + rollback.

### v1.9.0 — PostgreSQL Task/Project Provider

1. Prisma schema pentru task/project/subtask/comment/activity log.
2. Provider DB real în loc de mock-memory.
3. Seed script.
4. Audit log persistent.
5. Vercel env pentru DATABASE_URL.

## Validare după v1.7

Rulează:

```powershell
pnpm --filter @servelect/web build
```

După deploy:

```powershell
.\scripts\task-crud-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Testează:

- `/admin/task-crud`
- `/api/v1/tasks`
- `/api/v1/projects`
- `/api/v1/enterprise/task-crud`
- `/api/v1/enterprise/task-crud-health`
- `/api/v1/enterprise/task-crud-schema`
