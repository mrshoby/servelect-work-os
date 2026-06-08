# SERVELECT WORK OS v5.9.0 — Enterprise Accounts, Team Hierarchy, Role-Based Dashboards & GoodDay Compliance Hardening

Update major peste linia v5.8.0. Scopul este consolidarea Work OS-ului ca aplicație task-first, account-aware și RBAC-aware, fără a șterge modulele existente.

## Principii păstrate
- Nu se pornește de la zero.
- Nu se înlocuiește repo-ul cu mockup static.
- Se păstrează rutele Work OS existente.
- Conturile, echipele, RBAC și dashboardurile sunt integrate cu taskuri/proiecte/aprobări/materiale/audit.
- Scrierile reale rămân shadow-safe/demo până la activarea backendului real.

## Implementat
- 12 roluri enterprise plus compatibilitate cu fluxurile vechi.
- 34 permisiuni cu `key`, `label`, `description`, `module`, `riskLevel`, `defaultRoles`.
- `rolePermissionMap`, `hasPermission`, `roleCan`, `getPermissionsForRole`.
- Helperi de vizibilitate: `canViewTask`, `canEditTask`, `canAssignTask`, `canReassignTask`, `canViewUser`, `canApproveRequest`.
- Rute: `/admin/roles`, `/admin/permissions`, `/admin/users`, `/admin/users/[id]`, `/admin/audit-log`.

## Regulă de siguranță
Toate acțiunile sunt demo/shadow-safe. Nu se activează write-uri distructive reale.
