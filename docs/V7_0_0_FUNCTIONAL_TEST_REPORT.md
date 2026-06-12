# V7.0.0 Functional Test Report

| Flow | Status asteptat | Ruta | Persistenta | Observatie |
|---|---:|---|---|---|
| Creez task | PASS local | /taskuri/overview | localStorage | createTask |
| Editez task | PASS local | /taskuri/tabel | localStorage | title/progress/comment |
| Schimb status workflow | PASS local | /admin/workflows | localStorage | validateTransition |
| Tranzitie invalida | PASS local | /admin/workflows | localStorage | notification validation |
| Adaug custom field | PASS local | /admin/custom-fields | localStorage | addCustomField |
| Creez task type | PASS local | /admin/custom-fields | localStorage | addTaskType |
| Creez ticket | PASS local | /taskuri/tickets | localStorage | SLA/requester/assignee |
| Escaladez ticket | PASS local | /taskuri/tickets-notificari | localStorage | status Escaladat |
| Convertesc ticket in task | PASS local | /taskuri/tickets | localStorage | createTaskFromTicket |
| Creez request form | PASS local | /taskuri/forms | localStorage | form builder simplu |
| Trimit request | PASS local | /taskuri/forms | localStorage | convert to ticket |
| Notificare apare | PASS local | /notifications | localStorage | generated notification |
| Marchez notificare citita | PASS local | /notifications | localStorage | mark read/all |
| Creez saved view | PASS local | taskuri panel | localStorage | savedViews list |
| Refresh si persistenta | PASS expected | all v7 routes | localStorage | browser localStorage |
| Mut task pe board | PASS local | /taskuri/board | localStorage | status change |
| Deschid task in table | PASS local | /taskuri/tabel | localStorage | selected task panel |
| Calendar/Gantt | PASS local | /taskuri/calendar-gantt | localStorage | dates/deps/reminders |
| Creez dependency | PASS local | /taskuri/calendar-gantt | localStorage | dependencyIds + Blocat |
| Recurring task | PASS local | /taskuri/calendar | localStorage | recurrenceRule |
| Reminder | PASS local | /taskuri/calendar | localStorage | reminderAt |
| Timer start/stop | PASS local | /taskuri/timesheets | localStorage | time entry |
| Time entry manual | PASS local | /taskuri/timesheets | localStorage | manual entry |
| Submit timesheet | PASS local | /taskuri/timesheets | localStorage | Submitted |
| Manager approve timesheet | PASS local | /taskuri/timesheets | localStorage | Approved |
| Workload recalculat | PASS local | /taskuri/workload | computed | estimate/capacity/time |
| Approval approve/reject | PASS local | /work-os/approvals | localStorage | decision status |
| Automation test | PASS local | /taskuri/automations | localStorage | create ticket/task/notification |
| IoT alert -> ticket | PASS local | /taskuri/automations | localStorage | rule auto_iot |
| Stock low -> procurement task | PASS local | /taskuri/automations | localStorage | rule auto_stock |
| Export CSV raport | PASS local | /taskuri/reports | browser download | CSV blob |
| Schimb user/rol | PASS local | header selector | UI state | server RBAC pending |

## Nota

Acest raport descrie flow-urile implementate in cod. Confirmarea finala cere rularea locala a scripturilor si interactiune browser/screenshot audit.
