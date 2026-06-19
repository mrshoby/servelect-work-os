# V15 Taskuri Static UI Elimination Report

Static UI is not accepted. All visible blocks in the V15 component are classified:

| Area | Classification | Reason |
|---|---|---|
| Store seed/state | REAL_LOCAL_PERSISTENT | localStorage read/write with seeded Servelect data |
| Overview KPI/action panels | MOCK_INTERACTIVE | derived from live local state |
| My Work lanes | MOCK_INTERACTIVE | filters tasks by assignee/priority, open drawer |
| Inbox triage | REAL_LOCAL_PERSISTENT | read/archive/schedule mutate state |
| Tickets center | REAL_LOCAL_PERSISTENT | create/escalate/convert mutate state |
| Project views | MOCK_INTERACTIVE | project data computed and linked to tasks |
| Board | REAL_LOCAL_PERSISTENT | drag/drop updates task status |
| Table | REAL_LOCAL_PERSISTENT | inline status/assignee/date/estimate edits |
| Calendar/Gantt | MOCK_INTERACTIVE | derived from task due dates/dependencies |
| Workload | MOCK_INTERACTIVE | calculated from estimates/capacity |
| Drawer | REAL_LOCAL_PERSISTENT | editable fields/comments/checklist/deps/files/timer |
| Reports | MOCK_INTERACTIVE | analytics derived from state + export |
| Automations | REAL_LOCAL_PERSISTENT | create/test rule updates state |
