# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Context proiect

Aplicația este `SERVELECT WORK OS / SERVELECT EMP`, un Work OS task-first pentru Servelect, inspirat de GoodDay, ClickUp, Linear, Asana Enterprise și Monday.com. Scopul este o platformă unică pentru proiecte, taskuri, subtaskuri, Kanban, list/table, Gantt, calendar, workload, timesheet, documente, chat/updates, approvals, rapoarte, workflow-uri, roluri și permisiuni. Modulele energie/IoT/echipamente/mentenanță/CRM/finanțări/HR trebuie integrate în același sistem de proiecte/taskuri, nu aplicații separate.

## Repo și deploy

- GitHub: `https://github.com/mrshoby/servelect-work-os`
- Vercel: `https://servelect-work-os-web.vercel.app`
- Folder local folosit în PowerShell: `D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`
- Package manager: `pnpm`
- Framework web: Next.js 15 App Router, React 19, TypeScript, Tailwind.

## Versiuni recente

### v1.0 — Enterprise Release Baseline
A introdus Release Console și manifest enterprise.

### v1.1 — Enterprise Operations Release
A introdus `/enterprise`, roadmap, quality/performance/admin pages și a mutat proiectul spre release-uri majore v1.X.

### Fixuri v1.1
Au fost reparate mai multe erori Vercel:
- duplicate `generatedAt` în `/api/v1/performance/audit`;
- variabilă lipsă `manifestWithoutGeneratedAt`;
- prop invalid `mobile` trimis către `Sidebar` în `AppShell`.

### v1.2 — Enterprise Data Foundation Release
A introdus:
- `/admin/data-foundation`
- `/api/v1/enterprise/data-foundation`
- `/api/v1/enterprise/data-readiness`
- `apps/web/lib/enterprise/data-foundation.ts`

Scop: clarificarea stării datelor reale vs mock/localStorage.

### v1.3 — Enterprise Database Activation Pack
Build-ul curent propus. Adaugă:
- `/admin/database`
- `/api/v1/enterprise/database-activation`
- `/api/v1/enterprise/database-health`
- `/api/v1/enterprise/database-schema`
- `apps/web/lib/enterprise/database-activation.ts`
- `scripts/database-readiness-test.ps1`

Scop: pregătirea concretă pentru PostgreSQL/Prisma, fără activare riscantă directă în producție.

## Stadiu real aplicație

Website-ul este un MVP enterprise avansat. Are layout, sidebar/topbar, dashboard, taskuri optimizate, proiecte, CRM, IoT, echipamente, mentenanță, finanțări/ESG, HR/Admin, action center, audit, workflows, release/admin consoles și pagini de readiness.

Încă nu este complet production DB-backed. Multe date sunt mock/localStorage/API manifest. Mobile app este încă schelet/concept, nu aplicație Expo completă.

## Reguli importante pentru continuare

1. Nu mai face versiuni `v1.0.x` decât pentru hotfix-uri critice. Pentru build-uri mari folosește `v1.3`, `v1.4`, `v1.5` etc.
2. Fiecare build trebuie livrat ca ZIP cu fișiere schimbate + script PowerShell complet care:
   - ia ZIP-ul din Downloads;
   - îl extrage;
   - copiază fișierele peste repo;
   - setează versiunea package.json;
   - schimbă localStorage key când e nevoie;
   - rulează build local;
   - face commit și push.
3. Păstrează aceeași interfață vizuală; optimizează fără redesign agresiv.
4. Actualizează mereu acest fișier după fiecare build/fix.
5. Nu introduce dependențe noi fără să actualizezi lockfile și să verifici Vercel.

## Probleme cunoscute / atenție

- `/taskuri` a avut freeze în browser. A fost optimizat prin randare doar pe view activ și limitarea listelor mari.
- Topbar avea text care se suprapunea peste search. A fost simplificat.
- LocalStorage vechi poate bloca UI; la build-uri importante schimbă cheia store.
- Vercel build oprește la type-check, deci orice prop invalid sau import greșit pică deploy-ul.

## Următorul build recomandat după v1.3

`v1.4 — Real Task & Project Persistence`

Obiective:
- repository provider real pentru projects/tasks;
- API CRUD pentru taskuri și proiecte;
- seed idempotent;
- audit event persistent pentru create/update/status change;
- păstrarea UI taskuri/proiecte fără să se blocheze.

## Comenzi de validare

```powershell
pnpm --filter @servelect/web build
```

După deploy:

```powershell
.\scripts\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
.\scripts\database-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Rute importante de verificat

- `/`
- `/dashboard`
- `/taskuri`
- `/proiecte`
- `/enterprise`
- `/admin/performance`
- `/admin/database`
- `/admin/data-foundation`
- `/api/v1/enterprise/database-activation`
- `/api/v1/enterprise/database-health`
- `/api/v1/enterprise/database-schema`
