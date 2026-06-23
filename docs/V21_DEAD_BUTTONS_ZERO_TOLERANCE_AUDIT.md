# V21 Dead Buttons Zero Tolerance Audit

| Page | Button | Handler exists | State changes | Updates connected views | Persists | PASS/FAIL |
|---|---|---:|---:|---:|---:|---|
| /taskuri + overview | New Task | DA | DA | DA | DA, Zustand persist | PASS source |
| /taskuri + overview | New Ticket | DA | DA | DA | DA, Zustand persist | PASS source |
| /taskuri + overview | New Request | DA | DA | DA | DA, Zustand persist | PASS source |
| /taskuri + overview | Save View | DA | DA | DA | DA, localStorage | PASS source |
| /taskuri + overview | Export | DA | DA feedback/download | DA | Browser download | PASS source |
| toate rutele | Search/filter/status/priority/assignee | DA | DA | DA | Zustand persist | PASS source |
| /taskuri/inbox | Mark read | DA | DA | DA badge | localStorage | PASS source |
| /taskuri/inbox | Mark all read | DA | DA | DA badge | localStorage | PASS source |
| /taskuri/tickets | Escalate | DA | DA | DA | Zustand persist | PASS source |
| /taskuri/tickets | Convert to Task | DA | DA | DA | Zustand persist | PASS source |
| /taskuri/board | Status select/move | DA | DA | Board/Table/Drawer | Zustand persist | PASS source |
| /taskuri/tabel | Bulk Review/Bulk Done | DA | DA | Board/Table/My Work | Zustand persist | PASS source |
| /taskuri/calendar-gantt | +14 zile | DA | DA | Calendar/Gantt/Table | Zustand persist | PASS source |
| /taskuri/workload-aprobari | Approve/Reject | DA | DA | Board/Table/Workload | Zustand persist | PASS source |

Acest audit este source-level. După deploy trebuie completat cu screenshot/flow audit real.
