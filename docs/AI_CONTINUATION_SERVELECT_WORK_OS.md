# SERVELECT WORK OS / SERVELECT EMP — context de continuare pentru AI

Acest fișier trebuie păstrat în repo și actualizat la fiecare versiune. Rolul lui este să permită continuarea proiectului într-un alt chat / alt AI fără pierderea contextului.

## 1. Scopul aplicației

SERVELECT WORK OS / SERVELECT EMP este o platformă Work OS task-first pentru Servelect, inspirată de GoodDay.work, ClickUp, Linear, Asana Enterprise și Monday.com, adaptată pentru energie / fotovoltaice.

Aplicația NU trebuie să fie doar dashboard de energie sau stocuri. Ea trebuie să fie în primul rând un sistem de lucru centralizat, centrat pe:

- proiecte;
- taskuri;
- subtaskuri;
- Kanban board;
- list / table view;
- Gantt / timeline;
- calendar;
- workload / resource planning;
- timesheet;
- documente;
- chat / updates;
- approvals;
- rapoarte;
- workflow-uri custom;
- roluri și permisiuni.

Modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR trebuie să fie integrate operațional în același sistem de proiecte/taskuri, nu tratate ca aplicații separate.

## 2. Stack curent

Repo: `https://github.com/mrshoby/servelect-work-os`

Folder local folosit pentru patch-uri:

```powershell
D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live
```

Stack web:

- monorepo pnpm;
- Next.js 15 App Router;
- React 19;
- TypeScript strict;
- Tailwind CSS;
- Radix UI;
- Lucide React;
- Recharts;
- TanStack / Zustand unde există;
- mock data local + API routes mock.

Stack pregătit conceptual:

- Expo / React Native pentru mobile;
- Prisma / PostgreSQL pentru DB real;
- Redis / WebSocket / TimescaleDB pentru IoT;
- RBAC / Auth real / audit log persistent.

## 3. Versiuni și istoric scurt

### v0.7

Protected app + User Management:

- middleware protected app;
- `/unauthorized`;
- `/admin/users`;
- user detail / patch demo;
- RBAC foundation;
- impersonate / authorize demo.

### v0.8

Persistence Governance Core:

- `/admin/system`;
- `/workflows`;
- system status/readiness routes;
- workflow templates/run;
- documentație governance.

Fix important v0.8:

- `repository.dashboard().catch(...)` era greșit deoarece `dashboard()` returna obiect direct, nu Promise; fix cu `Promise.resolve(...)` + `try/catch`.

### v0.9

Action Center & Audit Automation:

- `/action-center`;
- `/admin/audit`;
- `/api/v1/action-center`;
- `/api/v1/audit/events`;
- `/api/v1/workflows/executions`;
- workflow run întoarce execution + auditEvent.

Fix important v0.9:

- `approvalRequests` nu exista exportat din `@servelect/shared`; corect este `approvals`.

### v1.0

Enterprise Release Baseline:

- `/admin/release`;
- `/api/v1/release/manifest`;
- `/api/v1/release/checklist`;
- release readiness în System Status;
- documentație release baseline.

### v1.0.1 / v1.0.2

Site stability + performance hotfix:

- focus pe `/taskuri`, unde browserul se bloca cu mesajul `This page isn't responding`;
- scop: păstrarea aceleiași interfețe, dar cu randare mai ușoară;
- fix topbar: scoatere text care intra peste bara de search (`SERVELECT WORK OS`, `Live`, `Demo auth`);
- adăugare `/admin/performance` și `/api/v1/performance/audit`;
- schimbare localStorage key ca să nu mai încarce state vechi/blocat.

Bug apărut în v1.0.1:

- `PageHeader` nu acceptă prop `actions`;
- trebuie folosit `children` în interiorul `PageHeader` sau trebuie extins tipul `PageHeader`.

## 4. Reguli de lucru pentru următoarele versiuni

1. Nu rupe designul existent. Interfața trebuie să rămână premium SaaS enterprise.
2. Nu transforma aplicația într-un ERP sau dashboard simplu. Taskurile rămân centrul sistemului.
3. Fiecare modul nou trebuie să fie legat de proiecte / taskuri / owners / status / deadline / audit.
4. Orice patch trebuie livrat ca ZIP cu fișierele modificate + comandă PowerShell completă care:
   - ia ZIP-ul din Downloads;
   - îl extrage automat;
   - copiază fișierele peste repo;
   - setează versiunea;
   - rulează build local;
   - face commit;
   - face push pe GitHub.
