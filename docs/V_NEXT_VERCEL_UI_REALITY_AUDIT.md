# V_NEXT Vercel UI Reality Audit

Target reviewed: Taskuri pages from the live Vercel line and uploaded v9.7 screenshots/reports.

## Important note

Screenshot audit PASS only proves a PNG was captured. It does not prove visual quality, GoodDay-level density, or mature Work OS behavior.

## Current reality before v9.8.0

| Page | Exists | Problem | Required correction |
|---|---:|---|---|
| /taskuri | Yes | Too much dashboard/card feeling, not enough workspace density. | Replace with dense command center, hierarchy, view tabs, KPIs, action inbox, task table/board summary and drawer. |
| /taskuri/overview | Yes | Similar to summary page, not daily operating surface. | Make it real command center with Action Required, ticket risk, approvals, workload and activity stream. |
| /taskuri/my-work | Yes | Not enough assigned/created/delegated/watched/mentions sections. | Build daily work inbox with dense lists, timers, comments, attachments and right agenda panel. |
| /taskuri/tickets-notificari | Yes | Ticket/request functionality not mature enough. | Create Ticket Center with SLA, severity, requester, client, project, equipment, technician, escalation and convert-to-task. |
| /taskuri/board | Yes | Board cards too simple, limited metadata and interactivity. | Add workflow columns, WIP counts, metadata-rich cards, status changes and drawer opens. |
| /taskuri/tabel | Yes | Table/list not enterprise-level. | Add multi-select, columns, grouping indicators, bulk actions, export and drawer opens. |
| /taskuri/calendar-gantt | Yes | Planning view not real enough. | Add calendar grid, timeline/Gantt bars, milestones/dependencies and deadline editing. |
| /taskuri/workload-aprobari | Yes | Resource planning too shallow. | Add team workload grid, capacity, allocated hours, overload/underutilized state and approvals. |

## Root cause

Previous builds added surfaces and route/API proof but not enough shared interactive state, task data density, mature drawer behavior, button handlers, local persistence or visual density.

## v9.8.0 correction

v9.8.0 overwrites the canonical Taskuri routes with a dense shared workspace component backed by localStorage, seeded with 52 tasks, 15 tickets, 9 projects, users, comments, files, approvals, notifications, custom fields, dependencies, milestones/workload data and saved views.
