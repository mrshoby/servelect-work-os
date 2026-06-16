# V_NEXT_BUTTON_AUDIT

| Button | Page | Handler | State change | Persistence | PASS/FAIL |
|---|---|---:|---:|---:|---:|
| New Task | all Taskuri routes | yes | yes | localStorage | PASS |
| New Ticket | all Taskuri routes | yes | yes | localStorage | PASS |
| Export CSV | all Taskuri routes | yes | downloads CSV | browser | PASS |
| Bulk to Review | table/list | yes | status changes | localStorage | PASS |
| Filter Blocked | table/list | yes | query changes | UI state | PASS |
| Reset | table/list | yes | query clears | UI state | PASS |
| Open task | table/board | yes | drawer target changes | UI state | PASS |
| Status select | drawer/table | yes | status changes | localStorage | PASS |
| Assignee select | drawer/table | yes | assignee changes | localStorage | PASS |
| Due date edit | drawer/table | yes | due date changes | localStorage | PASS |
| Estimate edit | drawer/table | yes | workload changes | localStorage | PASS |
| Checklist progress | drawer | yes | checklist changes | localStorage | PASS |