5. Înainte de push trebuie să treacă:
   - `pnpm --filter @servelect/web build`;
   - preferabil smoke test pe rutele principale.
6. Nu adăuga dependințe noi fără să actualizezi lockfile-ul.
7. Păstrează compatibilitatea cu Vercel.
8. Evită componente grele randate simultan. Folosește randare pe tab activ, limitare listă și lazy loading.

## 5. Probleme curente / de verificat

### Critic

- Verifică dacă v1.0.2 a trecut build-ul pe Vercel.
- Verifică `/taskuri` în browser real după deploy, inclusiv Incognito și Ctrl+F5.
- Verifică dacă topbar-ul nu mai suprapune text peste search.

### Performance audit necesar pe tot site-ul

Trebuie verificate rutele:

- `/`
- `/dashboard`
- `/taskuri`
- `/proiecte`
- `/calendar`
- `/echipa`
- `/crm`
- `/iot`
- `/echipamente`
- `/mentenanta`
- `/finantari`
- `/documente`
- `/rapoarte`
- `/administrare`
- `/action-center`
- `/workflows`
- `/admin/system`
- `/admin/audit`
- `/admin/release`
- `/admin/performance`

Pentru fiecare pagină trebuie verificat:

- build TypeScript;
- Vercel deploy;
- cod 200/3xx;
- timp de răspuns;
- freeze în browser;
- erori console;
- suprapuneri UI;
- mobile responsive;
- componente grele randate simultan;
- localStorage state vechi.

## 6. TODO tehnic prioritar

### v1.0.3 — Site-wide performance audit pack

- adaugă script de deep smoke test;
- adaugă document de audit permanent;
- adaugă API route pentru lista de rute și recomandări de audit;
- documentează ce trebuie verificat manual în browser;
- păstrează totul non-breaking.

### v1.1 — Database Activation Pack

- activare Prisma/PostgreSQL real;
- seed real;
- user persistence;
- audit log persistent;
- workflow executions persistente;
- migration scripts;
- fallback mock safe.

### v1.2 — Task Core Production

- CRUD task complet;
- subtaskuri reale;
- comments;
- attachments metadata;
- dependencies;
- checklist;
- time entries;
- activity log persistent;
- relationare task ↔ proiect ↔ owner ↔ audit.

### v1.3 — Project Detail Production

- pagină detaliu proiect;
- taskuri per proiect;
- documente per proiect;
- risc / approvals / chat / budget / timeline;
- Gantt mai realist.

### v1.4 — Mobile / Field Technician MVP

- Expo app mai complet;
- check-in GPS mock;
- checklist instalare;
- QR mock;
- foto mock;
- semnătură mock;
- offline queue conceptual.

## 7. Comandă standard pentru patch-uri viitoare

Formatul dorit de utilizator:

```powershell
$repo = "D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live"
$zipName = "servelect-work-os-vXXX-nume-patch.zip"
$zip = "$env:USERPROFILE\Downloads\$zipName"
$tmp = "$env:TEMP\servelect-vXXX"

# apoi:
# - verificare repo
# - git reset --hard origin/main
# - Expand-Archive
# - Copy-Item
# - set version
# - pnpm --filter @servelect/web build
# - git add .
# - git commit -m "..."
# - git push origin main
```

## 8. Note despre stil UI

- sidebar dark navy / verde Servelect;
- fundal alb / gri foarte deschis;
- carduri albe cu shadow subtil;
- badge-uri status/prioritate;
- tabele curate;
- densitate mare dar aerisită;
- fără wireframe simplu;
- fără texte care se suprapun peste search;
- responsive desktop / tablet / mobile.

## 9. Dacă proiectul este continuat în alt chat

Instrucțiune scurtă pentru AI:

> Continuă proiectul SERVELECT WORK OS / SERVELECT EMP din repo-ul `mrshoby/servelect-work-os`. Este un Work OS task-first pentru Servelect, nu dashboard simplu. Suntem după v1.0/v1.0.2, cu patch-uri pentru performance pe `/taskuri`, topbar search overlap, Action Center, Audit, Workflow, System Status și Release Console. Păstrează interfața existentă, lucrează prin ZIP patch + comandă PowerShell completă, actualizează acest fișier MD la fiecare versiune și verifică build-ul înainte de push.
