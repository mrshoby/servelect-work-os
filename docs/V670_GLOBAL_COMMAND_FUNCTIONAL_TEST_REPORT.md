# SERVELECT WORK OS v6.7.0 — Functional Test Report Template

| Flow | Route | Expected | Status |
|---|---|---|---|
| Open global dashboard | `/work-os/dashboard` | HTTP 200 and dashboard cards visible | To verify locally |
| Open notification center | `/notifications` | Notifications list visible | To verify locally |
| Mark notification as read | `/notifications` | Notification state changes in localStorage | To verify manually |
| Open approvals center | `/work-os/approvals` | Pending approvals visible | To verify locally |
| Approve/reject approval | `/work-os/approvals` | Approval and linked task update | To verify manually |
| Global search | `/search` | Search returns tasks/tickets/projects/clients | To verify manually |
| Run IoT command | `/action-center` | Ticket + task + notification created | To verify manually |
| Run stock low command | `/action-center` | Procurement task created | To verify manually |
| Workload mini | `/work-os/dashboard` | Capacity/assigned load displayed | To verify locally |
| API health | `/api/v1/work-os/global-command` | JSON status returned | To verify locally |
