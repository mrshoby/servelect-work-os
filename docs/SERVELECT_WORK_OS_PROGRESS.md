# SERVELECT WORK OS / SERVELECT EMP — Progress Log

## Direcție produs

Platforma rămâne un **Work OS task-first** pentru Servelect: proiecte, taskuri, Kanban, listă, timeline, calendar, workload, timesheet, documente, approvals, rapoarte și module operaționale integrate. Modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR sunt sub-sisteme conectate la proiecte/taskuri, nu aplicații separate.

## Versiuni livrate

### v0.1 — MVP inițial

- Monorepo `apps/web`, `apps/mobile`, `packages/shared`.
- Next.js 15, React 19, TypeScript, Tailwind.
- Layout desktop cu sidebar/topbar.
- Pagini principale: dashboard, proiecte, taskuri, CRM, IoT, echipamente, mentenanță, finanțări/ESG, HR/admin.
- Mock data românească.

### v0.2 — Task & Project Core

- Task CRUD local/mock.
- Task drawer, Kanban, tabel taskuri, filtre.
- Creare/editare proiecte în UI.
- Persistență localStorage.
- Deploy GitHub + Vercel funcțional.

### v0.2 Global Performance Fix

- Homepage light.
- KpiCard și EnergyChart optimizate cu SVG nativ.
- Kanban și TaskTable limitate/optimizate.
- Store localStorage trecut la `servelect-work-os-store-v3`.
- Patch pentru lag/freeze pe homepage, proiecte și taskuri.

### v0.3 — Enterprise UI Polish

- Enterprise Shell complet.
- Sidebar/Topbar/MobileNav rafinate.
- Card/PageHeader polish.
- Pagini principale păstrate rapide și coerente vizual.
- Documentație release v0.3.

### v0.4 — Backend Foundation

- API REST în Next.js Route Handlers.
- Endpointuri `/api/v1/projects`, `/tasks`, `/dashboard`, `/iot/alerts`, `/approvals`, `/search`, `/audit-log`.
- Repository layer server-side pe mock data.
- RBAC mock + audit log.
- Prisma schema pregătită pentru PostgreSQL.

### v0.5 — Database + Prisma Activation

- Provider selector `mock` / `prisma`.
- Repository Prisma pentru proiecte/taskuri.
- Dynamic Prisma client ca build-ul Vercel să rămână stabil până la activarea DB.
- Endpointuri `/api/v1/db/mode`, `/api/v1/db/status`, `/api/v1/db/seed`.
- Scripturi pentru instalare Prisma, migrate și seed.
- `.env.example` actualizat.

## Următoarea etapă recomandată

```text
v0.6 — Auth + RBAC real + Protected App
```

Obiective v0.6:

- login real;
- sesiune server-side;
- protejare route groups;
- RBAC real per rol;
- user menu conectat la sesiune;
- audit log cu user real;
- pregătire multi-tenant.
