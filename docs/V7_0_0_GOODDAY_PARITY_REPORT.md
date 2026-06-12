# V7.0.0 GoodDay Parity Report

## Ce s-a imbunatatit

- Tickets/request forms au primit flow-uri interactive: create ticket, escalate, convert to task, form builder simplu, request submit.
- Notifications au read/unread, mark one, mark all si generare din task/ticket/approval/timesheet/automation.
- Workflows au status definitions, transition rules, required fields si approval gates.
- Custom fields si task types au registry local editabil.
- Saved views au create/delete, private/shared, filters, columns, density si persista in localStorage.
- Dependencies, recurrence si reminders sunt editabile pe task.
- Time tracking are start/stop timer, manual entry, timesheet submit si manager approve.
- Workload se calculeaza din estimates, capacity si time entries.
- Reports exporta CSV pentru tasks/tickets/workload/timesheets.
- Automations pot fi testate si genereaza ticket/task/notification.

## Ce este real

REAL_LOCAL_PERSISTENT: taskuri, tickete, request forms, notificari, approvals, workflows config, custom fields, task types, saved views, time entries, timesheets, reports CSV.

## Ce ramane partial/mock

Automations sunt interactive local, dar nu ruleaza ca job backend. RBAC este vizibil si conceptual, dar enforcement complet pe server lipseste. Attachments sunt mock; storage real lipseste.

## Ce lipseste critic

- Backend multi-user real cu Prisma primary writes.
- Server-side notifications/push/email.
- Immutable audit log.
- Real file/document storage.
- Realtime collaboration.
- Screenshot audit rulat si atasat cu PNG reale.
