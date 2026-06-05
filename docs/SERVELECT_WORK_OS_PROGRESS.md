# SERVELECT WORK OS / SERVELECT EMP — Progress Log

## Context principal

SERVELECT WORK OS / SERVELECT EMP este construit ca platformă enterprise task-first, inspirată de GoodDay, ClickUp, Linear, Asana Enterprise și Monday, adaptată pentru companie de energie/fotovoltaice.

Aplicația nu trebuie să fie doar dashboard energie/stocuri. Modulele CRM, IoT, echipamente, mentenanță, finanțări, ESG și HR trebuie să fie operaționale în același sistem de proiecte, taskuri, tickete, aprobări și documente.

## v0.1 — MVP inițial

- monorepo `apps/web`, `apps/mobile`, `packages/shared`;
- Next.js 15, React 19, TypeScript, Tailwind;
- layout de bază, sidebar, topbar;
- pagini principale mock;
- mock data în română.

## v0.2 — Task & Project Core

- taskuri editabile local;
- Kanban, task table, drawer;
- proiecte și project drawer;
- localStorage pentru date demo;
- deploy GitHub + Vercel.

## v0.2 Performance Fix

- homepage light;
- Recharts înlocuit cu SVG în zone critice;
- localStorage versioning `servelect-work-os-store-v3`;
- Kanban și TaskTable optimizate;
- blocajele principale de browser reduse.

## v0.3 — Enterprise UI Polish

- Enterprise shell complet;
- sidebar nou grupat pe Work OS / Operațiuni / Companie;
- topbar premium;
- mobile nav;
- card/page header polish;
- pagini principale polish: Dashboard, Proiecte, Taskuri, CRM, IoT, Echipamente, Mentenanță, Finanțări, HR, Calendar, Echipă, Documente, Rapoarte.

## v0.4 — Backend Foundation

- API REST în Next.js route handlers;
- endpointuri pentru dashboard, proiecte, taskuri, alerte IoT, aprobări, search și audit log;
- repository layer;
- RBAC mock;
- audit log server-side;
- flow alertă IoT → task.

## v0.5 — Database + Prisma Activation

- Prisma schema pentru PostgreSQL;
- provider `mock` / `prisma`;
- endpointuri DB mode/status/seed;
- repository Prisma pregătit;
- fallback mock deployment-safe.

## v0.6 — Auth + RBAC Foundation

- pagină `/login`;
- endpointuri auth/session/login/logout/users/permissions;
- cookie demo HTTP-only;
- roluri și permisiuni centralizate;
- RBAC conectat la endpointurile write existente;
- topbar cu utilizator curent, auth mode și logout demo;
- `.env.example` extins cu `SERVELECT_DEMO_PASSWORD` și `SERVELECT_REQUIRE_AUTH`.

## Următorul pas recomandat

v0.7 — Protected App + Real Auth polish:

- middleware auth opțional;
- protejare pagini sensibile;
- ecran Unauthorized;
- management utilizatori în HR Admin;
- pregătire Auth.js / Microsoft / Google SSO.
