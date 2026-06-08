# v6.4.2 — Visual 1:1 comparison report for Taskuri references

Important: acest raport este făcut prin inspecția fișierelor implementate și a celor 10 imagini ground-truth. Scorul final de pixel-perfect trebuie confirmat prin screenshot local/browser după ce buildul trece.

| Imagine | Pagina implementată | Similaritate vizuală estimată | Structură 1:1? | Ce lipsește / risc | Ce trebuie corectat dacă screenshotul local nu trece |
|---|---|---:|---|---|---|
| `01_taskuri_overview.png` | `/taskuri` | 90% | Aproape | Posibile diferențe fine de spacing/card widths; topbar depinde de shell-ul existent | Ajustare spacing grid, înălțimi KPI, densitate paneluri |
| `02_taskuri_my_work.png` | `/taskuri/my-work` | 90% | Aproape | Agenda/mențiuni/create quick sunt implementate ca panouri mock-interactive; trebuie verificat vizual cu screenshot | Ajustare dimensiuni coloană dreapta și tabele |
| `03_taskuri_tickets_notificari.png` | `/taskuri/tickets` | 91% | Aproape | Coada ticketelor + right panels există; mici diferențe posibile la iconuri și tab counts | Aliniere taburi și densitate tabel |
| `04_taskuri_proiecte_active.png` | `/taskuri/proiecte-active` | 90% | Aproape | Chat proiect și documente sunt mock-interactive; calculul progress vine din datele task | Ajustare linii proiect/initiative și right rail |
| `05_taskuri_proiecte_viitoare.png` | `/taskuri/proiecte-viitoare` | 90% | Aproape | Checklist kickoff este funcțional; dependency flow este vizual mock | Ajustare flow dependințe și timeline |
| `06_taskuri_proiecte_finalizate.png` | `/taskuri/proiecte-finalizate` | 90% | Aproape | Export raport este modal/mock; handover/lessons sunt mock | Ajustare grid final approvals / lessons / templates |
| `07_taskuri_board.png` | `/taskuri/board` | 88% | Parțial | Boardul are coloane și acțiuni, dar drag/drop real nu este implementat; mutare prin status/select | Dacă se cere 1:1, necesită width/card/card-count tuning și drag/drop real |
| `08_taskuri_tabel.png` | `/taskuri/tabel` | 90% | Aproape | Tabelul este funcțional: selectare, bulk actions, density; column visibility este simplificat | Ajustare toolbar exactă și setări coloane avansate |
| `09_taskuri_calendar_gantt.png` | `/taskuri/calendar` | 88% | Parțial | Calendar/Gantt sunt vizuale și clickabile; editarea directă pe timeline nu este drag/drop | Necesită Gantt mai apropiat pixel-perfect și interacțiune timeline mai avansată |
| `10_taskuri_workload_aprobari.png` | `/taskuri/workload` | 90% | Aproape | Workload heatmap + approvals funcționale; capacity logic este pe mock/task estimates | Ajustare heatmap exact și filtre departament/săptămână mai vizibile |

## Verdict vizual

- Gata pentru build/test tehnic: **după v6.4.2, da, dacă `pnpm typecheck/lint/build` trec local**.
- Gata pentru testare vizuală: **da, dar nu declar pixel-perfect 100%**.
- Paginile cu cel mai mare risc de diferență vizuală: **Board** și **Calendar/Gantt**.
