# NEXT_BUILD_PLAN — SERVELECT WORK OS

## Versiune curentă

v7.1.0 — Backend Mutation Adapter, Server Notifications & Multi-User Records

## Ce s-a făcut în buildul curent

- Adăugat strat `work-os-v71-backend-mutation-adapter.ts` pentru mutații controlate pe entitățile critice.
- Adăugat mod de lucru pe 4 nivele: `local_persistent`, `api_shadow`, `prisma_shadow_ready`, `prisma_primary_gated`.
- Adăugat audit event pentru fiecare mutație.
- Adăugat RBAC/department guard pentru mutații task.
- Adăugat mutații API pentru taskuri, tickete, notificări și health.
- Adăugat UI de control în `/work-os/backend-mutations` și `/admin/backend-mutations`.
- Integrat v7.1 în rute reale relevante: tickets, forms, timesheets, workload, workflows, custom fields.
- Actualizat versiune/manifest la v7.1.0.

## Scoruri procentuale

| Categorie | Procent actual | Procent înainte | Progres făcut | Ce lipsește până la 100% | Următorul pas obligatoriu |
|---|---:|---:|---|---|---|
| GoodDay public feature parity | 83% | 81% | Mutation adapter + notification model | API/webhooks, enterprise inheritance | Prisma shadow records |
| Task management core | 91% | 90% | Task mutation/audit/RBAC | DB concurrency | Persist through repository |
| Project hierarchy / portfolios | 70% | 70% | Neschimbat | tree DB + permissions inheritance | v7.3 hierarchy hardening |
| My Work / Inbox / Action Required | 82% | 81% | Notifications mutation support | server subscriptions | notification store |
| Task detail / drawer / comments / activity | 88% | 87% | audit mutation stream | full comment backend | activity DB |
| Tickets / Requests / Forms | 78% | 74% | Ticket/request mutations | portal client/storage | ticket queue |
| Notifications | 83% | 78% | mark read/create API | email/push/websocket | server notification table |
| Workflows / custom statuses / validations | 76% | 73% | workflow mutation shadow | full builder DB | workflow persistence |
| Custom fields / task types | 75% | 72% | custom field API shadow | migrations/field permissions | schema persistence |
| Saved views / filters / table views | 80% | 76% | saved view CRUD adapter | shared views server | saved view API |
| Board / Kanban | 82% | 82% | Neschimbat | drag/drop persistence | board persistence |
| Calendar / Gantt / Timeline | 72% | 72% | Neschimbat | scheduler/reschedule backend | timeline adapter |
| Workload / resource planning | 76% | 74% | recalculation after mutations | absences/allocations | capacity API |
| Time tracking / My Time / Timesheets | 76% | 72% | time/timesheet mutations | pontaj backend integration | timesheet API |
| Approvals | 77% | 72% | approve/reject mutation | policy engine | approval policy DB |
| Reports / dashboards / analytics | 68% | 66% | export tied to mutation snapshot | BI/PDF real | report store |
| Automations | 71% | 68% | audit + notifications on rule run | queue/cron/retry | automation worker |
| Documents / files / attachments | 45% | 45% | Neschimbat | R2/S3 storage | document adapter |
| CRM / client portal integration | 50% | 50% | Neschimbat | portal/auth/forms | client portal forms |
| HR / attendance / departments | 62% | 62% | Neschimbat | pontaj sync/leave | HR API |
| RBAC / permissions / access rules | 77% | 72% | mutation guard | centralized policy middleware | API policy layer |
| Backend / API / persistence | 58% | 48% | API shadow adapter | Prisma primary writes | Prisma shadow rollout |
| Screenshot audit coverage | 100% | 100% | Baseline preserved | v7.1 screenshots after deploy | run screenshot audit |
| QA/build stability | 74% | 72% | smoke script added | E2E click tests | browser mutation E2E |
| Production readiness | 62% | 55% | deployment/runtime mutation gates | DB/auth/storage/observability | Prisma shadow + notification store |

## Probleme rămase

- Primary DB writes nu sunt încă active.
- Notificările nu sunt încă livrate prin websocket/email/push.
- Attachments/files nu folosesc încă R2/S3.
- Automations nu rulează încă pe worker/queue server-side.
- Screenshot audit v7.1 trebuie rulat după deploy.

## Ce trebuie făcut în următorul build

v7.2.0 — Prisma Shadow Records, Rollback Evidence & Server Notification Store

1. Prisma shadow tables sau adapter pregătit pentru task/ticket/notification/audit/saved view.
2. Rollback evidence pentru mutațiile v7.1.
3. Server-side notification store.
4. API policy middleware comun.
5. Functional tests create/update/read after API mutation.

## Ce NU trebuie atins

- Nu redesign.
- Nu pagini demo separate.
- Nu module noi inutile.
- Nu trecere la mobile redesign.
- Nu activare Prisma primary fără gates/rollback.

## Rute afectate

- `/work-os/backend-mutations`
- `/admin/backend-mutations`
- `/api/v1/work-os/v71-mutations`
- `/api/v1/work-os/v71-mutations/health`
- `/api/v1/work-os/v71-mutations/tasks`
- `/api/v1/work-os/v71-mutations/tickets`
- `/api/v1/work-os/v71-mutations/notifications`
- `/taskuri/overview`
- `/taskuri/tickets-notificari`
- `/taskuri/forms`
- `/taskuri/timesheets`
- `/taskuri/workload-aprobari`

## Status QA

De rulat local după aplicare:

```powershell
pnpm typecheck
pnpm lint
pnpm build
.\scripts\work-os-v710-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Status screenshot audit

v7.0.2 are screenshot audit real 12/12 pe Vercel. v7.1.0 adaugă rute noi și trebuie screenshot audit extins după deploy.

## Status backend/persistence

v7.1.0 ridică backend/API/persistence de la 48% la 58%, dar rămâne shadow/gated, nu primary production DB.

## Status GitHub/Vercel

ChatGPT livrează ZIP. Utilizatorul aplică local, rulează QA, face `git add/commit/push`. Dacă GitHub este legat de Vercel, deploy-ul pornește automat.
