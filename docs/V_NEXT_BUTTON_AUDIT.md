# Button functionality audit — v11.0.0

| Button | Page | Handler | State change | Persistence | PASS/FAIL |
|---|---|---:|---:|---:|---:|
| New Task | all | yes | adds task + opens drawer | localStorage | PASS |
| New Ticket | tickets/header | yes | adds ticket + notification | localStorage | PASS |
| New Request | forms/header | yes | adds request ticket | localStorage | PASS |
| Save View | all | yes | stores saved view | localStorage | PASS |
| Export | table/reports | yes | downloads CSV | browser | PASS |
| Filter | all | yes | filters visible tasks | component state | PASS |
| Reset | toolbar | yes | clears filters/selection | component state | PASS |
| Bulk status | table | yes | selected tasks status update | localStorage | PASS |
| Bulk assign | table | yes | selected tasks assignee update | localStorage | PASS |
| Bulk priority | table | yes | selected tasks priority update | localStorage | PASS |
| Escalate | tickets/drawer | yes | ticket severity/task priority | localStorage | PASS |
| Mark read/unread | inbox | yes | notification read flag | localStorage | PASS |
| Convert to task | inbox/tickets | yes | creates linked task | localStorage | PASS |
| Start/Stop timer | drawer/timesheets | yes | tracked time updates | localStorage | PASS |
| Add comment | drawer | yes | comment appended | localStorage | PASS |
| Add subtask | drawer | yes | checklist appended | localStorage | PASS |
| Add dependency | drawer | yes | dependency appended | localStorage | PASS |
| Attach file mock | drawer | yes | evidence file appended | localStorage | PASS |
| Approve/Reject | workload | yes | approval state changes | localStorage | PASS |
| Archive/Dismiss | inbox | yes | item removed from queue | localStorage | PASS |
| Create/Test automation | automations | yes | rule/run notification | localStorage | PASS |
