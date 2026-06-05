# SERVELECT WORK OS — AI Continuation Context

Acest fișier trebuie folosit în orice chat/AI nou pentru a continua dezvoltarea fără pierdere de context.

## Proiect

Repo GitHub: `https://github.com/mrshoby/servelect-work-os`
Deploy Vercel: `https://servelect-work-os-web.vercel.app`
Folder local folosit în PowerShell:

```powershell
D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live
```

## Direcție produs

SERVELECT WORK OS / SERVELECT EMP este un Work OS task-first pentru Servelect, inspirat de GoodDay, ClickUp, Linear, Asana Enterprise și Monday.com, adaptat pentru energie/fotovoltaice.

Nu trebuie tratat ca simplu dashboard de energie sau stocuri. Centrul produsului este:

- proiecte;
- taskuri/subtaskuri;
- Kanban/list/table/calendar/Gantt;
- workload/timesheet;
- documente;
- chat/updates;
- approvals;
- rapoarte;
- workflow-uri custom;
- roluri/permisiuni;
- module operaționale integrate: CRM, IoT/energie, echipamente, mentenanță, finanțări/ESG, HR/Admin.

## Versiuni livrate

### v0.7
Protected App + User Management foundation. A introdus auth/RBAC demo, `/admin/users`, impersonare/authorize demo.

### v0.8
Persistence Governance Core. A introdus `/admin/system`, `/workflows`, system readiness/status API, workflow templates/run.

### v0.9
Action Center & Audit Automation. A introdus `/action-center`, `/admin/audit`, action-center API, audit events, workflow executions.

### v1.0
Enterprise Release Baseline. A introdus `/admin/release`, release manifest/checklist, baseline enterprise.

### v1.0.1 / v1.0.2
Performance hotfix pentru `/taskuri`, topbar overlap fix, page render optimizat, localStorage version bump, `/admin/performance`, API audit.

### v1.0.3
Site-wide audit + continuation context. A introdus `scripts/site-deep-audit.ps1`, manifest rute, document de continuitate.

### v1.1
Enterprise Operations Release. A introdus `/enterprise`, `/admin/roadmap`, `/admin/quality`, release APIs, documentație enterprise operations.

### v1.2 — acest build
Enterprise Data Foundation Release.

Adaugă:

- `/admin/data-foundation`
- `/api/v1/enterprise/data-foundation`
- `/api/v1/enterprise/data-readiness`
- `apps/web/lib/enterprise/data-foundation.ts`
- taskuri page performance-safe actualizat;
- fixuri automate pentru build-uri anterioare;
- documentație actualizată.

## Erori întâlnite și fixuri

1. `PageHeader actions does not exist` în `/taskuri`
   - Fix: `PageHeader` primește acțiunile ca `children`, nu ca prop `actions`.

2. `generatedAt is specified more than once` în `/api/v1/performance/audit`
   - Fix: nu se definește manual `generatedAt` dacă manifestul îl conține deja.

3. `manifestWithoutGeneratedAt not found`
   - Fix: se folosește direct `...manifest` după eliminarea `generatedAt` manual.

4. `Sidebar mobile prop does not exist`
   - Fix: în `AppShell.tsx`, se elimină prop-ul `mobile` din `<Sidebar />`.

5. `/taskuri` se bloca în browser
   - Fix: pagina randează doar view-ul activ, limitează numărul de taskuri afișate, folosește board/table light și schimbă localStorage key.

## Ce trebuie făcut în continuare

### v1.3 — Database Activation Pack

Prioritate mare:

- Prisma schema real;
- PostgreSQL real;
- seed script;
- task/project CRUD persistent;
- user management persistent;
- audit log persistent;
- workflow executions persistente;
- fallback mock dacă DB nu există.

### v1.4 — Auth/SSO Production Pack

- Auth.js / NextAuth;
- Microsoft/Google SSO;
- session reală;
- RBAC pe componente;
- permisiuni pe API;
- route guards reale.

### v1.5 — Mobile Field Ops Pack

- Expo app extins;
- Field Technician screens;
- offline queue;
- QR/camera/GPS mock;
- sync policy.

### v1.6 — IoT Operations Pack

- MQTT/Modbus/Timescale architecture;
- alertă IoT -> task/ticket;
- SLA persistent;
- dashboard installations real.

## Reguli de lucru cerute de user

- Nu mai livra doar bucăți mici v1.0.x când se cere următorul build major.
- Folosește versiuni majore/minore clare: v1.1, v1.2, v1.3 etc.
- Livrează ZIP cu fișierele schimbate.
- Dă și o comandă PowerShell completă care:
  - ia ZIP-ul din Downloads;
  - îl extrage;
  - îl copiază peste repo;
  - rulează build;
  - face commit;
  - face push.
- Păstrează interfața existentă când faci fixuri de performanță.
- Actualizează mereu acest fișier MD cu ce s-a făcut și ce trebuie făcut.

## Comandă de audit după deploy

```powershell
cd "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
.\scripts\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Rute importante de verificat

- `/`
- `/dashboard`
- `/taskuri`
- `/proiecte`
- `/action-center`
- `/enterprise`
- `/admin/system`
- `/admin/performance`
- `/admin/release`
- `/admin/audit`
- `/admin/quality`
- `/admin/roadmap`
- `/admin/data-foundation`
- `/api/v1/system/status`
- `/api/v1/system/readiness`
- `/api/v1/performance/audit`
- `/api/v1/enterprise/release`
- `/api/v1/enterprise/site-map`
- `/api/v1/enterprise/data-foundation`
- `/api/v1/enterprise/data-readiness`
