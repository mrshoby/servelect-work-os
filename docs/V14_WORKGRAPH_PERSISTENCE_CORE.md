# SERVELECT WORK OS v1.4.0 — Enterprise WorkGraph Persistence Core

## Scop

v1.4.0 este un build major `v1.X`, nu un hotfix. El adaugă o hartă completă pentru transformarea aplicației SERVELECT WORK OS din MVP task-first bazat pe mock/localStorage într-un model coerent WorkGraph pregătit pentru persistare reală în PostgreSQL/Prisma.

## Ce adaugă

- `/admin/workgraph` — consolă enterprise pentru entități, readiness și plan de migrare.
- `/api/v1/enterprise/workgraph` — manifest complet WorkGraph.
- `/api/v1/enterprise/workgraph-health` — health/readiness pentru WorkGraph.
- `/api/v1/enterprise/workgraph-migration-plan` — faze de migrare spre persistare reală.
- `apps/web/lib/enterprise/workgraph-persistence.ts` — logică centralizată pentru WorkGraph.
- `scripts/workgraph-readiness-test.ps1` — test rapid pentru endpoint-uri.

## De ce este important

Aplicația are multe module: proiecte, taskuri, CRM, IoT, echipamente, mentenanță, finanțări, HR și audit. Fără o hartă centrală a entităților și a tabelelor țintă, fiecare modul riscă să devină izolat. WorkGraph-ul definește legăturile și ordinea de persistare pentru ca aplicația să rămână task-first.

## Entități urmărite

- workspace / tenant
- users / roles / memberships
- projects / milestones / risks
- tasks / dependencies / tags
- subtasks / checklist items
- comments / activity logs
- attachments / documents
- time entries / timers
- approvals
- workflow executions
- audit events
- IoT alerts
- maintenance tickets
- equipment / inventory
- CRM opportunities

## Stadiu după v1.4

- Website: are consolă WorkGraph nouă.
- Backend: încă rulează pe mock/API manifest, dar este pregătit pentru migrare controlată.
- DB real: nu este încă activat complet.
- Următorul build recomandat: v1.5.0 — Auth & RBAC Production Pack.

## Testare după deploy

```powershell
.\scripts\workgraph-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Rute de verificat:

- `/admin/workgraph`
- `/api/v1/enterprise/workgraph`
- `/api/v1/enterprise/workgraph-health`
- `/api/v1/enterprise/workgraph-migration-plan`
- `/admin/database`
- `/taskuri`
