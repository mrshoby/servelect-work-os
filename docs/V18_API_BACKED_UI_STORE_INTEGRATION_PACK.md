# SERVELECT WORK OS v1.8.0 — API-backed UI Store Integration Pack

## Scop

v1.8.0 pregătește integrarea interfeței existente cu API-ul real introdus în v1.7, fără să schimbe designul vizual și fără să forțeze încă trecerea completă de la `localStorage/Zustand` la backend.

Principiul versiunii: **integrare progresivă cu feature flag și fallback**, ca aplicația live să rămână stabilă.

## Ce adaugă

### Pagină nouă

- `/admin/api-ui-store`

Pagina prezintă:

- straturile UI care trebuie mutate la API-backed store;
- contractele API consumate de UI;
- planul de integrare;
- readiness pentru Task UI store, Project UI store, Task Drawer, offline cache și realtime updates.

### API-uri noi

- `/api/v1/enterprise/api-ui-store`
- `/api/v1/enterprise/api-ui-store-health`
- `/api/v1/enterprise/api-ui-store-integration-plan`

### Logică nouă

- `apps/web/lib/enterprise/api-ui-store.ts`

### Script nou de test

- `scripts/api-ui-store-readiness-test.ps1`

## Stadiu tehnic

Providerul UI rămâne hibrid:

- UI actual: Zustand/localStorage + mock data;
- API contract: `/api/v1/tasks`, `/api/v1/projects`;
- pregătire: query/mutation layer pentru v1.9;
- DB real: planificat după activarea completă Prisma/PostgreSQL.

## Ce nu face încă

v1.8.0 nu mută forțat `/taskuri` pe API-backed store. Asta este intenționat, pentru a nu reintroduce blocaje sau regresii vizuale.

## Următorul build recomandat

**v1.9.0 — UI Task Store Feature Flag Pack**

Obiective:

- feature flag `SERVELECT_API_BACKED_UI_STORE`;
- hook de query pentru taskuri;
- mutations pentru create/update/delete task;
- fallback localStorage;
- optimistic updates;
- audit event la acțiuni CRUD.
