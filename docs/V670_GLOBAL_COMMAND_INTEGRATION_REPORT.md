# SERVELECT WORK OS v6.7.0 — Global Command Integration Report

## Scope
v6.7.0 continues after v6.6.2, where the GoodDay-like functional core was integrated into the real `/taskuri/...` pages.
This build extends the same core into global Work OS surfaces:

- `/work-os/dashboard`
- `/notifications`
- `/work-os/notification-center`
- `/work-os/approvals`
- `/search`
- `/action-center`
- `/api/v1/work-os/global-command`

## GoodDay-like concepts extended
- Notification center with read/unread state.
- Global approvals with approve/reject actions.
- Global search across tasks, tickets, projects, clients and approvals.
- Cross-module action center / task factory.
- Workload signals based on estimates and capacity.
- Activity stream from audit log.
- Automation counters for IoT alarm, stock low, project handover and expiring certifications.

## Servelect adaptation
- Invertor offline -> IoT ticket + technician task + manager notification.
- Stock low -> procurement task.
- Budget overrun -> finance approval.
- Client follow-up -> CRM task.
- ANRE expiring -> HR/admin task.
- Project handover -> checklist task for final project documents.

## Data model
The implementation reuses the v6.5/v6.6 GoodDay parity store and local persistence key:
`servelect-goodday-parity-functional-core-v1`.

## Backend status
Still local/mock interactive. The API route `/api/v1/work-os/global-command` exposes a read-only status payload for health/readiness. Production DB writes are not enabled in this build.
