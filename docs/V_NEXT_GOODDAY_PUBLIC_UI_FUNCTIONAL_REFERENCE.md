# V15 GoodDay Public UI Functional Reference

Legal rule: do not copy GoodDay logo, brand, commercial copy or assets. Use public pages only as product-structure reference.

Extracted public patterns to replicate structurally in SERVELECT Taskuri:

- Work management platform organized around workspaces, views, Action Required, My Work, resource planning, project hierarchy and modules.
- 20+ view pattern: List, Table, Board, Calendar, Gantt, Workload, My Work, portfolio/files/discussions style views.
- My Work pattern: Inbox, planned Today/Upcoming items, Board/List/Split layouts, scheduling and daily prioritization.
- Resource planning pattern: task-based workload, capacity by user/project/team, daily/weekly views, allocations and conflicts.
- Modules pattern: tasks/projects, task types, workflows, dependencies, recurrence, custom actions, validations, reminders, attachments, priorities, multi-view suite, resource planning.
- Enterprise plan patterns: custom access rules, custom reports, risk matrix, custom roles, APIs, SAML/SSO, advanced security.

SERVELECT implementation mapping:

- Do not repeat one enterprise table on every route.
- Each Taskuri route must map to a distinct GoodDay-like pattern: overview command center, My Work planning, Inbox triage, Tickets/request center, Active/Future/Completed projects, Board, Table, Calendar/Gantt, Workload, Reports, Automations, Forms, Timesheets, Provider/Mutation Queue, Approvals/SLA, Files/Evidence.
- All buttons must mutate local persistent state or provider-ready mock state and show visible feedback.
