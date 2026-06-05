# SERVELECT WORK OS v1.0 — Enterprise Release Baseline

Această versiune marchează trecerea din seria v0.x în baseline-ul v1.0 al aplicației SERVELECT WORK OS / SERVELECT EMP.

v1.0 nu înseamnă că toate modulele sunt deja conectate la backend real, ci că aplicația are o bază coerentă de Work OS enterprise: layout, module, Action Center, workflow-uri, audit/governance, protected app foundation și o consolă de release/readiness.

## Adăugat în v1.0

- `/admin/release` — Release Console pentru versiunea v1.
- `/api/v1/release/manifest` — manifest JSON cu versiune, milestones, checklist și roadmap.
- `/api/v1/release/checklist` — checklist de producție cu release gates.
- `apps/web/lib/release/manifest.ts` — sursa centrală pentru release gates, manifest și roadmap.
- `SERVELECT_APP_VERSION = 1.0.0`.
- Sidebar actualizat cu intrarea **Release v1**.
- Action Center import fix: `approvals` în loc de `approvalRequests`.

## Ce este considerat gata în v1.0

- Baza Work OS task-first.
- Module principale integrate într-un singur produs.
- Dashboard, proiecte, taskuri, CRM, IoT, echipamente, mentenanță, ESG, HR/Admin.
- Protected app/RBAC foundation.
- Action Center + audit automation foundation.
- API-uri de status/readiness/release.
- Deploy Vercel-safe fără DB obligatorie.

## Ce rămâne pentru v1.x

### v1.1 Database Activation Pack

- Prisma/PostgreSQL activ real.
- Seed real pentru users/projects/tasks.
- Persistență pentru audit log.
- Persistență pentru workflow executions.
- Persistență pentru user management.
- Migration/readiness gate.

### v1.2 Mobile Field Operations Pack

- Expo mobile real pentru tehnicieni.
- Checklist teren.
- QR scanner.
- Foto obligatorii.
- Offline mutation queue.
- Sync la reconectare.

### v1.3 IoT Telemetry Pack

- Ingestie MQTT/Modbus/API.
- TimescaleDB telemetry.
- Alert rules persistente.
- Alertă IoT → task/ticket real.

## Testare după deploy

- `/admin/release`
- `/admin/system`
- `/action-center`
- `/admin/audit`
- `/workflows`
- `/api/v1/release/manifest`
- `/api/v1/release/checklist`
- `/api/v1/system/status`
- `/api/v1/system/readiness`
