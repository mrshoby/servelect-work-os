# SERVELECT WORK OS — v0.2 Global Performance Fix

## Scop

Acest patch stabilizează versiunea curentă înainte de v0.3. Scopul este să elimine blocările de tip **This page isn't responding** pe homepage, Proiecte și paginile cu KPI/chart-uri, fără să schimbăm direcția vizuală enterprise.

## Ce s-a optimizat

### 1. Chart-uri ușoare, fără Recharts în KPI-uri

Fișiere afectate:

- `apps/web/components/ui/KpiCard.tsx`
- `apps/web/components/charts/EnergyChart.tsx`

Am înlocuit `ResponsiveContainer`, `AreaChart`, `Area`, `Tooltip` și grid-ul Recharts cu SVG nativ. Vizual rămâne aceeași direcție: carduri premium, linii verzi/albastre, fundaluri subtile. Diferența este că browserul nu mai calculează layout-uri Recharts repetat pe fiecare pagină.

### 2. Store local nou și mai sigur

Fișier afectat:

- `apps/web/lib/store.ts`

Schimbări:

- store nou: `servelect-work-os-store-v3`
- ignoră automat vechiul storage `servelect-work-os-store-v2`, care putea conține date locale grele/corupte
- limitează numărul de taskuri persistate runtime la 200
- limitează proiectele la 100
- limitează comentariile, logurile, atașamentele și subtaskurile per task
- nu mai redeschide automat drawers/modals după refresh

### 3. Kanban mai ușor

Fișier afectat:

- `apps/web/components/tasks/KanbanBoard.tsx`

Schimbări:

- grupare taskuri cu `useMemo`
- afișare limitată pe coloană
- indicator pentru taskurile ascunse când există prea multe
- păstrează drag/drop și designul cardurilor

### 4. Task table mai stabil

Fișier afectat:

- `apps/web/components/tasks/TaskTable.tsx`

Schimbări:

- coloanele TanStack sunt memorate cu `useMemo`
- tabelul afișează implicit maximum 80 de rânduri pentru performanță
- apare mesaj dacă există mai multe taskuri decât cele afișate
- filtrele rămân metoda principală pentru liste mari

### 5. Homepage light stabil

Fișier afectat:

- `apps/web/app/page.tsx`

Homepage-ul nu mai montează componente grele. Este un Command Center rapid, cu link spre paginile dedicate pentru taskuri/proiecte.

## După aplicare

După commit/push, Vercel va face redeploy automat.

Dacă browserul încă păstrează date vechi, se poate curăța din consola browserului:

```js
localStorage.removeItem("servelect-work-os-store-v2");
localStorage.removeItem("servelect-work-os-store-v3");
location.reload();
```

## Status înainte de v0.3

După acest patch, continuarea recomandată este:

- v0.3.1 — verificare stabilitate live
- v0.3.2 — Enterprise shell polish: sidebar + topbar
- v0.3.3 — Task Center polish
- v0.3.4 — Project Center polish
- v0.3.5 — Mobile responsive polish
