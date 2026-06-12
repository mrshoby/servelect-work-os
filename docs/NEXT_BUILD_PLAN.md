# NEXT_BUILD_PLAN — SERVELECT WORK OS

## Versiune curentă
v7.2.3 — Prisma Shadow Records, Rollback Evidence & Server Notification Store

## Build anterior
v7.1.1 — Backend Mutation Adapter, Server Notifications & Multi-User Records

## Ce s-a făcut în v7.2.3
- Fix de continuitate: textul v7.1.0/v7.1.1 este aliniat la v7.2.3 în release/version/manifest.
- Adăugat model de Prisma shadow records pentru mutații Task/Ticket/Request/Notification/Approval/Saved View/Workflow/Custom Field/Time Entry/Timesheet/Automation.
- Adăugat rollback evidence pentru fiecare mutație shadow.
- Adăugat server notification store pregătit pentru delivery queue.
- Adăugate API routes v7.2 pentru health, mutations, rollback și notifications.
- Adăugate pagini reale: /work-os/prisma-shadow-records și /admin/prisma-shadow-records.
- Rutele reale Taskuri critice folosesc clientul v7.2 pentru mutații/shadow evidence.

## Scoruri procentuale curente
| Categorie | Procent actual | Procent înainte | Progres făcut în build | Ce lipsește până la 100% | Următorul pas obligatoriu |
|---|---:|---:|---|---|---|
| GoodDay public feature parity | 84% | 83% | shadow records + rollback + notification store | backend primary, enterprise rules | v7.3 schema/migrations |
| Task management core | 92% | 91% | task mutations emit shadow records | conflict/versioning multi-user | optimistic versioning |
| Tickets / Requests / Forms | 81% | 78% | ticket/request shadow writes | client portal, real attachments | portal/storage |
| Notifications | 87% | 83% | server notification store | websocket/email/push | delivery queue |
| Workflows / validations | 79% | 76% | workflow domain in shadow | server rule engine | transition enforcement |
| Custom fields / task types | 78% | 75% | custom field shadow domain | field permissions/migrations | schema-backed config |
| Saved views / filters | 82% | 80% | saved views in shadow path | shared ownership backend | server saved views |
| Time tracking / timesheets | 79% | 76% | time/timesheet shadow evidence | pontaj payroll sync | timesheet API writes |
| Backend / API / persistence | 66% | 58% | Prisma shadow readiness + rollback evidence | real Prisma tables/writes | migration + seed |
| Production readiness | 68% | 62% | rollback and notification evidence | backup/observability/primary gates | controlled primary pilot |

## Probleme rămase
- Prisma primary writes sunt încă gated.
- Nu există încă migrare Prisma reală pentru shadow_records/rollback_evidence/server_notifications.
- Server notifications sunt store/API-ready, dar nu au WebSocket/email/push.
- Attachments rămân mock până la storage real.
- Screenshot audit v7.2 trebuie rulat după deploy.

## Următorul build recomandat
v7.3.0 — Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue

## Scope obligatoriu v7.3.0
1. Prisma schema pentru shadow records, rollback evidence, server notifications și mutation audit.
2. Repository adapter care poate scrie în Prisma shadow dacă DATABASE_URL este configurat.
3. Delivery queue pentru notificări server-side.
4. Rollback dry-run + restore previous snapshot la nivel de record.
5. Teste create/update/rollback/read-after-refresh.
6. Screenshot audit extins.

## Ce NU trebuie făcut
- Nu redesign.
- Nu pagini demo separate.
- Nu module noi inutile.
- Nu activare Prisma primary fără gates, backup și rollback evidence.

## Rute afectate
- /work-os/prisma-shadow-records
- /admin/prisma-shadow-records
- /api/v1/work-os/v72-shadow-records
- /taskuri/overview
- /taskuri/tickets-notificari
- /taskuri/forms
- /taskuri/timesheets
- /taskuri/workload-aprobari
- /taskuri/automations
- /taskuri/reports

## Status QA
De rulat după aplicare: pnpm typecheck, pnpm lint, pnpm build, scripts/work-os-v720-functional-test.ps1.

## Status screenshot audit
De rulat după deploy: node scripts/audit-v720-screenshots.mjs cu BASE_URL pe Vercel.

## Status backend/persistence
Shadow-ready. Primary writes gated.

## Status GitHub/Vercel
Commit/push trebuie făcut local după QA. Vercel se actualizează din GitHub.

