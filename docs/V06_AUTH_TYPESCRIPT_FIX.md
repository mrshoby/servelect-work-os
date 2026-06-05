# v0.6 Auth TypeScript Fix

Fix pentru build Vercel după v0.6.

## Problemă

Build-ul pica în `apps/web/app/api/v1/auth/login/route.ts` deoarece `jsonError("VALIDATION_ERROR", ...)` folosea un cod care nu exista în union type-ul `ApiErrorCode`.

## Rezolvare

Am adăugat `VALIDATION_ERROR` în `apps/web/lib/backend/api-types.ts`, păstrând semantic corect răspunsul HTTP 422 pentru validarea formularului de login.

## Fișiere modificate

- `apps/web/lib/backend/api-types.ts`
- `apps/web/app/api/v1/auth/login/route.ts`
