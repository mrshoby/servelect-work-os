# V21 Taskuri Functional Flow Audit

| Flow | Expected | Actual | Duplicate UI? | PASS/FAIL |
|---|---|---|---|---|
| Click New Task | un singur modal | `data-testid=v21-single-taskuri-modal` | NU în source | PASS source |
| Creez task | apare în store | createTask din registry unic | NU | PASS source |
| Task în Table | route `/taskuri/tabel` citește același store | vizibil după persist | NU | PASS source |
| Task în Board | route `/taskuri/board` citește același store | vizibil după persist | NU | PASS source |
| Open Drawer | doar TaskDrawer existent | `setSelectedTask(id)` | NU | PASS source |
| Edit status | store updateTaskStatus | reflectă Board/Table | NU | PASS source |
| Edit assignee | drawer existent updateTask | reflectă My Work/Workload | NU | PASS source |
| Add comment | addComment store | activity/comment drawer | NU | PASS source |
| Start/Stop Timer | store timer | trackedHours actualizat | NU | PASS source |
| Click New Ticket | un singur modal | kind=ticket în același modal | NU | PASS source |
| Ticket în Ticket Center | tags/title/priority filtrate | `/taskuri/tickets` | NU | PASS source |
| Escalate ticket | priority Critic + tag escalated | updateTask | NU | PASS source |
| Convert ticket to task | title/tags update | updateTask | NU | PASS source |
| Save view | localStorage v21 | saved views panel | NU | PASS source |
| Refresh | Zustand/localStorage persist | persistă local | NU | PASS source |
| Move task in Board | status select | Table reflectă | NU | PASS source |
| Due date update | +14 zile | Calendar/Gantt reflectă | NU | PASS source |
| Estimate/workload | estimate în drawer | Workload recalculat | NU | PASS source |
| Mark notification read | localStorage inbox | badge unread scade | NU | PASS source |

PASS final necesită rulare locală și verificare live.
