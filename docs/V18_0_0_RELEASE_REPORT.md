# v18.0.0 — Costuri, Achiziții & Bugetare Full Procurement Flow

Baseline vizual: `taskuri-ui-v15-goodday-baseline-restored` / V150 shell.

Regulă respectată: nu se introduce shell nou, nu se adaugă panou permanent care schimbă layoutul Taskuri. v18 este un runtime funcțional in-place pentru categoria cu procentul cel mai slab: Costuri & Aprovizionare / Achiziții / Bugetare.

## Funcționalități implementate

- solicitare aprovizionare persistentă local;
- materiale legate de solicitare;
- conversie în RFQ;
- alegere furnizori;
- adăugare oferte;
- comparație preț vs termen livrare;
- ofertă recomandată/selectată;
- generare comandă;
- termen livrare;
- întârziere + alertă;
- factură;
- certificat garanție mock;
- legătură proiect;
- notificări și activity log;
- import preview mock-interactive;
- export CSV;
- audit butoane;
- audit funcțional browser.

## Limitări sincere

Nu este 100%: nu există încă backend real pentru procurement, import XLSX complet, stoc real legat de R2/D1/Postgres și factură reală cu fișier upload în storage. v19 trebuie să continue spre backend/API real și integrare stoc/facturi.
