# V15 GoodDay-like Taskuri Design System

Applied in code through `V150GoodDayStructuralTaskuriWorkspace.tsx`.

Core principles:

- One global app sidebar only. The Taskuri page content must not add a second navigation shell.
- Compact topbar with breadcrumb, search, quick create, saved view, export, role selector and feedback.
- Dense cards and tables: small typography, compact spacing, badges, row actions.
- Distinct route families: overview, my-work, inbox, tickets, projects, board, table, calendar, gantt, workload, reports, automations, forms, timesheets, provider, approvals, files.
- Right drawer is allowed because it is contextual task detail, not navigation.
- Each visible area is classified as `REAL_LOCAL_PERSISTENT`, `MOCK_INTERACTIVE`, or provider-ready boundary.
- Buttons must mutate state and show feedback.
