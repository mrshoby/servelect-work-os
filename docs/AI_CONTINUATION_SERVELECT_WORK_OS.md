# AI CONTINUATION — SERVELECT WORK OS / SERVELECT EMP

## Versiune curentă pregătită
v2.1.0 — DB Provider Wiring & Prisma Runtime Pack

## Context proiect
SERVELECT WORK OS este o platformă Work OS task-first pentru proiecte, taskuri, CRM, IoT/energie, echipamente, mentenanță, finanțări/ESG, HR/admin și workflow-uri. Web-ul este Next.js/React/TypeScript/Tailwind, iar mobile rămâne momentan schelet Expo.

## Stadiu înainte de v2.1
- v2.0 Enterprise Beta Stabilization a introdus beta console și route audit.
- Task/project API contracts există, dar providerul este încă mock-memory.
- UI store este hibrid: localStorage fallback + API contracts + feature flags.
- DB real nu este activ încă.

## Ce adaugă v2.1
- Consolă `/admin/db-provider`.
- API manifest `/api/v1/enterprise/db-provider`.
- Health endpoint `/api/v1/enterprise/db-provider-health`.
- Runtime plan `/api/v1/enterprise/db-provider-runtime-plan`.
- Prisma checklist `/api/v1/enterprise/prisma-runtime-checklist`.
- Fișier central: `apps/web/lib/enterprise/db-provider-runtime.ts`.
- Script audit: `scripts/db-provider-runtime-test.ps1`.

## Reguli importante
- Nu schimba interfața vizuală principală fără cerere explicită.
- Păstrează `/taskuri` performant: view activ, tabel/board light, fără randare simultană masivă.
- Păstrează fișierul `docs/AI_CONTINUATION_SERVELECT_WORK_OS.md` actualizat la fiecare build.
- Nu activa `prisma-active` fără DATABASE_URL, seed, RBAC server-side și audit persistent.

## Erori istorice care trebuie evitate
- `PageHeader actions` nu este valid dacă PageHeader acceptă children.
- `Sidebar mobile` prop nu există.
- `generatedAt` duplicat în route JSON spread.
- `manifestWithoutGeneratedAt` lipsă.
- `db-ready` a cauzat incompatibilități de type/tone; folosește doar `ready | partial | mock | blocked`.
- `ok: true` duplicat cu spread din health manifest.

## Fixuri defensive de inclus în scripturi
- Elimină prop-ul `mobile` din Sidebar.
- Curăță `db-ready` din `apps/web` TS/TSX.
- Normalizează `DatabaseActivationStatus`.
- Rescrie `task-project-health/route.ts` să returneze direct health manifest.

## Următorul build recomandat
v2.2.0 — Prisma Schema & Seed Pack

Obiectiv: adaugă schema Prisma completă, seed deterministic Servelect, scripts migrate/seed/rollback și documentație pentru preview DB.
