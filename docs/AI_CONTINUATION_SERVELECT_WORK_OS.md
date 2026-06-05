# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Stadiu curent

Versiune curentă pregătită: **v1.5.0 — Auth & RBAC Production Pack**.

Repository GitHub: `https://github.com/mrshoby/servelect-work-os`
Website Vercel: `https://servelect-work-os-web.vercel.app`
Repo local folosit de utilizator:
`D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`

## Regula de lucru cerută de utilizator

Utilizatorul nu mai vrea doar hotfix-uri `v1.0.x`. Vrea build-uri majore de tip `v1.X`.
Pentru fiecare build nou trebuie livrat:

1. ZIP cu fișierele schimbate.
2. Comandă PowerShell completă care:
   - ia ZIP-ul din Downloads;
   - îl extrage;
   - copiază fișierele în repo;
   - aplică fixuri de compatibilitate;
   - setează versiunea în package.json;
   - rulează build local;
   - face commit;
   - face push pe GitHub;
   - pornește deploy Vercel automat.
3. Document MD cu ce s-a făcut și ce urmează.

## Evoluție versiuni

- v1.1 — Enterprise Operations Release
- v1.2 — Enterprise Data Foundation Release
- v1.3 — Enterprise Database Activation Pack
- v1.4 — Enterprise WorkGraph Persistence Core
- v1.5 — Auth & RBAC Production Pack

## Erori rezolvate anterior

- `/taskuri` se bloca: pagina a fost optimizată prin randare doar pentru view-ul activ și limitare taskuri afișate.
- Topbar search era suprapus de textul SERVELECT WORK OS / Live / Demo Auth: textul a fost eliminat din topbar.
- `PageHeader actions` nu exista: s-a trecut la children.
- `generatedAt` duplicat în performance audit route: manual generatedAt eliminat când manifest îl are deja.
- `manifestWithoutGeneratedAt` lipsă: înlocuit cu manifest.
- `Sidebar mobile` prop invalid: eliminat din AppShell.
- `db-ready` TypeScript error: trebuie fie adăugat în tipuri, fie convertit la `ready` în data pentru build stabil.

## Build v1.5.0

Adaugă:

- `/admin/auth-rbac`
- `/api/v1/enterprise/auth-rbac`
- `/api/v1/enterprise/auth-rbac-health`
- `/api/v1/enterprise/permission-matrix`
- `apps/web/lib/enterprise/auth-rbac.ts`
- `scripts/auth-rbac-readiness-test.ps1`
- `docs/V15_AUTH_RBAC_PRODUCTION_PACK.md`

Scop:

- Definește contractul pentru Auth.js/SSO.
- Definește capabilități auth/RBAC.
- Definește matricea roluri/permisiuni.
- Pregătește persistent auth/session/user management pentru DB real.

## Atenție importantă

Înainte de orice build/push, scripturile trebuie să repare compatibilitatea:

- în `AppShell.tsx`, elimină prop-ul `mobile` de pe `<Sidebar />`;
- în `performance/audit/route.ts`, elimină generatedAt duplicat și manifestWithoutGeneratedAt;
- în `database-activation.ts`, fie include `db-ready` în tip, fie transformă `status: "db-ready"` în `status: "ready"`;
- în `admin/database/page.tsx`, statusTone trebuie să accepte orice status folosit.

## Următorul build recomandat

**v1.6.0 — Task & Project Persistence Pack**

Focus:

- Task/Project persistence reală în repository layer.
- API mock -> repository switching clar.
- Pregătire pentru Prisma/PostgreSQL real.
- Comments, time entries, subtasks, status history.
- Persistență pentru timer și workflow events.
