# SERVELECT WORK OS v1.6.0 — Task & Project Persistence Pack

## Scop

v1.6.0 definește fundația de persistență pentru nucleul Work OS: proiecte, taskuri, subtaskuri, comentarii, atașamente, time entries, activity log și approvals.

Acest build nu activează încă scrierea reală în PostgreSQL pentru taskuri/proiecte. În schimb, pregătește contractele, schema țintă, planul de migrare și endpoint-urile de readiness pentru următorul build major: v1.7.0 Real Task CRUD & API-backed Store.

## Rute adăugate

- `/admin/task-projects`
- `/api/v1/enterprise/task-project-persistence`
- `/api/v1/enterprise/task-project-health`
- `/api/v1/enterprise/task-project-schema`
- `/api/v1/enterprise/task-project-migration-plan`

## Fișiere adăugate

- `apps/web/lib/enterprise/task-project-persistence.ts`
- `apps/web/app/admin/task-projects/page.tsx`
- `apps/web/app/api/v1/enterprise/task-project-persistence/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-health/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-schema/route.ts`
- `apps/web/app/api/v1/enterprise/task-project-migration-plan/route.ts`
- `scripts/task-project-readiness-test.ps1`
- `docs/V16_TASK_PROJECT_PERSISTENCE_PACK.md`
- `docs/AI_CONTINUATION_SERVELECT_WORK_OS.md`

## Ce definește v1.6

- Contracte API pentru projects/tasks/subtasks/comments/time entries.
- Tabele țintă PostgreSQL pentru WorkGraph.
- Metode repository necesare pentru provider `mock | prisma`.
- Plan de migrare incrementală fără a strica demo-ul public.
- Guardrails pentru workspace_id, audit events, soft delete și RBAC server-side.

## Fixuri păstrate din build-urile anterioare

Scriptul de aplicare recomandat păstrează fixurile pentru:

- `Sidebar mobile` prop în `AppShell.tsx`.
- `generatedAt` și `manifestWithoutGeneratedAt` în performance audit route.
- `db-ready` cleanup în fișierele TypeScript/TSX.
- `localStorage` key bump la `servelect-work-os-store-v16`.

## Validare după deploy

```powershell
.\scripts\task-project-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Rute de test manual:

- `https://servelect-work-os-web.vercel.app/admin/task-projects`
- `https://servelect-work-os-web.vercel.app/api/v1/enterprise/task-project-persistence`
- `https://servelect-work-os-web.vercel.app/api/v1/enterprise/task-project-health`
- `https://servelect-work-os-web.vercel.app/api/v1/enterprise/task-project-schema`
- `https://servelect-work-os-web.vercel.app/api/v1/enterprise/task-project-migration-plan`

## Următorul build recomandat

**v1.7.0 — Real Task CRUD & API-backed Store**

Focus:

- Route handlers reale pentru tasks/projects CRUD.
- Provider switch `WORKOS_DATA_PROVIDER=mock|prisma`.
- Citire taskuri/proiecte prin API-backed store.
- Status update prin API cu optimistic UI.
- Audit events pentru task create/update/status/timer.
