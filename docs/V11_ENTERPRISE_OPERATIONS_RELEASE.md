# SERVELECT WORK OS v1.1 — Enterprise Operations Release

## Scop

v1.1 marchează trecerea de la micro-patch-uri `v1.0.x` la build-uri majore `v1.x`.

Obiectivul principal: stabilizarea aplicației ca Work OS enterprise task-first și pregătirea trecerii la v1.2 Database Activation Pack.

## Ce include v1.1

### Pagini noi

- `/enterprise` — board central pentru release-ul enterprise v1.1
- `/admin/performance` — manifest de audit pentru tot site-ul
- `/admin/roadmap` — roadmap v1.x
- `/admin/quality` — quality gates înainte de fiecare build major

### API noi

- `/api/v1/enterprise/release`
- `/api/v1/enterprise/site-map`
- `/api/v1/performance/audit`
- `/api/v1/performance/deep-audit`

### Fișiere noi

- `apps/web/lib/enterprise/v11.ts`
- `apps/web/lib/performance/audit-routes.ts`
- `docs/AI_CONTINUATION_SERVELECT_WORK_OS.md`
- `docs/V11_ENTERPRISE_OPERATIONS_RELEASE.md`
- `scripts/site-deep-audit.ps1`

### Fișiere schimbate

- `apps/web/app/taskuri/page.tsx`
- `apps/web/components/layout/Topbar.tsx`
- `apps/web/components/layout/Sidebar.tsx`

## Fixuri incluse

- `/taskuri` nu mai folosește `PageHeader actions`.
- `/taskuri` randează doar view-ul activ.
- `/taskuri` limitează tabelul/board-ul pentru performanță.
- Topbar nu mai afișează text peste bara de search.
- Sidebar are linkuri către noile ecrane enterprise.

## Audit după deploy

```powershell
.\scripts\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

Raportul apare în `audit-results/`.

## Următorul build major

v1.2 — Database Activation Pack

Trebuie să includă:

- Prisma/PostgreSQL real
- migrations
- seed real
- audit log persistent
- workflow executions persistente
- Auth.js / Microsoft OAuth foundation
- RBAC persistent
- repository mode `mock | local | database`
