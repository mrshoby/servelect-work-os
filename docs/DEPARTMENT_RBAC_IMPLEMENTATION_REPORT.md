# Department RBAC Implementation Report

## Existing problem
The term `Audit` could be confused with `Audit log`. In Servelect, Audit is also a real department, and Audit energetic is another department.

## Implemented solution
- `Audit log`: system activity history.
- `Audit`: department for internal verification and compliance.
- `Audit energetic`: department for energy audits and ESG/ISO related work.

## Access model
| Role | Access |
|---|---|
| Super Admin | All departments, users, tasks, approvals and governance |
| Admin Departament | Own department users/tasks/workload/approvals |
| Manager Departament | Own department + subordinates |
| Manager Proiect | Projects/tasks where manager/owner/reviewer |
| Tehnician | Assigned/involved tasks only |
| Client | Own projects/documents/tickets only |

## New helpers
- `canViewUser`
- `canViewTask`
- `canAssignTask`
- `getVisibleTasksForUser`
- `getVisibleUsersForUser`
- `getAssignableUsersForTask`
- `getDepartmentDashboard`
