# V_NEXT GoodDay UI Reference Audit

Source scope: public GoodDay pages only. I do not have access to the full GoodDay application behind login, private customer workspaces, or non-public assets. This audit therefore uses only public pages, public feature descriptions, public module pages and public help pages.

## Access limitation

Nu am acces la aplicația completă GoodDay din spatele loginului. Pot folosi doar referințele publice.

## Public GoodDay patterns observed

- GoodDay positions itself as a complete work management platform with tasks, projects, workflows, reporting, dashboards, custom fields and time tracking.
- Public features describe My Work, unlimited project hierarchy, portfolios, custom statuses/workflows, dependencies, recurring tasks, Action Required, request forms, custom work items, subtasks, attachments, custom fields, tags, checklists, comments/messages, progress tracking, estimates/time reports, multiple assignments and due dates.
- Public work views include Task List, Task Table, Board, Gantt, Workload, Files, Calendar and Event List.
- Public management views include Events Summary, What's Done, Pastdue, Project Portfolio, Tasks By User, Priorities and Activity Stream.
- Public workload help describes a timeline view with full-screen controls, date range, time allocation mode, filters, settings, user backlog, quick navigation and planned tasks/events.

## UI structure to reproduce in Servelect

1. **Dense workspace shell**
   - left tree/hierarchy with folders, portfolios, projects and access context;
   - center workspace with view switcher and dense data panels;
   - right context panel or drawer for selected task/activity/files.

2. **Views switcher**
   - Overview, My Work, Inbox, Board, Table, Calendar, Gantt, Workload, Tickets, Reports;
   - views must switch around the same task data, not different disconnected pages.

3. **Task list/table density**
   - many rows;
   - columns for ID, title, project, type, status, priority, assignee, owner, dates, estimates, tracked time, dependencies, tags, custom fields, comments and attachments;
   - multi-select and bulk actions.

4. **Board density**
   - workflow columns with counts and WIP rules;
   - task cards with real metadata: project, assignee, priority, deadline, comments, attachments, checklist and blockers.

5. **Task drawer**
   - editable title, status, priority, assignee, owner, watchers, dates, estimates, custom fields, tags;
   - subtasks/checklist, dependencies, comments, activity log, attachments/files, linked tickets/approvals, time entries, reminders and automation history;
   - save/cancel and validation.

6. **Workload/resource planning**
   - user rows and timeline columns;
   - capacity vs allocated hours;
   - overload/underutilized state;
   - approvals and leave/absence mock.

7. **Tickets / requests**
   - queue with severity, SLA, requester/client/project/equipment/technician;
   - escalation and conversion to task;
   - notifications generated from ticket actions.

## Required Servelect-specific adaptation

The GoodDay structure must be translated into Servelect-specific operational content: photovoltaic projects, IoT alerts, field interventions, PIF/reception documents, procurement, stock/logistics, audit energetic, CRM/offers, certifications and pontaj/workload.

## Acceptance direction for v9.8.0

v9.8.0 must stop validating pages only by HTTP 200. It must add source, button, flow and manual UI audits that fail if the Taskuri pages are sparse, static, or disconnected from state.
