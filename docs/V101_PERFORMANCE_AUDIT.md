# SERVELECT WORK OS v1.0.1 — Performance & Bug Hotfix

## Fixuri incluse

- Fix build error: `PageHeader` nu accepta prop `actions`; pagina `/taskuri` folosește acum children corect.
- `/taskuri` nu mai randează simultan toate view-urile grele.
- Înlocuire workspace principal cu view activ: `Task Table`, `Kanban Board`, `My Work`, `Calendar`, `Approvals`.
- Tabel light limitat la primele 70 taskuri afișate.
- Board light limitat la primele 140 taskuri și max 8 carduri vizibile per coloană.
- Topbar fără textul `SERVELECT WORK OS / Live / Demo auth` peste search.
- localStorage key schimbat la `servelect-work-os-store-v5` pentru a evita state vechi/corupt.
- Adăugat `/admin/performance`.
- Adăugat `/api/v1/performance/audit`.
- Adăugat `scripts/site-smoke-test.ps1` pentru verificare rapidă după deploy.

## Test după deploy

```powershell
.\scripts\site-smoke-test.ps1
```

## Observație

Patch-ul păstrează aceeași direcție vizuală, dar reduce blocajele prin randare condițională și limitare DOM.
