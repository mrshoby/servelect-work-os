# SERVELECT WORK OS v1.7.0 — Real Task CRUD & API-backed Store

## Scop

v1.7.0 introduce primul strat real de CRUD API pentru nucleul Work OS: taskuri și proiecte. Build-ul mută direcția aplicației din mock/localStorage-only spre contract API stabil, pregătit pentru PostgreSQL/Prisma în versiunile următoare.

## Ce adaugă

### Pagini
- `/admin/task-crud` — consolă enterprise pentru Task & Project CRUD.

### API-uri
- `GET /api/v1/tasks`
- `GET /api/v1/tasks?id=<taskId>`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks`
- `DELETE /api/v1/tasks?id=<taskId>` sau body `{ id }`
- `GET /api/v1/projects`
- `GET /api/v1/projects?id=<projectId>`
- `POST /api/v1/projects`
- `PATCH /api/v1/projects`
- `DELETE /api/v1/projects?id=<projectId>` sau body `{ id }`
- `GET /api/v1/enterprise/task-crud`
- `GET /api/v1/enterprise/task-crud-health`
- `GET /api/v1/enterprise/task-crud-schema`

### Fișiere
- `apps/web/lib/api-backed/task-project-api-store.ts`
- `apps/web/app/admin/task-crud/page.tsx`
- `apps/web/app/api/v1/tasks/route.ts`
- `apps/web/app/api/v1/projects/route.ts`
- `apps/web/app/api/v1/enterprise/task-crud/route.ts`
- `apps/web/app/api/v1/enterprise/task-crud-health/route.ts`
- `apps/web/app/api/v1/enterprise/task-crud-schema/route.ts`
- `scripts/task-crud-readiness-test.ps1`
- `docs/V17_REAL_TASK_CRUD_API_BACKED_STORE.md`
- `docs/AI_CONTINUATION_SERVELECT_WORK_OS.md`

## Observație importantă

Providerul este încă `mock-memory`, nu DB persistent. Totuși, contractul API este stabil și poate fi înlocuit în v1.8/v1.9 cu Prisma/PostgreSQL fără să schimbe forma endpoint-urilor.

## Ce trebuie făcut după v1.7

### v1.8.0 — API-backed UI Store Integration Pack
- pagina `/taskuri` să consume `/api/v1/tasks`;
- pagina `/proiecte` să consume `/api/v1/projects`;
- fallback localStorage doar când API-ul e indisponibil;
- create/update/delete din UI să folosească API-ul;
- optimistic update + rollback.

### v1.9.0 — PostgreSQL Task/Project Provider
- Prisma schema pentru `tasks`, `projects`, `subtasks`, `comments`, `activity_log`;
- provider DB real;
- seed/migration scripts;
- audit log persistent.

## Testare

După deploy:

```powershell
.\scripts\task-crud-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Rute manuale:

- `/admin/task-crud`
- `/api/v1/tasks`
- `/api/v1/projects`
- `/api/v1/enterprise/task-crud`
- `/api/v1/enterprise/task-crud-health`
- `/api/v1/enterprise/task-crud-schema`
