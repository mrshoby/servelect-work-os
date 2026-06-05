# SERVELECT WORK OS v2.8.0 — Task Page API Bridge Activation

## Scop
v2.8 este un build de activare sigură pentru pagina `/taskuri`. Nu schimbă designul principal, dar adaugă un bridge vizibil care verifică API-ul de taskuri și board-state.

## Ce adaugă
- `/admin/task-page-api-bridge`
- `/api/v1/enterprise/task-page-api-bridge`
- `/api/v1/enterprise/task-page-api-bridge-health`
- `/api/v1/enterprise/task-page-api-bridge-contract`
- `/api/v1/enterprise/task-page-api-bridge-plan`
- `TaskApiBridgeBanner` injectabil în `/taskuri`

## Status real taskuri după v2.8
Taskurile NU sunt încă 100% production DB-backed. După v2.8 există:
- API bridge vizibil în pagina Taskuri;
- verificare live pentru `/api/v1/tasks` și `/api/v1/tasks/board-state`;
- fallback local păstrat;
- readiness Task & Project Core: ~72%;
- DB writes reale: OFF.

## Următorul build recomandat
v2.9.0 — Real Task Create/Update API UI Activation
