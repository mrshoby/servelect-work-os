# v6.4.10 QA report

## QA commands
The apply script runs:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

## Known fixed blocker
- `TS2339: Property 'risks' does not exist on type 'V64Project'` fixed.

## Final status
Pending local run. Do not declare final until all commands pass on the real Windows repo.
