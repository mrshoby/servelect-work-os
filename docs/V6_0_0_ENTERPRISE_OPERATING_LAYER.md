# SERVELECT WORK OS v6.0.0 — Enterprise Operating Layer, Role-Aware Workflow Engine & GoodDay Parity Expansion

## Release direction

This is a major continuation after v5.9.0. The goal is to move beyond separate account/RBAC pages into a connected enterprise operating layer that makes SERVELECT WORK OS behave more like GoodDay, ClickUp, Asana Enterprise and Monday.com.

## Major additions

- Enterprise operating layer under `/work-os/enterprise-operating-layer`.
- Role-aware dashboard shell for Super Admin, Admin, Director, Department Manager, Project Manager, Technician, Finance, Procurement, Sales and Client users.
- Demo account governance model with 10 realistic Servelect users.
- Expanded RBAC matrix with 12 roles and 37 permissions.
- Team visibility helpers: direct reports, all reports, manager checks, visible tasks, assignable users.
- Task assignment/reassignment workflow with permission checks, activity log and notification preview.
- Team command center with status, workload, active/blocked/overdue tasks and availability.
- Notifications center with Work OS event types.
- Approvals inbox for task, procurement, invoice and project phase approvals.
- GoodDay compliance audit with feature scoring.
- Enterprise governance admin page.
- API routes for accounts, assignments, notifications, approvals and compliance.

## Routes

- `/work-os/enterprise-operating-layer`
- `/work-os/accounts-v2`
- `/work-os/team-command`
- `/work-os/role-dashboards`
- `/work-os/notification-center`
- `/admin/enterprise-governance`
- `/api/v1/work-os/enterprise-operating-layer`
- `/api/v1/work-os/enterprise-operating-layer/accounts`
- `/api/v1/work-os/enterprise-operating-layer/tasks/assignments`
- `/api/v1/work-os/enterprise-operating-layer/notifications`
- `/api/v1/work-os/enterprise-operating-layer/approvals`
- `/api/v1/work-os/enterprise-operating-layer/compliance`

## Acceptance alignment

The release directly targets the v5.9 acceptance criteria:

| Criterion | v6.0.0 status |
|---|---|
| Enterprise accounts | Expanded with settings and role data |
| Profile/settings/security readiness | Included in account shell and docs |
| Avatar/fallback initials | Included in operating layer UI |
| Role-aware dashboard | Implemented |
| Extended RBAC | Implemented |
| Manager/subordinate logic | Implemented |
| Team status | Implemented |
| Team workload | Implemented |
| Assign/reassign task | Shadow-safe API + UI preview |
| Manager visibility | Helper-enforced |
| Technician visibility | Restricted by helper logic |
| Client visibility | Restricted to client project pattern |
| Notifications | Implemented |
| Approvals | Implemented |
| GoodDay compliance | Implemented as scorecard |

## Safety notes

This remains shadow-safe/demo-persistent. It does not enable destructive writes or real production DB mutations by default. It is prepared to connect to the v5.7/v5.8 data switchboard and Prisma cutover layers.
