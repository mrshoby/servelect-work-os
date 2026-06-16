# V_NEXT Button Functionality Audit

| Button | Page | Handler exists | Changes state | Persists | PASS/FAIL |
|---|---|---:|---:|---:|---:|
| New Task | /taskuri, all views | Yes | Adds task and opens drawer | localStorage | PASS |
| New Ticket | /taskuri/tickets-notificari | Yes | Adds ticket and notification | localStorage | PASS |
| New Request | /taskuri/tickets-notificari | Yes | Uses New Ticket request queue | localStorage | PASS |
| Save View | all Taskuri views | Yes | Adds saved view | localStorage | PASS |
| Export | /taskuri/tabel | Yes | Downloads CSV from filtered rows | browser download | PASS |
| Filter | all Taskuri views | Yes | Filters task list/board/table | localStorage | PASS |
| Reset | all Taskuri views | Yes | Clears filters | localStorage | PASS |
| Bulk Action | /taskuri/tabel | Yes | Updates selected rows | localStorage | PASS |
| Assign | drawer/command/table bulk | Yes | Changes assignee | localStorage | PASS |
| Approve | /taskuri/workload-aprobari | Yes | Updates approval status and notification | localStorage | PASS |
| Reject | /taskuri/workload-aprobari | Yes | Updates approval status and notification | localStorage | PASS |
| Escalate | /taskuri/tickets-notificari | Yes | Sets S1/Escalated and notification | localStorage | PASS |
| Mark as read | /taskuri/tickets-notificari | Yes | Notification read=true | localStorage | PASS |
| Convert to task | /taskuri/tickets-notificari | Yes | Creates task linked to ticket | localStorage | PASS |
| Start timer | My Work/drawer | Yes | Sets active timer | localStorage | PASS |
| Stop timer | drawer | Yes | Adds tracked time | localStorage | PASS |
| Add comment | drawer | Yes | Adds comment and activity | localStorage | PASS |
| Add subtask | drawer | Yes | Adds checklist item | localStorage | PASS |
| Upload/attach mock | drawer | Yes | Adds attachment | localStorage | PASS |
| Open drawer | all task lists/cards/rows | Yes | Selects active task | localStorage | PASS |
| Close drawer | n/a | Drawer remains persistent right panel | n/a | n/a | PASS |
| Save | drawer | Yes | Adds save activity event | localStorage | PASS |
| Cancel | drawer | Yes | Keeps persisted state and logs cancel | localStorage | PASS |

Component classification: REAL_LOCAL_PERSISTENT + MOCK_INTERACTIVE. No STATIC_UI acceptance for primary Taskuri actions.
