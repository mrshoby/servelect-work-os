# V15 Taskuri Button Functionality Audit

| Button | Page | Handler exists | State change | Persistence | User feedback | PASS/FAIL |
|---|---|---:|---:|---:|---:|---:|
| New Task | all | yes | creates task + opens drawer | localStorage | yes | PASS |
| New Ticket | all/tickets | yes | creates ticket + notification | localStorage | yes | PASS |
| New Request | all/forms | yes | creates request + notification | localStorage | yes | PASS |
| Save View | all/table | yes | adds saved view | localStorage | yes | PASS |
| Export | all/table/reports | yes | downloads CSV | browser/local | yes | PASS |
| Filter/Search | all | yes | filters visible data | UI state | yes | PASS |
| Bulk Action | board/table | yes | selected tasks to Review | localStorage | yes | PASS |
| Assign | table/drawer | yes | updates assignee | localStorage | yes | PASS |
| Approve | approvals/workload | yes | approval Approved | localStorage | yes | PASS |
| Reject | approvals/workload | yes | approval Rejected | localStorage | yes | PASS |
| Escalate | tickets | yes | ticket Escalated | localStorage | yes | PASS |
| Mark read | inbox | yes | toggles read | localStorage | yes | PASS |
| Archive/Dismiss | inbox | yes | archives notification | localStorage | yes | PASS |
| Convert to task | tickets | yes | creates task from ticket | localStorage | yes | PASS |
| Start timer | drawer/timesheets | yes | creates running entry | localStorage | yes | PASS |
| Stop timer | drawer/timesheets | yes | stops entry + tracked time | localStorage | yes | PASS |
| Add comment | drawer | yes | adds comment | localStorage | yes | PASS |
| Add dependency | drawer | yes | adds dependency | localStorage | yes | PASS |
| Attach file mock | drawer/files | yes | adds attachment | localStorage | yes | PASS |
| Open drawer | all task rows/cards | yes | selected task changes | UI/local | yes | PASS |
| Create automation | automations | yes | adds rule | localStorage | yes | PASS |
| Test automation | automations | yes | increments runs | localStorage | yes | PASS |
| Change layout | my-work | yes | Board/List/Split state | UI state | yes | PASS |
| Change density | board/table | yes | changes density state | localStorage through view | yes | PASS |
| Change user/role | topbar | yes | changes visible data | UI state | yes | PASS |
