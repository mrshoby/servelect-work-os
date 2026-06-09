# SERVELECT WORK OS v6.8.1 — Real Persistence/API Script Fix

Fixes the v6.8.0 apply script PowerShell parser error caused by `$Rel:` inside a double-quoted string.

No UI/layout change. The v6.8.0 persistence/API files are applied unchanged, then package versions are updated to 6.8.1.

QA expected after apply:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Route smoke after starting server:

```powershell
.\scripts\work-os-v681-persistence-functional-test.ps1 -BaseUrl "http://127.0.0.1:3100"
```
