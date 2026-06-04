# SERVELECT WORK OS — v0.4 Backend Foundation

## Scop

v0.4 introduce fundația backend pentru SERVELECT WORK OS / SERVELECT EMP, fără să rupă deployment-ul Vercel existent și fără să forțeze încă o bază de date reală.

Aplicația rămâne task-first, iar modulele operaționale — IoT, echipamente, mentenanță, CRM, finanțări și HR — sunt pregătite să lucreze prin același sistem de proiecte, taskuri, aprobări și audit log.

## Ce s-a adăugat

### 1. API REST local în Next.js Route Handlers

Endpointuri noi:

```text
GET    /api/v1/health
GET    /api/v1/dashboard
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
GET    /api/v1/iot/alerts
POST   /api/v1/iot/alerts/:id/create-task
GET    /api/v1/approvals
GET    /api/v1/search?q=...
GET    /api/v1/audit-log
```

### 2. Repository layer

Fișier principal:

```text
apps/web/lib/backend/repository.ts
```

Momentan folosește mock data server-side, dar este separat de route handlers ca să poată fi înlocuit ușor cu Prisma.

### 3. API response standardizat

Fișier:

```text
apps/web/lib/backend/api-types.ts
apps/web/lib/backend/http.ts
```

Răspuns standard:

```ts
{ ok: true, data, meta? }
```

sau:

```ts
{ ok: false, error: { code, message, details? } }
```

### 4. RBAC mock pregătit pentru auth real

Fișier:

```text
apps/web/lib/backend/rbac.ts
```

Simulează sesiunea pe baza headerelor:

```text
x-servelect-user-email
x-servelect-role
```

Implicit folosește userul Administrator din mock data.

### 5. Audit log server-side

Fișier:

```text
apps/web/lib/backend/audit.ts
```

Acțiunile create/update/delete sunt logate în memorie. În v0.5/v0.6 se mută în DB real.

### 6. IoT alert → task

Endpoint important pentru cerința task-first:

```text
POST /api/v1/iot/alerts/:id/create-task
```

Exemplu: o alertă „Invertor offline” poate genera automat task de mentenanță.

### 7. Prisma schema pregătită

Fișier:

```text
prisma/schema.prisma
```

Include modelele principale:

- Workspace
- User
- Client
- Project
- Task
- Comment
- TimeEntry
- Document
- Opportunity
- EnergyInstallation
- EnergyTelemetry
- IoTAlert
- Equipment
- InventoryItem
- MaintenanceTicket
- FundingCase
- ApprovalRequest
- AuditEvent

Nu activează încă Prisma runtime, ca să nu stricăm Vercel build-ul și lockfile-ul.

## Testare rapidă API

Local:

```powershell
pnpm --filter @servelect/web dev
```

Apoi:

```powershell
.\scripts\test-api-endpoints.ps1 -BaseUrl "http://localhost:3000"
```

Pe Vercel:

```powershell
.\scripts\test-api-endpoints.ps1 -BaseUrl "https://ADRESA-TA.vercel.app"
```

## Exemple request

### Creare task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Verificare invertor offline","priority":"Critic","projectId":"p4"}'
```

### Creare task din alertă IoT

```bash
curl -X POST http://localhost:3000/api/v1/iot/alerts/al1/create-task \
  -H "Content-Type: application/json" \
  -d '{"assigneeId":"u3","assigneeName":"Mihai Ionescu"}'
```

## Ce NU este încă în v0.4

- PostgreSQL real conectat în producție.
- Prisma Client activat ca dependency runtime.
- Login real / Auth.js.
- JWT / refresh tokens.
- Upload real de fișiere.
- WebSocket real.
- Redis real.

Acestea sunt pentru v0.5+.

## Următorul pas recomandat

**v0.5 — Real Database + Prisma Activation**

- adăugare `prisma` și `@prisma/client` în dependencies;
- generare Prisma Client;
- seed script;
- migrare PostgreSQL;
- repository DB real cu fallback mock;
- conectare Vercel la Postgres/Railway/Supabase/Neon.
