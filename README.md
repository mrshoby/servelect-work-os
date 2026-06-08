# SERVELECT WORK OS / SERVELECT EMP

Platformă modernă de **project management, task management, operațiuni energetice și colaborare**, inspirată vizual de GoodDay.work, ClickUp, Linear, Asana Enterprise și Monday.com, dar adaptată pentru proiecte fotovoltaice și operațiuni Servelect.

Prima livrare include un **monorepo** cu:

- `apps/web` — Next.js 15 + React 19 + TypeScript + Tailwind, cu toate paginile principale și mock data local.
- `apps/mobile` — schelet Expo + React Native pregătit pentru ecranele mobile Field Technician / Dispatch / My Work.
- `packages/shared` — types TypeScript + mock data reutilizabile între web și mobile.

## Ce este implementat în Web MVP

- Layout enterprise cu sidebar dark navy/verde, topbar, search global, user menu, notificări și quick create.
- Dashboard / Home Command Center task-first.
- Proiecte cu KPI, Gantt/timeline, board, task list, riscuri, approvals, documente, chat.
- Taskuri cu My Work, Kanban drag/drop demo, Task Table, drawer detalii task, subtaskuri, comentarii, time tracker demo.
- CRM & Vânzări cu pipeline Kanban, client 360°, workflow ofertă, approvals, ROI.
- Monitorizare IoT/Energie cu KPI, chart live, hartă mock, alerte care pot genera task/ticket.
- Echipamente & Logistică cu catalog, stoc, QR/barcode mock, serial traceability, aprobări.
- Mentenanță, Tickete & Dispatch cu hartă mock, coadă SLA, intervenții, checklist, semnătură.
- Finanțări, Audituri & ESG cu pipeline, audit progress, calendar conformitate, documente și taskuri.
- HR, Resurse & Admin cu workload heatmap, pontaj, RBAC, certificări, audit activity.
- Mobile/responsive preview în `/mobile`.
- Mock API route handlers în `/api/tasks` și `/api/projects`.
- Persistență demo pentru taskuri în `localStorage` prin Zustand.

## Rulare locală

```bash
cd servelect-work-os
pnpm install
pnpm dev:web
```

Apoi deschide:

```text
http://localhost:3000
```

Pentru aplicația mobilă Expo:

```bash
pnpm dev:mobile
```

## Structură

```text
servelect-work-os/
  apps/
    web/
      app/
      components/
      lib/
      styles/
    mobile/
      app/
      components/
      data/
  packages/
    shared/
      src/
        index.ts
        types.ts
        mock-data.ts
        utils.ts
```

## Observații importante

- Datele sunt mock, dar modelul este pregătit pentru PostgreSQL/Prisma, Redis, TimescaleDB și WebSocket.
- UI-ul este construit ca aplicație finală task-first, nu doar ca dashboard energetic.
- Modulele de energie, IoT, mentenanță, logistică, CRM, finanțări și HR sunt integrate în același model de proiecte/taskuri.
- Pentru backend real, următorul pas este adăugarea `apps/api` cu Fastify + Prisma + PostgreSQL.

## Comenzi utile

```bash
pnpm typecheck
pnpm lint
pnpm build
```

---

## Visual Studio Code

Pentru lucrul zilnic în VS Code, deschide fișierul:

```text
servelect-work-os.code-workspace
```

Comenzi rapide:

```powershell
pnpm install
pnpm --filter @servelect/web dev
```

Sau din VS Code: `Ctrl + Shift + P` → `Tasks: Run Task` → `SERVELECT: dev web`.

Ghid complet: `docs/DEV_VSCODE.md`.

## v5.5.0 — Work OS Task Execution Interaction Pack

Latest local build package: v5.5.0 adds the interactive task/project execution layer on top of v5.4:

- task execution cockpit on `/work-os/tasks` and `/taskuri`;
- saved views, quick edit, bulk operations and dependency map;
- comments/activity timeline, attachments UI and role-aware Admin/Manager controls;
- API audit endpoint `/api/v1/work-os/task-execution-interactions`;
- safe-by-default local/shadow-safe behavior, with persistent records planned for v5.6.0.

See `docs/V55_TASK_EXECUTION_INTERACTION_PACK.md`, `docs/V55_CHANGELOG.md`, `docs/V55_QA_REPORT.md` and `docs/V55_DEPLOYMENT_REPORT.md`.



## v5.6.0 — Real Persistent Records, Inline Editing & Activity Comments

v5.6 continuă direcția originală SERVELECT WORK OS: platformă task-first inspirată de GoodDay/ClickUp/Linear/Asana/Monday, nu dashboard separat de energie sau stocuri.

Adăugări principale:
- `/work-os/persistent-records` — cockpit pentru recorduri persistente, inline editing și activity comments.
- `/work-os/status` — status/procente vizibile pe site pentru Website/Web App, Task & Project Core, Backend/API, Database/Prisma/Seed, Auth/RBAC, IoT/Ops și Mobile App.
- `/api/v1/work-os/persistent-records` și `/api/v1/work-os/status` — API read-only pentru raportul v5.6.
- Pregătire pentru v5.7: Real Database Adapter Switchboard & Record Mutations.

Scrierile reale rămân controlate; `SERVELECT_WORK_OS_WRITE_MODE` nu este activat automat.
