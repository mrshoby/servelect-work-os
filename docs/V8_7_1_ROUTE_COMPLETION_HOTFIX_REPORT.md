# v8.7.1 Route Completion Hotfix Report

## Context
v8.7.0 introduced live provider mutation replay surfaces, but screenshot audit showed 7 UI routes returning 404 while the rest of the product pages were valid. This hotfix restores the missing UI routes without introducing a new demo module.

## Fixed routes
- `/taskuri/provider-mutation-replay`
- `/taskuri/live-provider-command-center`
- `/taskuri/pilot-mutation-replay`
- `/admin/live-provider-mutation-replay`
- `/admin/provider-credential-vault`
- `/work-os/live-provider-mutation-replay`
- `/work-os/pilot-mutation-replay`

## Scope
- Adds missing App Router pages.
- Adds one shared GoodDay-like enterprise route completion component.
- Adds hotfix functional route test.
- Adds hotfix screenshot audit.
- Keeps global writes off.
- Does not add a separate demo.

## Next build rule
Do not continue to v8.8 until v8.7.1 hotfix passes:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `scripts/work-os-v871-route-hotfix-test.ps1`
- `scripts/audit-v871-route-hotfix-screenshots.mjs`
