# v9.0.2 — Release Manifest Contract & Typecheck Stabilization

## Scop

Hotfix critic peste v9.0.1, pentru că typecheck-ul încă pica în:

- `app/admin/release/page.tsx`
- `lib/system/status.ts`

Cauza: `apps/web/lib/release/manifest.ts` nu respecta contractul consumat de aceste fișiere.

## Reparat

- `ReleaseGateStatus` folosește statusurile reale cerute de UI: `passed`, `warning`, `blocked`, `planned`.
- `ReleaseManifest` include `app`, `summary`, `milestones[].id`, `nextRecommendedVersions[]` ca obiecte.
- `ReleaseChecklist` include `productionScore`, `blockers`, `warnings`, `planned`, `gates`.
- `ReleaseGate` include `title`, `owner`, `action`, `evidence`, `required`.
- Versiunea vizibilă este ridicată la `v9.0.2`.
- Meniul canonic rămâne `Dashboard principal → Taskuri`.
- `/work-os/*` rămâne compatibil, dar nu este al doilea meniu principal.

## Nu activează

- global production writes;
- provider credentials live;
- DB dispatch worker live.

Acestea rămân pentru v9.1.0, după ce v9.0.2 trece typecheck/lint/build.
