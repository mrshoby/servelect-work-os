# v6.4.7 Functional audit

Funcționalități păstrate/verificate static în cod:

- Search global în Taskuri actualizează filtrul `query`.
- Saved views au strip vizual + dropdown și se salvează în localStorage.
- Board permite schimbare status prin `changeTaskStatus`.
- Tabel are multi-select, bulk status/priority/assignee/delete, density și pinned columns stateful.
- Task Drawer permite titlu, descriere, status, prioritate, assignee, owner, deadline, estimare, comments, checklist, attachments mock și activity log.
- Tickets permit status update, escalate, mark unread false.
- Calendar & Gantt deschid taskuri prin click pe event/bară și filtrează prin CalendarFilters.
- Workload approvals permit approve/reject și calculează heatmap din estimate/tracked demo.
- Persistența folosește `servelect-work-os-v64-taskuri-functional-state` în localStorage.

Limitări rămase:

- Screenshot 1:1 trebuie verificat după deploy real.
- DnD complet și resize Gantt real rămân pentru backend/UI avansat viitor; status updates sunt funcționale prin UI controls.
- Backend real complet nu este introdus; este mock/localStorage API-ready.
