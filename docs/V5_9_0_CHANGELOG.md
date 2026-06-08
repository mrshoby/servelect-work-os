# V5_9_0_CHANGELOG.md

## Added
- Enterprise account model and v5.9 demo users.
- Role-aware dashboards for admin/director/manager/project manager/technician/procurement/finance/sales/client.
- Account pages: profile, settings, security, notifications.
- Team pages: overview, status, workload, tasks, members.
- Admin pages: users, user detail, roles, permissions, departments, teams, audit log.
- GoodDay compliance audit page and API.
- RBAC helper library with visibility rules.
- Assignment/reassignment shadow API.
- v5.9 sidebar links and maturity percentages.

## Changed
- Navigation now exposes accounts/team/RBAC/GoodDay audit as first-class Work OS modules.
- Admin users page is consolidated into the v5.9 account cockpit.
- Approvals route is connected to v5.9 role-aware approvals.

## Safety
- No destructive writes enabled.
- Assign/reassign is shadow-safe and returns audit/notification intent.
- Real DB writes remain gated by prior adapter/write-mode mechanisms.
