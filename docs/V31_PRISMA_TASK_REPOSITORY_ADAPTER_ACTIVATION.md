# SERVELECT WORK OS v3.1.0 — Prisma Task Repository Adapter Activation

## Scop
v3.1.0 introduce un strat clar de repository adapter pentru taskuri, pregătind trecerea controlată de la `mock-memory` la Prisma.

## Ce adaugă
- Admin page: `/admin/prisma-task-repository-adapter`
- API release: `/api/v1/enterprise/prisma-task-repository-adapter`
- API health: `/api/v1/enterprise/prisma-task-repository-adapter-health`
- API plan: `/api/v1/enterprise/prisma-task-repository-adapter-plan`
- Task repository mode endpoint: `/api/v1/tasks/repository-mode`

## Status real
- Production DB writes: OFF implicit.
- Current mode: `prisma-shadow`.
- Provider activ efectiv: `mock-memory` fallback până la activarea write-gate.

## Următorul build recomandat
v3.2.0 — Prisma Task Read Shadow Verification
