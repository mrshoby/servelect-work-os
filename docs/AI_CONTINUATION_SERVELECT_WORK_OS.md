# SERVELECT WORK OS / SERVELECT EMP — AI Continuation Context

Acest fișier este documentul principal de continuitate. Dacă proiectul trebuie continuat într-un alt chat sau de un alt AI, se pornește de aici.

## Proiect

- Repo GitHub: `https://github.com/mrshoby/servelect-work-os`
- Deploy Vercel: `https://servelect-work-os-web.vercel.app`
- Folder local folosit până acum: `D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`
- Aplicație: `SERVELECT WORK OS / SERVELECT EMP`
- Tip produs: Work OS enterprise task-first pentru proiecte, taskuri, operațiuni energetice, CRM, IoT, logistică, mentenanță, finanțări, ESG, HR și administrare.

## Principiu critic

Aplicația nu trebuie transformată într-un simplu dashboard de energie sau stocuri. Toate modulele trebuie să fie integrate în același sistem de proiecte + taskuri + acțiuni + audit:

- proiecte
- taskuri
- subtaskuri
- Kanban
- task table
- Gantt/timeline
- calendar
- workload/resource planning
- timesheet
- documente
- chat/updates
- approvals
- rapoarte
- workflow-uri custom
- roluri și permisiuni

Modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR sunt module operaționale legate de proiecte/taskuri, nu aplicații separate.

## Versiuni livrate până acum

### v0.7

Protected App + User Management.

A inclus:

- protected app mode
- middleware
- `/unauthorized`
- `/admin/users`
- user detail/patch demo
- auth/RBAC foundation
- Next.js 15 route fix

### v0.8

Persistence Governance Core.

A inclus:

- `/admin/system`
- `/workflows`
- system status/readiness API
- workflow templates/run API
- governance capability map

### v0.9

Action Center & Audit Automation.

A inclus:

- `/action-center`
- `/admin/audit`
- `/api/v1/action-center`
- `/api/v1/audit/events`
- workflow executions
- audit event simulation

Fix cunoscut: `approvalRequests` trebuia înlocuit cu `approvals` din `@servelect/shared`.

### v1.0

Enterprise Release Baseline.

A inclus:

- `/admin/release`
- release manifest/checklist API
- v1 release readiness
- release console

### v1.0.1 / v1.0.2

Performance hotfix pentru `/taskuri` și topbar.

Probleme rezolvate / de urmărit:

- `/taskuri` se bloca în browser cu `this page isn't responding`.
- cauza probabilă: randare simultană a multor componente grele și state vechi în localStorage.
- topbar avea textul `SERVELECT WORK OS / Live / Demo auth` peste search.
- `PageHeader` nu acceptă `actions`; trebuie folosit `children` între tag-uri.

### v1.1 — Enterprise Operations Release

Această versiune este primul release major după v1.0, nu un micro-patch.

A inclus:

- `/enterprise` — Enterprise Work OS v1.1 board
- `/admin/performance` — Performance & Site Audit
- `/admin/roadmap` — Roadmap v1.x
- `/admin/quality` — Quality Gates
- `/api/v1/enterprise/release`
- `/api/v1/enterprise/site-map`
- `/api/v1/performance/audit`
- `/api/v1/performance/deep-audit`
- `apps/web/lib/enterprise/v11.ts`
- `apps/web/lib/performance/audit-routes.ts`
- `/taskuri` rescris cu randare controlată și fără `PageHeader actions`
- `Topbar` rescris ca search-ul să nu mai fie acoperit
- `Sidebar` actualizat cu Enterprise v1.1 / Action Center / Performance / Roadmap / Quality Gates
- `scripts/site-deep-audit.ps1`
- `docs/V11_ENTERPRISE_OPERATIONS_RELEASE.md`

## Reguli de versiune de acum înainte

Userul a cerut explicit: nu mai vrea doar `v1.0.x` incrementale. Următoarele livrări trebuie să fie build-uri majore:

- v1.1 — Enterprise Operations Release
- v1.2 — Database Activation Pack
- v1.3 — Task & Project Production Core
- v1.4 — Operations Modules Production
- v1.5 — Mobile Field App Pack

Patch-urile `v1.1.1`, `v1.1.2` se folosesc doar pentru build fixes urgente, nu pentru feature delivery principal.

## Ce trebuie verificat după v1.1

După deploy Vercel, se verifică manual:

