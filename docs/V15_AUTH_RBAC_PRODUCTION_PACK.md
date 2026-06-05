# SERVELECT WORK OS v1.5.0 — Auth & RBAC Production Pack

## Scop

v1.5.0 adaugă fundația enterprise pentru autentificare, roluri, permisiuni și audit security.
Build-ul nu activează încă Auth.js/SSO real în producție, dar definește clar contractul pe care v1.6+ îl va folosi pentru integrare reală cu DB/session persistence.

## Rute noi

- `/admin/auth-rbac`
- `/api/v1/enterprise/auth-rbac`
- `/api/v1/enterprise/auth-rbac-health`
- `/api/v1/enterprise/permission-matrix`

## Fișiere noi

- `apps/web/lib/enterprise/auth-rbac.ts`
- `apps/web/app/admin/auth-rbac/page.tsx`
- `apps/web/app/api/v1/enterprise/auth-rbac/route.ts`
- `apps/web/app/api/v1/enterprise/auth-rbac-health/route.ts`
- `apps/web/app/api/v1/enterprise/permission-matrix/route.ts`
- `scripts/auth-rbac-readiness-test.ps1`

## Ce rezolvă

- Centralizează capabilitățile auth/RBAC.
- Definește matricea de permisiuni pentru roluri.
- Pregătește tranziția de la demo auth la Auth.js/SSO.
- Documentează riscurile de securitate înainte de producție.
- Oferă endpoint-uri verificabile pentru readiness.

## Validare

```powershell
pnpm --filter @servelect/web build
.\scripts\auth-rbac-readiness-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```

## Următorul build

v1.6.0 — Task & Project Persistence Pack.
