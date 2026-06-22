# v18.0.1 — Typecheck Fix

## Scope

Fix pentru `V171V15InPlaceFunctionalRuntime.tsx` unde TypeScript a detectat folosirea `placeholder` pe un union `HTMLInputElement | HTMLSelectElement`.

## Modificare

- `input.placeholder` este accesat doar când `input instanceof HTMLInputElement`.
- `target.placeholder` este accesat doar când `target instanceof HTMLInputElement`.
- Nu se schimbă shell-ul vizual.
- Nu se reintroduce panou nou de tip `Taskuri Workspace` / `WORKSPACE HIERARCHY`.

## QA obligatoriu

- `pnpm --filter @servelect/web typecheck`
- `pnpm --filter @servelect/web build`
