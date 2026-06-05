# SERVELECT WORK OS v1.9.0 — UI Task Store Feature Flag Pack

## Scop

v1.9.0 introduce stratul de feature flags pentru migrarea controlată a interfeței de taskuri/proiecte de la Zustand/localStorage către API-backed store.

Această versiune nu schimbă designul vizual existent. Scopul este să permită rollout controlat, fallback rapid și audit pentru store-ul UI.

## Ce adaugă

### Pagini

- `/admin/ui-task-store`

### API routes

- `/api/v1/enterprise/ui-task-store-flags`
- `/api/v1/enterprise/ui-task-store-health`
- `/api/v1/enterprise/ui-task-store-integration-plan`

### Fișiere

- `apps/web/lib/enterprise/ui-task-store-flags.ts`
- `apps/web/app/admin/ui-task-store/page.tsx`
- `scripts/ui-task-store-feature-flags-test.ps1`

## Feature flags definite

- `task_api_read`
- `project_api_read`
- `task_api_create`
- `task_api_update_status`
- `local_storage_fallback`
- `ui_store_telemetry`
- `kill_switch_api_store`

## Status real

Providerul rămâne hybrid:

- UI stabil existent;
- localStorage fallback activ;
- API routes pentru taskuri/proiecte deja pregătite;
- API writes încă gated;
- DB real încă nu este activ ca provider production.

## Testare după deploy

```powershell
.\scripts\ui-task-store-feature-flags-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Următorul build recomandat

- `v2.0.0 — Enterprise Beta Stabilization`
sau
- `v1.10.0 — DB Provider Wiring Pack`
