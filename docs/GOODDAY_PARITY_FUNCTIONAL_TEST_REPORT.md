# GOODDAY_PARITY_FUNCTIONAL_TEST_REPORT

| Flow | Expected result | Status |
|---|---|---|
| Create task | New task appears in task table, selected detail panel changes, notification/audit added | Implemented; verify locally |
| Edit task | Title/description/status/priority/assignee/deadline update in UI and localStorage | Implemented; verify locally |
| Change status | Task status changes in table and board grouping | Implemented; verify locally |
| Add comment | Comment appears and activity log updates | Implemented; verify locally |
| Add checklist item | New checklist item appears | Implemented; verify locally |
| Toggle checklist | Progress recalculates | Implemented; verify locally |
| Add time entry | Time entry count and workload/tracked time update | Implemented; verify locally |
| Start/stop timer | Timer creates time entry | Implemented; verify locally |
| Create ticket | Ticket appears, notification generated | Implemented; verify locally |
| Escalate ticket | Ticket status becomes Escaladat, manager notifications added | Implemented; verify locally |
| Convert ticket to task | New task created and linked to ticket | Implemented; verify locally |
| Mark notification read | Notification state changes to read | Implemented; verify locally |
| Approve/reject approval | Approval status changes, task approval state updates | Implemented; verify locally |
| Apply filter | Task table and board update from filters | Implemented; verify locally |
| Save/apply view | Saved view persists and restores filters | Implemented; verify locally |
| Workload calculation | Utilization is calculated from estimates/capacity/tracked time | Implemented; verify locally |
| Export report CSV | CSV appears in report textarea | Implemented; verify locally |
| Run automation | Automation run count changes and creates task/ticket depending on rule | Implemented; verify locally |
| IoT alert example | IoT automation can create ticket | Implemented mock; verify locally |
| Stock low example | Stock automation can create task | Implemented mock; verify locally |
| RBAC/user switch | Visible tasks change based on current user/role/department | Implemented; verify locally |
