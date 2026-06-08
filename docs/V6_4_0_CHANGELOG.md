# V6.4.0 Changelog

## Added
- Fully functional Taskuri redesign component `V64TaskuriFunctionalArea`.
- Department-aware data model for Taskuri 1:1 GoodDay views.
- `/taskuri/inbox` route.
- Functional localStorage state for tasks, tickets, approvals, notifications, saved views and current user.
- Task drawer with edit/comment/checklist/attachment/activity.
- Table multi-select, bulk actions and density switching.
- Board move/status update.
- Ticket queue, status and escalation.
- Approval approve/reject flow.
- Kickoff checklist interaction.
- Mock API route `/api/v1/work-os/taskuri-v64`.

## Changed
- Taskuri sidebar now includes the exact requested submenu structure.
- `/work-os/tasks`, `/work-os/kanban`, `/work-os/calendar`, `/work-os/workload-dashboard` now map to the new Taskuri functional views.
- Package versions are updated to 6.4.0 by the apply script.

## Notes
- This is a functional mock/local persistence layer. Production writes remain controlled by existing adapter/write-mode architecture.
