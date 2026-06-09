# CHANGELOG — SERVELECT WORK OS v6.5.0 GoodDay Parity Functional Core

## Added
- GoodDay-like functional core adapted for Servelect.
- Route `/work-os/goodday-parity`.
- Route `/taskuri/goodday-parity`.
- API route `/api/v1/work-os/goodday-parity`.
- Connected entity model for users, departments, clients, projects, tasks, tickets, notifications, approvals, time entries, saved views and automations.
- LocalStorage persistence layer.
- Role-aware task visibility.
- Task create/edit/delete and task detail panel.
- Ticket create/escalate/convert-to-task.
- Notification center read/unread.
- Approval approve/reject with history.
- Time tracking and timer.
- Workload calculation by capacity vs estimate/tracked time.
- Saved views and filters.
- Mock CSV report export.
- Automation rule model with Servelect operational examples.

## Changed
- Package version update script sets package versions to `6.5.0`.
- Root package scripts are extended with `goodday:parity:api` if possible.

## Not changed
- Taskuri visual design from v6.4.x is not modified.
- Screenshot audit scripts are not changed by this pack.
- GoodDay logos/assets/branding are not copied.

## Remaining
- Backend DB persistence.
- Real form builder.
- Full scheduler for recurrence/reminders.
- Full merge into every existing Taskuri view.
- Real attachment storage.
- Real PDF report export.
