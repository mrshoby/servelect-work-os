# SERVELECT WORK OS v7.0.2 — GoodDay Parity Release Manifest Typecheck Fix

## Scope

Hotfix punctual pentru buildul v7.0.x. Repară nealinierea dintre `app/admin/release/page.tsx` și `apps/web/lib/release/manifest.ts`.

## Fix

`manifest.summary` include din nou câmpurile citite de Release Console:

- `capabilities`
- `actionItems`
- `criticalActions`
- `workflowExecutions`

## Nu schimbă

- designul Taskuri;
- logica GoodDay parity;
- rutele principale;
- persistenta;
- backend-ul.

## QA obligatoriu

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
