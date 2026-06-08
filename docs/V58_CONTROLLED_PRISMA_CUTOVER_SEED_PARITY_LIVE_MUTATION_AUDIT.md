# SERVELECT WORK OS v5.8.0 — Controlled Prisma Cutover, Seed Parity & Live Mutation Audit

v5.8.0 este un update major, conceput ca următorul pas după v5.7.0 Database Adapter Switchboard.

Scopul nu este să adauge doar câteva linii, ci să creeze un strat operațional complet pentru trecerea controlată spre date reale:

- Prisma/PostgreSQL cutover pe domenii
- seed parity dashboard
- mutation contracts cu write gates
- audit live pentru mutații
- rollback drills
- wave plan pentru activare graduală
- admin control room
- status/procente actualizate pe site

## Rute noi

- `/work-os/prisma-cutover`
- `/work-os/seed-parity`
- `/work-os/mutation-audit`
- `/work-os/rollback-center`
- `/admin/work-os-prisma-cutover`
- `/api/v1/work-os/prisma-cutover`
- `/api/v1/work-os/prisma-cutover/status`
- `/api/v1/work-os/prisma-cutover/parity`
- `/api/v1/work-os/prisma-cutover/mutations`
- `/api/v1/work-os/prisma-cutover/rollback`

## Domenii acoperite

- tasks
- projects
- users
- materials
- approvals
- CRM
- IoT
- maintenance
- funding
- audit

## Write safety

v5.8.0 nu activează scrieri reale periculos.

Scrierile rămân controlate de:

```bash
SERVELECT_WORK_OS_WRITE_MODE=off|shadow|pilot|production
```

Default: `off`.

## Status estimativ vizibil

- Website/Web App: 94%
- Task & Project Core: 90%
- Backend/API: 80%
- Database/Prisma/Seed: 74%
- Auth/RBAC: 73%
- IoT/Ops: 64%
- Mobile App: 50%

## Următorul build recomandat

v5.9.0 — Mobile Offline Field Operations, QR Evidence & Sync Queue
