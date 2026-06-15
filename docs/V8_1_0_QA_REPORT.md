# v8.1.0 QA Report

## QA obligatoriu local

| Comandă | Status așteptat | Observații |
|---|---|---|
| `pnpm typecheck` | PASS | Rulează în apply dacă nu folosești `-SkipQa` |
| `pnpm lint` | PASS sau erori vechi marcate | Nu ignora erorile noi |
| `pnpm build` | PASS | Buildul nu este final dacă pică |
| `scripts/work-os-v810-functional-test.ps1` | PASS după local dev/deploy | Nu rula pe Vercel înainte de deploy |
| `node scripts/audit-v810-screenshots.mjs` | PASS după local dev/deploy | Nu accepta NO_PNG |

## Comandă recomandată după deploy

```powershell
.\scripts\work-os-v810-functional-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
$env:BASE_URL = "https://servelect-work-os-web.vercel.app"
node scripts/audit-v810-screenshots.mjs
```
