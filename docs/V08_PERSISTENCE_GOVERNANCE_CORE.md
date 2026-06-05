# SERVELECT WORK OS / EMP — v0.8 Persistence & Governance Core

v0.8 continuă v0.7 și mută proiectul spre aplicație enterprise operabilă, fără să rupă deploy-ul Vercel pe mock data.

## Ce adaugă v0.8

1. **System status API**
   - `GET /api/v1/system/status`
   - întoarce versiune aplicație, runtime, provider activ, auth mode, capabilities, RBAC matrix și agregate dashboard.

2. **Readiness API**
   - `GET /api/v1/system/readiness`
   - verifică repository layer, data provider, auth mode, DATABASE_URL și versiunea curentă.

3. **Admin System page**
   - `/admin/system`
   - UI pentru health/readiness, capability map, RBAC matrix și status persistence.

4. **Workflow templates foundation**
   - `GET /api/v1/workflows/templates`
   - `POST /api/v1/workflows/run`
   - pagină `/workflows`
   - template-uri pentru IoT → task, CRM → aprobare, SLA → escaladare, finanțări → documente lipsă.

5. **Vercel-safe persistence strategy**
   - `mock` rămâne implicit.
   - `prisma` se activează doar cu `SERVELECT_DATA_PROVIDER=prisma` și `DATABASE_URL`.
   - Nu se introduce dependență nouă obligatorie în patch, ca să nu forțăm lockfile update.

## Cum testezi după aplicare

```powershell
pnpm --filter @servelect/web build
pnpm --filter @servelect/web dev
```

Testează:

```text
/admin/system
/workflows
/api/v1/system/status
/api/v1/system/readiness
/api/v1/workflows/templates
```

Pentru workflow run:

```powershell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/v1/workflows/run" `
  -ContentType "application/json" `
  -Body '{"templateId":"iot-inverter-offline-task","projectCode":"P-2024-0187","projectName":"Sistem FV 9.6 kWp"}'
```

## Ce NU este încă complet

- Auth.js / SSO real nu este încă integrat.
- Persistarea userilor în DB real este încă pasul următor.
- Prisma real necesită dependențe și lockfile update controlat.
- Mobile offline real nu este încă implementat.

## Următorul pas propus: v0.9

**v0.9 — Database Activation Pack**
- adăugare controlată `prisma` + `@prisma/client`, lockfile actualizat;
- seed complet din mock data;
- users/projects/tasks persistence reală;
- audit log persistent;
- Vercel env checklist pentru PostgreSQL.
