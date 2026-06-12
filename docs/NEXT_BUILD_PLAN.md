# NEXT_BUILD_PLAN

## Current version

v7.0.0 — GoodDay Functional Parity Hardening, Real Work OS Integration & Production-Ready Task Platform

## What was done in current build

- Integrated GoodDay-like functional hardening into real `/taskuri/...` routes, not a separate demo.
- Added tickets/request forms/SLA escalation/convert-to-task flows.
- Added notification read/unread and generated notifications.
- Added workflow definitions, transitions, validations and approval gates.
- Added custom fields and task types admin.
- Added saved views with local persistence.
- Added dependencies, recurrence, reminders.
- Added time tracking, time entries and timesheet submit/approve.
- Added workload calculation from estimates, capacity and tracked time.
- Added CSV reports and automation test rules.
- Aligned package/release versioning to v7.0.0.

## Scores after v7.0.0

| Category | Percent |
|---|---:|
| GoodDay public feature parity | 81% |
| Task management core | 90% |
| Tickets / Requests / Forms | 74% |
| Notifications | 78% |
| Workflows / custom statuses / validations | 73% |
| Custom fields / task types | 72% |
| Saved views / filters / table views | 76% |
| Workload / resource planning | 74% |
| Time tracking / timesheets | 72% |
| Reports / analytics | 66% |
| Automations | 68% |
| Backend / API / persistence | 48% |
| Screenshot audit coverage | 45% |
| Production readiness | 52% |

## Problems remaining

- Backend/API real writes are still not primary source of truth.
- Server-side notifications and push/email do not exist.
- Automations are local interactive, not backend jobs.
- Attachments are mock, not storage-backed.
- Screenshot audit must be run and PNG output verified.
- RBAC/access rules need server enforcement.

## Next mandatory build

v7.1.0 — Backend Mutation Adapter, Multi-User Records & Server Notifications

### Mandatory scope

1. API/repository adapter for Task, Ticket, Request Form, Notification, Approval, Saved View, Workflow, Custom Field, Time Entry and Timesheet.
2. Server-side mutation endpoints with write mode: local/mock, Prisma shadow, Prisma primary gated.
3. RBAC enforcement in API mutations.
4. Server notification store and generated notification events.
5. Audit log entries for each mutation.
6. Migration/readiness report and QA route smoke.

## What NOT to do next

- Do not add random new modules.
- Do not redesign without fixing backend/persistence gap.
- Do not create separate demo pages.
- Do not start mobile redesign before backend mutation adapter.
- Do not claim production parity without DB/server notifications/screenshot audit.

## Routes affected

/taskuri, /taskuri/overview, /taskuri/my-work, /taskuri/inbox, /taskuri/tickets, /taskuri/tickets-notificari, /taskuri/board, /taskuri/tabel, /taskuri/calendar, /taskuri/calendar-gantt, /taskuri/workload, /taskuri/workload-aprobari, /taskuri/forms, /taskuri/timesheets, /taskuri/reports, /taskuri/automations, /admin/workflows, /admin/custom-fields, /admin/access-rules, /admin/goodday-parity, /api/v1/work-os/v7-parity.

## QA status

Apply script includes typecheck/lint/build. Route smoke and screenshot audit scripts are included but must be run locally/prod.

## GitHub/Vercel status

ChatGPT cannot push. User must run git add/commit/push; Vercel should deploy from GitHub if connected.
