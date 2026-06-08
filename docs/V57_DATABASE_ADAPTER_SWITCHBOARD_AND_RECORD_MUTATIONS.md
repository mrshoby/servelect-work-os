# SERVELECT WORK OS v5.7.0 — Real Database Adapter Switchboard & Record Mutations

v5.7.0 continuă direcția corectă după v5.6: Work OS-ul nu mai este doar UI interactiv sau local persistent records, ci primește un strat vizibil de **adaptere de date, source maps, mutation contracts, write gates, rollback și audit**.

## Scop major

Platforma rămâne task-first conform promptului inițial:

Client → Proiect → Fază → Task → Subtask → Om → Ore → Materiale → Documente → Aprobări → Rapoarte.

v5.7 conectează aceste domenii printr-un switchboard real:

- mock/shared data rămâne fallback sigur;
- localStorage/Zustand rămâne persistence locală pentru demo și lucru offline pregătit;
- Next.js route handlers devin API facade pentru web/mobile;
- Prisma/PostgreSQL este pregătit ca source-of-truth controlat;
- conectorii externi IoT/Stoc/ERP/e-Factura rămân planificați prin adaptere explicite.

## Rute noi

- `/work-os/data-switchboard` — UI principal v5.7
- `/admin/work-os-data-switchboard` — governance admin
- `/api/v1/work-os/data-switchboard` — manifest JSON
- `/api/v1/work-os/data-switchboard/mutations` — POST shadow-safe mutation preview

## Ce include

- adapter cards pentru mock/local/API/Prisma/external connectors;
- source maps pe domenii: tasks, projects, materials, approvals, IoT, maintenance, users;
- mutation contracts cu verb, route, adapter, writeMode, rollback, auditEvent, permission;
- mutation queue vizibilă: ready/shadowed/queued/blocked;
- panou de preview pentru POST shadow mutation;
- admin governance pentru write mode, Prisma readiness și next cutover;
- link în sidebar: **DB Switchboard 5.7**.

## Safety

Scrierile reale nu sunt activate implicit. `SERVELECT_WORK_OS_WRITE_MODE` controlează comportamentul:

- `read-only` — fără scriere;
- `shadow` — payload/audit preview, fără persistare reală;
- `queued` — queue local/safe;
- `enabled` — pregătit pentru scriere reală, dar numai după policy checks.

## Următorul build recomandat

v5.8.0 — Controlled Prisma Cutover, Seed Parity & Live Mutation Audit.

Acesta trebuie să activeze gradual adapterul Prisma: migrations, seed parity, live audit, rollback, write-mode pe domenii și monitorizare după deploy.
