# GoodDay public visual and functional reference — v11.0.0

Nu am acces la aplicația completă GoodDay din spatele loginului. Folosesc doar referințele publice: homepage, features, modules, project management, resource planning, workload, Gantt, help/docs publice și materiale publice.

## Pattern-uri publice extrase

- Work OS unificat: proiecte, taskuri, workflow-uri, raportare, timetracking, resurse.
- Sidebar/hierarchy: organizare pe workspace, folders, proiecte și views.
- Views switcher: list/table, board/Kanban, calendar, Gantt/timeline, workload, files, reports.
- Task detail: ownership, status, dates, dependencies, files, comments/activity, custom fields, time.
- Board: coloane workflow, counts, carduri dense, owner, due date, attachments, comments.
- Table: multe coloane, bulk selection, filters, sorting, saved views.
- Workload: resurse pe timeline, capacity vs allocation, task dates și time allocation.
- Gantt: timeline cu start/end dates, dependencies și efecte de planificare.
- Requests/forms/tickets: intake, routing, SLA, conversion to work items.
- Reports: workload, SLA, delivery, evidence, progress, project health.

## Ce trebuie reprodus în Servelect

- Nu branding GoodDay; se păstrează identitate Servelect.
- Densitate de informație mai mare decât carduri simple.
- View-uri multiple pe aceleași date, nu pagini izolate.
- Drawer complex care modifică aceeași stare ca board/table/calendar/workload.
- Butoane cu handler, schimbare de stare și persistență locală/API pilot.
- Audit manual UI: screenshot capturat nu este criteriu final.
