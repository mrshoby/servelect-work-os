# SERVELECT WORK OS v2.5.0 — DB-backed Task Mutations Pack

## Scop
v2.5.0 este un build mare pentru nucleul Work OS: pregătește mutațiile taskurilor pentru trecerea controlată de la `mock-memory` la `prisma-shadow` și `prisma-write-gated`.

## Ce adaugă
- `/admin/task-mutations`
- `/api/v1/enterprise/task-mutations`
- `/api/v1/enterprise/task-mutations-health`
- `/api/v1/enterprise/task-mutations-plan`
- `/api/v1/enterprise/task-mutation-audit`
- update pentru `/admin/release-status`
- update pentru `/changelog`
- update pentru `/api/v1/enterprise/release-status`
- update pentru procentele website/app/mobile/task core

## Stadiu sincer
Taskurile NU sunt încă 100% production DB active.

Acum avem:
- UI task-first avansat;
- API contracts pentru tasks/projects;
- mock-memory CRUD foundation;
- feature flag strategy;
- repository adapter plan;
- mutation capability matrix;
- audit contract;
- validation plan;
- prisma-shadow/write-gated rollout path.

Lipsește încă:
- DB write active în producție;
- task create/update/delete persistat real în PostgreSQL;
- UI complet legat la API pentru create/status/update;
- subtask/comment/attachment persistence;
- rollback/optimistic update;
- RBAC enforcement pe mutații;
- audit DB persistent.

## Status estimat după v2.5
- Website/Web App: ~76%
- Task & Project Core: ~58%
- Backend/API: ~52%
- Database/Prisma/Seed: ~48%
- Auth/RBAC: ~38%
- IoT/Ops: ~35%
- Mobile App: ~20%

## Următorul build recomandat
v2.6.0 — Task UI API Wiring Pack

Obiectiv: leagă pagina `/taskuri` la API-backed store cu fallback localStorage, create modal -> API, status update -> PATCH API, fără regresie de performanță.
