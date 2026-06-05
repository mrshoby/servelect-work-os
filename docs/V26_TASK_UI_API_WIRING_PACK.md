# SERVELECT WORK OS v2.6.0 — Task UI API Wiring Pack

## Scop
v2.6.0 este un build mare orientat pe legarea UI-ului de taskuri/proiecte la API, fără schimbare vizuală majoră. Interfața trebuie să rămână stabilă, dar layer-ul de date începe să fie pregătit pentru API-backed workflow.

## Ce s-a adăugat
- `/admin/task-api-wiring`
- `/admin/release-status` actualizat la v2.6.0
- `/changelog` actualizat la v2.6.0
- `/api/v1/enterprise/task-api-wiring`
- `/api/v1/enterprise/task-api-wiring-health`
- `/api/v1/enterprise/task-ui-api-contract`
- `/api/v1/enterprise/task-api-wiring-plan`
- `apps/web/lib/task-api/client.ts`
- `apps/web/hooks/useTaskApiBridge.ts`
- `apps/web/lib/enterprise/release-dashboard.ts`
- `scripts/task-api-wiring-test.ps1`

## Stadiu real după v2.6
- Website/Web App: ~78%
- Task & Project Core: ~64%
- Backend/API: ~58%
- Database/Prisma/Seed: ~52%
- Auth/RBAC: ~40%
- IoT/Ops: ~36%
- Mobile App: ~22%

## Ce NU este încă final
Taskurile nu sunt încă 100% production DB-backed. UI-ul încă trebuie conectat efectiv la API în paginile principale pentru create/update/delete/status-change.

## Următorul build recomandat
v2.7.0 — API-backed Task Board & Drawer Pack

Obiectiv: `/taskuri` să poată citi din API și să facă update de status prin API sub feature flag, cu optimistic update și rollback.
