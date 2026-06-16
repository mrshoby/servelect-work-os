# V_NEXT Functional Flow Report

| # | Flow | Page | Expected result | Persisted | Status |
|---:|---|---|---|---:|---:|
| 1 | Create task | /taskuri | Task inserted and drawer opens | Yes | PASS |
| 2 | Open task drawer | all views | Active task changes | Yes | PASS |
| 3 | Edit status | drawer/board/table | Status updates in shared store | Yes | PASS |
| 4 | Edit assignee | drawer/command/table bulk | Assignee updates | Yes | PASS |
| 5 | Add comment | drawer | Comment and activity added | Yes | PASS |
| 6 | Toggle checklist | drawer | Checklist/progress updates | Yes | PASS |
| 7 | Add dependency | drawer/calendar | Dependency added | Yes | PASS |
| 8 | Start timer | drawer/my-work | Timer state starts | Yes | PASS |
| 9 | Stop timer | drawer | Tracked time increases | Yes | PASS |
| 10 | Verify in My Work | /taskuri/my-work | Shared data visible | Yes | PASS |
| 11 | Move on Board | /taskuri/board | Status changes column | Yes | PASS |
| 12 | Verify in Table | /taskuri/tabel | Same task status visible | Yes | PASS |
| 13 | Select 3 tasks | /taskuri/tabel | Multi-select array updates | Yes | PASS |
| 14 | Bulk action | /taskuri/tabel | Selected rows update | Yes | PASS |
| 15 | Create ticket | /taskuri/tickets-notificari | Ticket created | Yes | PASS |
| 16 | Escalate ticket | /taskuri/tickets-notificari | S1/Escalated + notification | Yes | PASS |
| 17 | Convert ticket to task | /taskuri/tickets-notificari | New linked task created | Yes | PASS |
| 18 | Mark notification read | /taskuri/tickets-notificari | Notification read=true | Yes | PASS |
| 19 | Create saved view | all views | Saved view added | Yes | PASS |
| 20 | Refresh | browser | localStorage reload keeps state | Yes | PASS |
| 21 | Verify saved view persists | all views | Saved view still present | Yes | PASS |
| 22 | Change deadline | drawer/calendar | Due date updates | Yes | PASS |
| 23 | Verify Calendar/Gantt | /taskuri/calendar-gantt | Updated planning source | Yes | PASS |
| 24 | Change estimate | workload/drawer | Estimate changes | Yes | PASS |
| 25 | Verify Workload | /taskuri/workload-aprobari | Allocated hours recalculated | Yes | PASS |
| 26 | Approve/reject | workload approvals | Approval status changes | Yes | PASS |
| 27 | Export CSV | table | CSV download triggered | Browser | PASS |
| 28 | Change user/role | topbar | Role label changes | Yes | PASS |
| 29 | RBAC visible | role/drawer/buttons | Viewer/Manager role state present | Yes | PARTIAL |
| 30 | Vercel check | live | Requires post-deploy user run | n/a | PENDING |

Note: flow 30 must be confirmed after Vercel deployment. Flow 29 is interactive role state now; true backend RBAC remains future work.
