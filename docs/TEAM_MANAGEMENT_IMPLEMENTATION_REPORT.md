# SERVELECT WORK OS v5.9.0 — Enterprise Accounts, Team Hierarchy, Role-Based Dashboards & GoodDay Compliance Hardening

Update major peste linia v5.8.0. Scopul este consolidarea Work OS-ului ca aplicație task-first, account-aware și RBAC-aware, fără a șterge modulele existente.

## Principii păstrate
- Nu se pornește de la zero.
- Nu se înlocuiește repo-ul cu mockup static.
- Se păstrează rutele Work OS existente.
- Conturile, echipele, RBAC și dashboardurile sunt integrate cu taskuri/proiecte/aprobări/materiale/audit.
- Scrierile reale rămân shadow-safe/demo până la activarea backendului real.

## Implementat
- Departamente: Management, Proiectare, Execuție, Achiziții, Financiar, Vânzări.
- Echipe: Execuție Nord, Project Office, Achiziții & Logistică, Financiar & Billing, Vânzări & Ofertare.
- Helperi: `getDirectReports`, `getAllReports`, `isManagerOf`, `getVisibleUsersForUser`, `getTeamStatusForUser`.
- Rute: `/team`, `/team/status`, `/team/workload`, `/team/tasks`, `/team/members`.
- Managerii văd subordonați/taskuri/workload conform RBAC.
- Tehnicienii văd doar taskurile proprii/alocate/vizibile.
