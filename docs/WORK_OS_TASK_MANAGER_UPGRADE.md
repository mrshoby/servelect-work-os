# SERVELECT WORK OS v5.9.0 — Enterprise Accounts, Team Hierarchy, Role-Based Dashboards & GoodDay Compliance Hardening

Update major peste linia v5.8.0. Scopul este consolidarea Work OS-ului ca aplicație task-first, account-aware și RBAC-aware, fără a șterge modulele existente.

## Principii păstrate
- Nu se pornește de la zero.
- Nu se înlocuiește repo-ul cu mockup static.
- Se păstrează rutele Work OS existente.
- Conturile, echipele, RBAC și dashboardurile sunt integrate cu taskuri/proiecte/aprobări/materiale/audit.
- Scrierile reale rămân shadow-safe/demo până la activarea backendului real.

## Implementat
- Task view extins v5.9: reviewer, createdBy, approvalStatus, watchers, teamId, departmentId.
- Assign/reassign model cu `canAssignTask` și `canReassignTask`.
- API shadow-safe: `/api/v1/work-os/assignments`.
- Team tasks view cu target assignee, audit event și notification queue.
- My Work și role-aware dashboard.
- Integration points: projects, approvals, procurement, inventory, IoT, maintenance, notifications.
