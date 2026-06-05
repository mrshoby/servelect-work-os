# SERVELECT WORK OS / EMP — v0.9 Action Center & Audit Automation

v0.9 continuă direcția Work OS task-first și adaugă un strat operațional care leagă modulele existente într-o singură coadă de acțiuni.

## Ce adaugă v0.9

1. **Action Center**
   - pagină nouă: `/action-center`
   - API nou: `GET /api/v1/action-center`
   - agregă taskuri, alerte IoT, aprobări, tickete, finanțări și riscuri de proiect.
   - calculează urgență, status, owner, scadență și următorul pas recomandat.

2. **Audit & Governance Log**
   - pagină nouă: `/admin/audit`
   - API nou: `GET /api/v1/audit/events`
   - afișează evenimente de audit runtime + evenimente governance v0.9.
   - pregătit pentru persistență reală în modelul `AuditEvent` din Prisma.

3. **Workflow Execution Log**
   - API nou: `GET /api/v1/workflows/executions`
   - fiecare `POST /api/v1/workflows/run` creează și o execuție workflow.
   - răspunsul workflow include `execution` și `auditEvent`.

4. **System Status v0.9**
   - `GET /api/v1/system/status` include acum summary pentru Action Center și workflow executions.
   - `GET /api/v1/system/readiness` verifică Action Center și workflow execution log.
   - include fixul pentru `repository.dashboard()` sync/async prin `Promise.resolve(...)`.

5. **Sidebar update**
   - adaugă link pentru `Action Center`.
   - adaugă link pentru `Workflow-uri`.
   - adaugă link pentru `System status`.
   - adaugă link pentru `Audit log`.

## Cum testezi

```powershell
pnpm --filter @servelect/web build
pnpm --filter @servelect/web dev
```

Testează în browser:

```text
/action-center
/admin/audit
/admin/system
/workflows
/api/v1/action-center
/api/v1/audit/events
/api/v1/workflows/executions
/api/v1/system/status
/api/v1/system/readiness
```

## Exemplu workflow run

```powershell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/v1/workflows/run" `
  -ContentType "application/json" `
  -Body '{"templateId":"iot-inverter-offline-task","projectCode":"P-2024-0187","projectName":"Sistem FV 9.6 kWp"}'
```

## Ce NU este încă complet

- Auditul și workflow executions sunt încă mock/runtime memory.
- Nu există încă persistență reală PostgreSQL pentru execution log.
- Nu există încă integrare reală MQTT/Modbus/TimescaleDB.
- Mobile offline real rămâne pentru o etapă următoare.

## Următorul pas propus: v1.0

**Database Real Activation**
- activare controlată Prisma/PostgreSQL;
- seed real pentru users/projects/tasks;
- `AuditEvent` persistent;
- `WorkflowExecution` persistent;
- env checklist Vercel/Railway;
- script de migrare și seed.
