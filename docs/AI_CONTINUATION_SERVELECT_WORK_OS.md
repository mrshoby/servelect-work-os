# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Context proiect

Se dezvoltă aplicația **SERVELECT WORK OS / SERVELECT EMP**, o platformă Work OS task-first pentru Servelect, inspirată de GoodDay.work, ClickUp, Linear, Asana Enterprise și Monday.com, adaptată pentru energie/fotovoltaice.

Aplicația trebuie să rămână centrată pe:

- proiecte;
- taskuri;
- subtaskuri;
- Kanban;
- task table/list;
- Gantt/timeline;
- calendar;
- workload/resource planning;
- timesheet;
- documente;
- chat/updates;
- approvals;
- rapoarte;
- workflow-uri custom;
- roluri și permisiuni.

Modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR trebuie integrate în același sistem de taskuri/proiecte, nu ca aplicații separate.

## Repo și deploy

- GitHub: `https://github.com/mrshoby/servelect-work-os`
- Vercel: `https://servelect-work-os-web.vercel.app`
- Folder local folosit de utilizator:
  `D:\01_digitalizare_automatizare\02_productie\05_aplicatie_goodday\02_beta\03_v003\servelect-work-os-v003-live`

## Stadiu versiuni

### v1.0
Enterprise Release Baseline.

### v1.1
Enterprise Operations Release.

### v1.2
Enterprise Data Foundation Release.

### v1.3
Database Activation Pack.

Probleme apărute:

- `db-ready` nu era inclus în `DatabaseActivationStatus`;
- `statusTone` nu avea cheia `db-ready`;
- ulterior s-a decis normalizarea la `ready`, nu `db-ready`.

### v1.4
WorkGraph Persistence Core.

A introdus planul pentru WorkGraph, entități persistente și ordinea de migrare.

### v1.5
Auth & RBAC Production Pack.

A introdus pagină și API-uri pentru auth/RBAC production readiness.

Problemă v1.5:

- rămăseseră referințe `db-ready` în cod după normalizare.
- fix recomandat: toate aparițiile `db-ready` din `apps/web/*.ts/*.tsx` trebuie înlocuite cu `ready`.

### v1.6
Task & Project Persistence Pack.

A introdus planul pentru persistența proiectelor/taskurilor:

- `/admin/task-projects`
- `/api/v1/enterprise/task-project-persistence`
- `/api/v1/enterprise/task-project-health`
- `/api/v1/enterprise/task-project-schema`
- `/api/v1/enterprise/task-project-migration-plan`

Problemă v1.6:

- `task-project-health/route.ts` avea `ok: true` și apoi spread peste un obiect care avea deja `ok`.
- fix: ruta trebuie să returneze direct `NextResponse.json(getTaskProjectPersistenceHealth())`.

### v1.7
Real Task CRUD & API-backed Store.

A introdus contract CRUD API:

- `/admin/task-crud`
- `/api/v1/tasks`
- `/api/v1/projects`
- `/api/v1/enterprise/task-crud`
- `/api/v1/enterprise/task-crud-health`
- `/api/v1/enterprise/task-crud-schema`

Providerul rămâne `mock-memory`, nu PostgreSQL real.

### v1.8
API-backed UI Store Integration Pack.

A introdus:

- `/admin/api-ui-store`
- `/api/v1/enterprise/api-ui-store`
- `/api/v1/enterprise/api-ui-store-health`
- `/api/v1/enterprise/api-ui-store-integration-plan`
- `apps/web/lib/enterprise/api-ui-store.ts`
- `scripts/api-ui-store-readiness-test.ps1`

Scop: conectarea progresivă a UI-ului existent la API contracte, fără modificarea designului vizual și fără dezactivarea fallback-ului localStorage/mock data.

## Fixuri defensive importante care trebuie păstrate

În orice script de aplicare patch trebuie păstrate aceste fixuri:

1. Elimină prop-ul `mobile` din `Sidebar` în `AppShell.tsx`.
2. Curăță `performance/audit/route.ts` de duplicate `generatedAt` și `manifestWithoutGeneratedAt`.
3. Curăță global `db-ready` din `apps/web/**/*.ts` și `apps/web/**/*.tsx`.
4. Normalizează `DatabaseActivationStatus` la:
   `"ready" | "partial" | "mock" | "blocked"`.
5. Normalizează `statusTone` din `admin/database/page.tsx` fără `db-ready`.
6. Rescrie `task-project-health/route.ts` să returneze direct `getTaskProjectPersistenceHealth()`.
7. Schimbă cheia Zustand/localStorage la fiecare build major pentru a evita state vechi/blocat.

## Următorul build recomandat

**v1.9.0 — UI Task Store Feature Flag Pack**

Obiective:

- feature flag pentru API-backed UI store;
- hook `useApiBackedTasks`;
- fallback la Zustand/localStorage;
- optimistic updates pentru create/update/delete;
- audit event la acțiuni CRUD;
- fără schimbare de design.

## Reguli de lucru pentru următorul AI/chat

- Răspunde în română.
- Dă ZIP cu fișiere schimbate pentru fiecare build.
- Dă și comandă PowerShell completă care ia ZIP-ul din Downloads, îl extrage, îl aplică, face build, commit și push.
- Nu da doar cod lipit în chat.
- Păstrează interfața existentă.
- Nu schimba designul fără cerere explicită.
- Rulează/impune build local înainte de commit/push.
- Dacă Vercel pică, repară cauza punctual și actualizează acest fișier MD.
