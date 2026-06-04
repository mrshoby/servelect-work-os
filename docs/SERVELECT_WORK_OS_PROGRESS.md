# SERVELECT WORK OS / SERVELECT EMP — progres proiect

## Direcție generală

SERVELECT WORK OS este construit ca o aplicație enterprise task-first, inspirată de GoodDay, ClickUp, Linear, Asana Enterprise și Monday.com, adaptată pentru operațiuni de energie/fotovoltaice.

Principiul de bază rămâne: modulele de energie, IoT, echipamente, mentenanță, CRM, finanțări și HR nu sunt aplicații separate, ci module operaționale conectate la proiecte, taskuri, aprobări, audit log și rapoarte.

## v0.1 — MVP inițial

- monorepo cu `apps/web`, `apps/mobile`, `packages/shared`;
- Next.js 15, React 19, TypeScript, Tailwind;
- layout desktop cu sidebar/topbar;
- mock data românească;
- pagini principale pentru Dashboard, Proiecte, Taskuri, CRM, IoT, Echipamente, Mentenanță, Finanțări & ESG, HR Admin;
- schelet mobile/Expo.

## v0.2 — Task & Project Core

- creare/editare task în mock/local state;
- Kanban demo;
- tabel taskuri;
- drawer detalii task;
- proiecte cu drawer detalii;
- taskuri legate de proiecte;
- localStorage pentru persistență locală;
- deploy GitHub + Vercel configurat.

## v0.2 Performance Fix

- homepage light;
- Recharts înlocuit cu SVG unde era sensibil la blocaje;
- KpiCard optimizat;
- EnergyChart optimizat;
- Kanban limitat ca număr de carduri randate;
- TaskTable optimizat;
- store localStorage trecut pe versiune nouă și limitări pentru date persistate.

## v0.3 — Enterprise UI Polish

- shell enterprise: sidebar/topbar/mobile nav;
- pagini principale polish;
- carduri și page headers mai premium;
- meniu mai apropiat de Work OS enterprise;
- continuare fără componente grele care blocau pagina.

## v0.4 — Backend Foundation

- API REST prin Next.js Route Handlers;
- endpointuri pentru health, dashboard, proiecte, taskuri, alerte IoT, aprobări, search, audit log;
- repository layer mock server-side, pregătit pentru Prisma;
- RBAC mock pe roluri și permisiuni;
- audit log server-side;
- flow IoT alert → task;
- Prisma schema completă, pregătită pentru PostgreSQL;
- `.env.example` și script de testare endpointuri.

## Următorul milestone

**v0.5 — Real Database + Prisma Activation**

Obiectiv: activarea PostgreSQL/Prisma real, fără să pierdem fallback-ul mock și fără să stricăm deploy-ul Vercel.
