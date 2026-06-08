# v5.6.0 QA Report

## Expected local commands

```powershell
pnpm typecheck
pnpm build
```

`pnpm install` is not required by default because this update does not add dependencies.

## Vercel focus

Vercel build should pass after the v5.5 lint blockers fix. v5.6 does not add `<a>` links to internal routes and does not add `any` types.

## Routes to verify

- `/work-os`
- `/work-os/persistent-records`
- `/work-os/status`
- `/api/v1/work-os/persistent-records`
- `/api/v1/work-os/status`

## Known limitations

- Inline edits are still local/shadow-safe, not DB-mutating.
- Activity comments are modeled and visible, but real persistent comments are planned for v5.7.
- Mobile offline sync remains planned.
