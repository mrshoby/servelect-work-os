# SERVELECT WORK OS — v0.3 Enterprise Shell Polish

## Scop

v0.3 începe după stabilizarea globală de performanță. Obiectivul acestei versiuni este să păstrăm aplicația rapidă, dar să o apropiem vizual de un Work OS enterprise modern inspirat de GoodDay, ClickUp, Linear, Asana Enterprise și Monday.

## Ce include acest patch

### 1. Sidebar enterprise nou

- structură pe grupuri: **Work OS**, **Operațiuni Servelect**, **Companie**;
- dark navy premium cu accente Servelect green;
- active state mai clar și mai aproape de aplicațiile SaaS moderne;
- meta-label-uri pentru module: Gantt, board, SLA, pipeline, BI;
- card operațional în partea de jos cu taskuri/alerte/uptime;
- stare collapsed păstrată în localStorage.

### 2. Topbar enterprise nou

- breadcrumb vizual: `SERVELECT EMP / secțiune`;
- titlu pagină contextual;
- search global light pentru proiecte și utilizatori;
- AI Brief demo;
- Quick create dropdown;
- notifications dropdown;
- user menu.

### 3. Mobile shell

- topbar cu meniu mobil;
- bottom nav mobil: Acasă, Taskuri, Nou, Alerte, Profil;
- shell pregătit pentru aplicația mobilă / responsive field OS.

### 4. UI polish global

- PageHeader refăcut ca bloc premium;
- Card are `content-visibility: auto` pentru randare mai eficientă;
- clase noi: `glass-panel`, `enterprise-card`, `soft-chip`;
- suport pentru `prefers-reduced-motion`.

## Fișiere modificate

```text
apps/web/components/layout/Sidebar.tsx
apps/web/components/layout/Topbar.tsx
apps/web/components/layout/AppShell.tsx
apps/web/components/layout/MobileNav.tsx
apps/web/components/ui/Card.tsx
apps/web/app/globals.css
docs/V03_ENTERPRISE_SHELL_POLISH.md
```

## Reguli păstrate

Aplicația rămâne task-first. Modulele CRM, IoT, echipamente, mentenanță, finanțări și HR sunt tratate ca module operaționale care trimit utilizatorul spre taskuri, proiecte, tickete și aprobări, nu ca aplicații separate.

## Următorul pas v0.3.2

După confirmarea că shell-ul nu mai produce lag:

1. polish pentru `/taskuri`;
2. board/list/table mai apropiate de GoodDay;
3. task drawer premium;
4. project detail preview mai serios;
5. păstrare performanță fără Recharts grele pe overview-uri.
