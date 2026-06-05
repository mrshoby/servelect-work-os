# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Versiune curentă recomandată

v1.4.0 — Enterprise WorkGraph Persistence Core

## Context proiect

SERVELECT WORK OS / SERVELECT EMP este o platformă web tip Work OS pentru Servelect, inspirată de GoodDay, ClickUp, Linear, Asana Enterprise și Monday.com, dar adaptată pentru energie/fotovoltaice. Aplicația trebuie să fie task-first: proiecte, taskuri, subtaskuri, Kanban, list/table, Gantt/timeline, calendar, workload, timesheet, documente, chat/updates, approvals, rapoarte, workflow-uri custom, roluri și permisiuni.

Modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR trebuie integrate în același sistem de proiecte/taskuri, nu aplicații separate.

## Repo și deploy

- GitHub: `https://github.com/mrshoby/servelect-work-os`
- Vercel live: `https://servelect-work-os-web.vercel.app`
- Folder local folosit frecvent:
  `D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`

## Stack curent

- Monorepo pnpm
- Next.js 15 App Router
- React 19
- TypeScript strict
- Tailwind CSS
- Zustand/localStorage pentru MVP
- Mock data în `packages/shared`
- Route handlers în `apps/web/app/api/v1/...`
- Expo mobile schelet, nu complet production

## Istoric relevant

- v0.7: protected app + user management demo.
- v0.8: system/governance core.
- v0.9: action center + audit automation.
- v1.0: enterprise release baseline.
- v1.1: enterprise operations release.
- v1.2: data foundation release.
- v1.3: database activation pack.
- v1.4: WorkGraph persistence core.

## Probleme apărute și fixuri

1. `/taskuri` se bloca în browser.
   - Fix: randare doar view activ, tabel/board light, limitare taskuri afișate, schimbare localStorage key.

2. Topbar search era suprapus cu texte `SERVELECT WORK OS / Live / Demo auth`.
   - Fix: topbar simplificat, search curat, fără texte peste input.

3. `PageHeader actions` nu exista.
   - Fix: folosire children sau rescriere page.

4. `generatedAt` duplicat în `/api/v1/performance/audit`.
   - Fix: lăsat manifestul să furnizeze generatedAt; eliminat `manifestWithoutGeneratedAt` lipsă.

5. `Sidebar mobile` prop invalid.
   - Fix: eliminat prop-ul `mobile` din `AppShell.tsx`.

6. `db-ready` nu era în type `DatabaseActivationStatus` și apoi nu era în `statusTone`.
   - Fix: adăugat `db-ready` în type și mapping.

## Stadiu aplicație web

Aplicația web este un MVP enterprise avansat. Are module pentru dashboard, proiecte, taskuri, CRM, IoT, echipamente, mentenanță, finanțări/ESG, HR/Admin, performance audit, enterprise release, data foundation, database activation și workgraph.

Încă nu este fully production real DB-backed. Multe module sunt încă mock/API manifest/localStorage.

## Stadiu aplicație mobilă

Mobile este încă schelet Expo / concept. Nu este încă aplicație mobilă completă production.

## Ce aduce v1.4

- `/admin/workgraph`
- `/api/v1/enterprise/workgraph`
- `/api/v1/enterprise/workgraph-health`
- `/api/v1/enterprise/workgraph-migration-plan`
- `apps/web/lib/enterprise/workgraph-persistence.ts`
- `scripts/workgraph-readiness-test.ps1`
- documentație `docs/V14_WORKGRAPH_PERSISTENCE_CORE.md`

## Următorul build recomandat

v1.5.0 — Auth & RBAC Production Pack

Obiective:

- Auth.js / Microsoft login real.
- User sessions persistente.
- users + memberships + roles + permissions persistente.
- route guards server-side.
- RBAC enforcement în UI.
- audit event pentru login/logout/impersonate/admin changes.

## Rute de testat după deploy v1.4

- `/admin/workgraph`
- `/api/v1/enterprise/workgraph`
- `/api/v1/enterprise/workgraph-health`
- `/api/v1/enterprise/workgraph-migration-plan`
- `/admin/database`
- `/taskuri`
- `/enterprise`

## Comenzi utile

```powershell
pnpm --filter @servelect/web build
.\scripts\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
.\scripts\database-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
.\scripts\workgraph-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```
