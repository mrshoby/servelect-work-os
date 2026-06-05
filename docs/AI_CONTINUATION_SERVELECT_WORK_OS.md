# AI Continuation — SERVELECT WORK OS / EMP

Current target build: v3.0.0 — Production Task CRUD Stabilization & Prisma Write-Gate.

Important current repo path on user's PC:
- `D:\servelect-work-os-main`

Downloads folder:
- `C:\Users\shoby\Downloads`

Recent context:
- v2.7 introduced API-backed board/drawer foundation.
- v2.8 introduced task page API bridge.
- v2.9 introduced real create/update UI panel with API calls, still mock-memory.
- v3.0 introduces production task CRUD stabilization and explicit Prisma write-gate.

Truth/status:
- Website/Web App is beta advanced.
- Task CRUD is not yet 100% production DB-backed.
- Prisma/PostgreSQL writes must remain OFF unless write-gate is explicitly enabled.
- Next build should be v3.1.0 — Prisma Task Repository Adapter Activation.

Known stabilization rules:
- In Next.js client pages, `'use client';` must be first line.
- Do not replace all `db-ready` globally. It is valid for WorkGraphReadinessStatus.
- In `task-page-api-bridge`, use `release.readiness` if `productCompletion` has area fields only.
- Preserve release dashboard backward-compatible fields: `overall`, `overallCompletion`, `website`, `mobile`, `production`, `areas`.
