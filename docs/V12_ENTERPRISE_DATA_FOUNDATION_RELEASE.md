# v1.2.0 — Enterprise Data Foundation Release

## Scop

v1.2.0 este un build major/minor complet, nu hotfix incremental. Scopul este să consolideze fundația de date și readiness-ul pentru trecerea de la MVP/mock la aplicație enterprise persistentă.

## Adăugat

- `/admin/data-foundation`
- `/api/v1/enterprise/data-foundation`
- `/api/v1/enterprise/data-readiness`
- `apps/web/lib/enterprise/data-foundation.ts`
- versiune pachete `1.2.0`
- taskuri page performance-safe inclus în patch
- document continuitate actualizat

## Fixuri incluse din build-urile anterioare

- eliminare `mobile` prop din `Sidebar` în `AppShell.tsx` dacă există;
- reparare `/api/v1/performance/audit` pentru `generatedAt` duplicat și `manifestWithoutGeneratedAt` lipsă;
- localStorage key ridicat la `servelect-work-os-store-v12`;
- taskuri page randată cu view activ și limitări de listă/board.

## Următorul build recomandat

v1.3.0 — Database Activation Pack

- Prisma/PostgreSQL real;
- seed;
- CRUD persistent pentru taskuri/proiecte;
- audit log persistent;
- workflow execution persistent;
- user management persistent.
