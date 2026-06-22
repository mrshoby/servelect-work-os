# NEXT_BUILD_PLAN — after v18.0.0

## Următorul build major recomandat

v19.0.0 — Real Backend Procurement Adapter, Inventory Reservation Link & Invoice File Storage

## Categoria cu procentul cel mai slab rămas

Backend/API: 52%
Bugetare: 68%
Costuri & Aprovizionare: 78%
Achiziții: 76%

## Scope obligatoriu v19

- mutați procurement flow din localStorage către adapter backend real unde este disponibil;
- păstrați V15 shell vizual, fără shell nou;
- legați solicitarea de aprovizionare de stoc/rezervări reale;
- upload fișiere reale pentru factură și certificat garanție;
- audit trail server-side;
- conflict/retry/rollback;
- import XLSX/CSV cu mapare reală;
- bugete proiect reale + diferență buget vs ofertă vs comandă;
- QA complet: typecheck, build, source audit, dead buttons, browser flow, screenshot manual UI audit, Vercel route/API.

## Reguli anti-regresie

- Nu se folosește V160/V170 ca shell vizual principal.
- Nu se introduce panou permanent nou în stânga.
- Nu se declară 100% dacă importul/backendul/storage-ul nu sunt reale.