- `/taskuri`
- `/enterprise`
- `/admin/performance`
- `/admin/roadmap`
- `/admin/quality`
- `/action-center`
- `/workflows`
- `/admin/system`
- `/admin/release`
- `/api/v1/enterprise/release`
- `/api/v1/enterprise/site-map`
- `/api/v1/performance/audit`
- `/api/v1/performance/deep-audit`

Rulare audit complet:

```powershell
cd "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
.\scripts\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Raportul se salvează în `audit-results/` ca `.json` și `.md`.

## Ce trebuie făcut în v1.2

v1.2 trebuie să fie Database Activation Pack, nu doar patch vizual.

Obiective recomandate:

1. Prisma/PostgreSQL activ real
   - tabele pentru users, projects, tasks, comments, attachments, audit events, workflow executions
   - migrations
   - seed real
   - repository mode: `mock | local | database`

2. Auth real
   - Auth.js / NextAuth
   - Microsoft/Google OAuth
   - demo mode separat de production mode
   - session persistent

3. RBAC real
   - roles + permissions persistente
   - route guards pe server
   - UI guard pentru butoane critice

4. Audit log persistent
   - fiecare create/update/delete/task transition să producă event
   - audit events vizibile în `/admin/audit`

5. Workflow executions persistente
   - workflow run să salveze execution + status + actor + payload

## Ce trebuie făcut în v1.3

v1.3 trebuie să fie Task & Project Production Core:

- CRUD complet task
- CRUD complet project
- project detail page
- subtask CRUD
- comments CRUD
- attachments metadata
- Kanban persistent
- table filters persistente
- calendar real cu taskuri/milestones
- workload real pe user
- timer/time entries persistente

## Ce trebuie făcut în v1.4

v1.4 trebuie să transforme modulele operaționale din mock în aplicații reale task-first:

- CRM opportunity detail
- ofertare/workflow aprobare ofertă
- IoT alert → task/ticket persistent
- equipment reservations
- serial/QR traceability
- maintenance ticket detail
- dispatch/SLA logic
- funding/audit case task ownership

## Ce trebuie făcut în v1.5

v1.5 trebuie să activeze mobile field app:

- Expo app completă
- Home mobile
- My Work mobile
- Task Detail mobile
- Board mobile
- Calendar mobile
- Timesheet mobile
- Field Technician / Instalare FV
- Dispatch mobile
- Client portal mobile
- offline-first conceptual + local storage mock

## Atenționări tehnice

- Nu folosi `PageHeader actions={...}`. Componenta acceptă `children`.
- Nu importa `approvalRequests`; exportul existent este `approvals`.
- Dacă `/taskuri` se blochează, verifică localStorage și evită randarea simultană a componentelor grele.
- Nu strica interfața existentă. Orice optimizare trebuie să păstreze look-ul premium enterprise.
- Pentru patch-uri, userul preferă ZIP cu fișierele schimbate + comandă PowerShell completă care extrage din Downloads, copiază peste repo, build, commit, push.

## Comandă standard de aplicare patch

Userul preferă comenzi de forma:

```powershell
$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zip = "$env:USERPROFILE\Downloads\PATCH_NAME.zip"
$tmp = "$env:TEMP\PATCH_TEMP"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive -Path $zip -DestinationPath $tmp -Force
Copy-Item "$tmp\*" $repo -Recurse -Force
cd $repo
Remove-Item ".\servelect-work-os" -Recurse -Force -ErrorAction SilentlyContinue
pnpm --filter @servelect/web build
git add .
git commit -m "Commit message"
git push origin main
```

## Ton preferat user

- Română
- Direct, practic
- Fișiere concrete
- Comenzi complete PowerShell
- Fără explicații lungi inutile când cere build/patch
- Să se spună sincer dacă ceva este mock/foundation și nu production real

---
v1.1 fix: performance audit route
Date: 2026-06-05 09:35:41
Fixed apps/web/app/api/v1/performance/audit/route.ts
Removed duplicate generatedAt and replaced missing manifestWithoutGeneratedAt with manifest.
Next validation: pnpm --filter @servelect/web build, then Vercel deploy.

---
v1.1 fix: AppShell Sidebar mobile prop
Date: 2026-06-05 09:43:36
Fixed Vercel TypeScript build error in apps/web/components/layout/AppShell.tsx.
Removed unsupported mobile prop from Sidebar invocation.
Next validation: pnpm --filter @servelect/web build, then Vercel deploy.
