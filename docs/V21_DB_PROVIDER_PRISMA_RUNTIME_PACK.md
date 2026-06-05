# SERVELECT WORK OS v2.1.0 — DB Provider Wiring & Prisma Runtime Pack

## Scop
v2.1 pregătește comutarea controlată a aplicației de la `mock-memory` / `localStorage fallback` către `Prisma + PostgreSQL`, fără a schimba interfața vizuală existentă.

## Ce adaugă
- `/admin/db-provider`
- `/api/v1/enterprise/db-provider`
- `/api/v1/enterprise/db-provider-health`
- `/api/v1/enterprise/db-provider-runtime-plan`
- `/api/v1/enterprise/prisma-runtime-checklist`
- `apps/web/lib/enterprise/db-provider-runtime.ts`
- `scripts/db-provider-runtime-test.ps1`

## Principiu de siguranță
v2.1 nu deschide conexiuni DB reale în endpointurile de manifest. Endpointurile verifică existența variabilelor de mediu și pregătesc contractul de runtime, dar nu încearcă să ruleze query-uri live.

## Provider modes
- `mock-memory`: starea actuală stabilă pentru demo și UI beta.
- `prisma-shadow`: citire paralelă pentru comparații fără impact asupra UI.
- `prisma-active`: provider real, permis doar după safety gates.

## Variabile de mediu propuse
- `DATABASE_URL`
- `DIRECT_URL`
- `SERVELECT_DATA_PROVIDER=mock-memory | prisma-shadow | prisma-active`
- `PRISMA_LOG_LEVEL=warn,error`

## Validare
```powershell
pnpm --filter @servelect/web build
.\scripts\db-provider-runtime-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Următorul build
v2.2.0 — Prisma Schema & Seed Pack.
