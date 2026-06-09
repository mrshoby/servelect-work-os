# SERVELECT WORK OS v6.6.0 - Functional Test Report

## Required flow coverage

| Flow | Real route | Expected result | Status in package |
|---|---|---|---|
| Open overview | `/taskuri/overview` | Integrated component loads | Scripted smoke |
| Open task drawer | all task routes | Drawer opens with task details | Implemented |
| Change status | drawer/table/board | Store updates and persists | Implemented |
| Add comment | drawer | Comment + activity log | Implemented |
| My Work buckets | `/taskuri/my-work` | Assigned/created/watched/overdue | Implemented |
| Create ticket | `/taskuri/tickets-notificari` | Ticket added to state | Implemented |
| Escalate ticket | `/taskuri/tickets-notificari` | Status escalated + notification | Implemented |
| Mark notification read | `/taskuri/tickets-notificari` | read=true persisted | Implemented |
| Convert ticket to task | `/taskuri/tickets-notificari` | Task created and linked | Implemented |
| Move board task | `/taskuri/board` | Status changed by drag/drop | Implemented |
| Bulk table action | `/taskuri/tabel` | Selected task updates | Implemented |
| Calendar/Gantt click | `/taskuri/calendar-gantt` | Drawer opens | Implemented |
| Change deadline | `/taskuri/calendar-gantt` | dueDate updates | Implemented |
| Approve/reject | `/taskuri/workload-aprobari` | Approval state/history update | Implemented |
| Workload calculation | `/taskuri/workload-aprobari` | Capacity vs estimate | Implemented |
| Refresh persistence | all | localStorage keeps state | Implemented |

Run: `scripts/work-os-v660-taskuri-goodday-core-functional-test.ps1` after local server start.
