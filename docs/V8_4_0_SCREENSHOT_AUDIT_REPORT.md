# V8.4.0 Screenshot Audit Report

Expected command after deployment:

```powershell
$env:BASE_URL = "https://servelect-work-os-web.vercel.app"
node scripts/audit-v840-screenshots.mjs
```

Expected result: real PNG files in `audit-results/v840-screenshots`, no `NO_PNG` for core routes.
