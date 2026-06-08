# SERVELECT WORK OS v6.2.0 — Department-Aware RBAC, Task Routing & Servelect Org Model

## Scop
v6.2.0 clarifică structura reală Servelect în Work OS: `Audit`, `Administrativ`, `Automatizări`, `Audit energetic`, `Comercial`, `Marketing`, `Producție` și `Management`.

Important: `Audit log` rămâne jurnal tehnic de sistem, iar `Audit` / `Audit energetic` sunt departamente reale cu useri, taskuri, aprobări și vizibilitate proprie.

## Implementat
- model de departamente Servelect;
- useri demo alocați pe departamente;
- taskuri cu `departmentId`, `departmentName`, owner, reviewer, watchers și approval route;
- Super Admin vede tot;
- Admin/Manager Departament vede departamentul lui;
- tehnician vede taskurile proprii și cele unde este implicat;
- client vede doar zona lui;
- managerul vede subordonații și workload-ul;
- reguli de notificări către șefi/admini;
- approvals pe departament;
- status/procente de finalizare în UI și API.

## Rute noi
- `/work-os/department-command`
- `/work-os/department-task-routing`
- `/work-os/department-workload`
- `/work-os/department-approvals`
- `/admin/departments-v2`

## API-uri noi
- `/api/v1/work-os/departments`
- `/api/v1/work-os/departments/tasks`
- `/api/v1/work-os/departments/approvals`
- `/api/v1/work-os/departments/visibility`
- `/api/v1/work-os/departments/completion-status`

## Procente v6.2
- Website/Web App: 97%
- Task & Project Core: 95%
- Backend/API: 88%
- Database/Prisma/Seed: 81%
- Auth/RBAC: 91%
- Department-aware RBAC: 86%
- Notifications/Approvals: 91%
- GoodDay Parity: 86%
- IoT/Ops Integration: 73%
- Mobile App: 58%
