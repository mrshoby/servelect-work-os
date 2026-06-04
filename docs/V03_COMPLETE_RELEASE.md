# SERVELECT WORK OS — v0.3 Complete Release

## Status

Aceasta este versiunea completă v0.3, pregătită ca un singur pachet înainte de trecerea la v0.4.

v0.3 nu introduce backend real încă. Scopul v0.3 este stabilizarea performanței, shell enterprise, polish vizual global și pregătirea aplicației pentru dezvoltarea funcțională serioasă din v0.4.

## Ce include v0.3 complet

### 1. Global Performance Fix

- Recharts eliminate din componentele de overview care puteau produce lag.
- KPI cards și EnergyChart folosesc SVG nativ.
- Store localStorage mutat pe versiune nouă și limitat la volume rezonabile.
- Kanban limitează numărul de carduri randate per coloană.
- TaskTable folosește limitare de rânduri și memoizare.
- Cardurile folosesc `content-visibility: auto`.

### 2. Enterprise Shell Polish

- Sidebar nou, dark navy + verde Servelect.
- Grupare meniu pe Work OS / Operațiuni Servelect / Companie.
- Topbar cu breadcrumb, search, AI Brief, notificări, quick create și user menu.
- Mobile bottom navigation.
- PageHeader și Card polish.
- CSS global pentru look enterprise.

### 3. Dashboard / Command Center stabil

- Homepage light, fără componente grele.
- KPI-uri, inbox, proiecte active, snapshot taskuri, activitate, workload, IoT live și alerts.
- Păstrează direcția vizuală GoodDay/ClickUp/Linear, dar fără freeze.

### 4. Taskuri polish

- Task Table.
- Kanban Board.
- My Work buckets.
- Calendar mock.
- Approvals.
- Task drawer și create modal păstrate în pagina dedicată.

### 5. Proiecte polish

- Timeline / Gantt.
- Listă proiecte.
- Board taskuri.
- Hartă mock.
- Project detail drawer.

### 6. Module operaționale polish

- CRM & Vânzări.
- Monitorizare IoT / Energie.
- Echipamente & Logistică.
- Mentenanță / Dispatch.
- Finanțări, Audituri & ESG.
- HR & Administrare.

## Rute testate ca scop v0.3

- `/`
- `/proiecte`
- `/taskuri`
- `/crm`
- `/iot`
- `/echipamente`
- `/mentenanta`
- `/finantari-esg`
- `/hr-admin`
- `/calendar`
- `/echipa`
- `/documente`
- `/rapoarte`
- `/mobile`

## Reguli păstrate din promptul inițial

- Aplicația rămâne Work OS task-first, nu dashboard static de energie.
- Modulele de energie, stoc, mentenanță, CRM, finanțări și HR sunt tratate ca operațiuni legate de proiecte/taskuri.
- Designul rămâne enterprise SaaS premium: dark navy sidebar, white/light content, carduri, badge-uri, tabele, statusuri, verde Servelect.

## Ce trece în v0.4

v0.4 trebuie să fie o versiune funcțională, nu doar polish UI:

1. Prisma schema + PostgreSQL pregătit.
2. API real pentru proiecte și taskuri.
3. Auth/RBAC inițial.
4. Persistență reală în DB.
5. CRUD complet pentru proiecte/taskuri prin API.
6. Pregătire WebSocket pentru updates live.
7. Structură clară pentru upload documente și audit log.

