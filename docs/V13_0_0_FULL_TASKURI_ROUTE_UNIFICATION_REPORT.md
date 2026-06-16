# v13.0.0 — Full Taskuri Route Unification, Single Sidebar Enforcement & Screenshot Delivery

## De ce există acest build

v12.0.3 a reparat rutele principale și markerii live, dar source audit a arătat că multe rute istorice `/taskuri/*` nu erau încă legate la workspace-ul single-sidebar. Acest build rescrie toate paginile existente sub `apps/web/app/taskuri/**/page.tsx` către o singură componentă canonică: `V130UnifiedTaskuriWorkspace`.

## Ce se îmbunătățește

- Eliminare completă a shell-urilor vechi din toate rutele Taskuri existente.
- Rute istorice v9/v10/v11/v12 legate la același workspace canonic.
- UI dens: tabel enterprise, board, ticket queue, workload, drawer de task, acțiuni interactive.
- Screenshot delivery real prin `audit-v1300-screenshots-manual.mjs`.
- Source audit strict pentru toate paginile Taskuri.

## Progres către 100%

| Categorie | Înainte v13 | După v13 țintă | Rămâne până la 100% |
|---|---:|---:|---|
| Single canonical sidebar | 92% | 100% | confirmare live pe toate rutele istorice |
| GoodDay visual similarity | 80% | 82% | polish fin și comparație manuală screenshot |
| Taskuri UI density | 88% | 90% | date reale DB/provider |
| Functional parity | 81% | 84% | drag/drop/Gantt/backend mutation real |
| Buttons | 91% | 93% | browser click QA complet |
| Persistence | 80% | 82% | DB/provider mutation adapter |
| QA confidence | 76% | 80% | screenshot zip + flow audit după deploy |
| Production readiness | 63% | 65% | RBAC, audit ledger, rollback gates |

## Nu este final

Acest build nu declară 100%. Următorul build major poate începe numai după ce:
1. build local trece;
2. source audit arată 0 pagini Taskuri nelegate;
3. route/API smoke trece;
4. screenshot zip este generat;
5. Vercel confirmă markerii single-sidebar și lipsa markerilor vechi.
