# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Context proiect

Proiect: `SERVELECT WORK OS / SERVELECT EMP`

Repository GitHub:
`https://github.com/mrshoby/servelect-work-os`

Deployment Vercel:
`https://servelect-work-os-web.vercel.app`

Repo local folosit de utilizator:
`D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`

Scop: platformă Work OS task-first pentru Servelect, inspirată de GoodDay/ClickUp/Linear/Asana/Monday, adaptată pentru energie/fotovoltaice.

## Reguli de lucru stabilite cu utilizatorul

1. Utilizatorul vrea versiuni majore de tip `v1.X`, nu doar hotfix-uri `v1.0.X`.
2. Când se livrează un build, se dă ZIP cu fișierele schimbate.
3. Se dă și comandă PowerShell completă care ia ZIP-ul din Downloads, îl extrage, îl copiază peste repo, aplică fixuri defensive, setează versiunea, rulează build, commit și push.
4. Interfața vizuală existentă trebuie păstrată.
5. Orice build trebuie să actualizeze acest MD pentru continuitate în alt chat/AI.

## Fixuri defensive care trebuie păstrate în scripturile viitoare

### AppShell Sidebar mobile prop

În `apps/web/components/layout/AppShell.tsx`, `Sidebar` nu acceptă prop `mobile`.
Elimină orice `mobile` din `<Sidebar ... mobile />`.

### Performance audit route

În `apps/web/app/api/v1/performance/audit/route.ts`, evită:
- `generatedAt` dublat;
- `manifestWithoutGeneratedAt` fără variabilă.

### Database activation status

Nu folosi `db-ready`.
Folosește:
`ready | partial | mock | blocked`

Curăță global `db-ready` din `apps/web/**/*.ts(x)`.

### Task project health

În `apps/web/app/api/v1/enterprise/task-project-health/route.ts`, nu adăuga:
`ok: true, ...getTaskProjectPersistenceHealth()`

Folosește direct:
`NextResponse.json(getTaskProjectPersistenceHealth())`.

## Istoric build-uri recente

- v1.3 — Enterprise Database Activation Pack.
- v1.4 — Enterprise WorkGraph Persistence Core.
- v1.5 — Auth & RBAC Production Pack.
- v1.6 — Task & Project Persistence Pack.
- v1.7 — Real Task CRUD & API-backed Store.
- v1.8 — API-backed UI Store Integration Pack.
- v1.9 — UI Task Store Feature Flag Pack.

## v1.9 adaugă

- `/admin/ui-task-store`
- `/api/v1/enterprise/ui-task-store-flags`
- `/api/v1/enterprise/ui-task-store-health`
- `/api/v1/enterprise/ui-task-store-integration-plan`
- `apps/web/lib/enterprise/ui-task-store-flags.ts`
- `scripts/ui-task-store-feature-flags-test.ps1`

Scop: feature flags pentru migrarea controlată a UI store-ului task/proiecte către API-backed store.

## Stadiu real aplicație

Website:
- MVP enterprise avansat;
- multe module admin/enterprise;
- multe API routes mock/manifest;
- task CRUD API contract pregătit;
- încă nu este DB production complet.

Mobile:
- schelet/concept Expo;
- nu este aplicație mobilă complet production.

Backend:
- încă predominant mock/local/API manifest;
- DB real PostgreSQL/Prisma nu este complet activ ca provider production.

## Următor build recomandat

Opțiunea A:
`v2.0.0 — Enterprise Beta Stabilization`

Focus:
- stabilizare build;
- audit toate rutele;
- reparare version drift;
- release manifest unic;
- smoke tests;
- pregătire demo beta.

Opțiunea B:
`v1.10.0 — DB Provider Wiring Pack`

Focus:
- DATABASE_URL;
- Prisma provider;
- seed;
- repository switch mock -> db;
- audit log persistent;
- task/project persistence real.
