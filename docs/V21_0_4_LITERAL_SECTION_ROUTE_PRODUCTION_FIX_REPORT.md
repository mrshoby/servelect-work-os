# v21.0.4 — Literal [section] Route + Production Marker/API Fix

Scope:
- Fixes PowerShell extraction/apply failure caused by `[section]` route path handling.
- Writes the dynamic API route with `-LiteralPath` instead of requiring it to exist inside the ZIP as a bracketed folder.
- Adds a server-rendered hidden marker via `apps/web/app/taskuri/template.tsx` so every `/taskuri/*` route exposes `data-v210-goodday-real-mutation-bridge` in production HTML.
- Forces the exact root API route tested by `work-os-v2100-functional-test.ps1`:
  `/api/v1/work-os/v210-real-mutation-bridge`.
- Preserves V15/V200 visual shell and does not introduce `Taskuri Workspace`, `WORKSPACE HIERARCHY`, or V160 shell markers.

Expected production route/API test:
`Passed: 13 / 13`.
