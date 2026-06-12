# v7.7.3 — Vercel Deployment Protection Test Fix

This is a QA/script-only hotfix for v7.7.x.

## Problem

The v7.7.0 route smoke test can fail with HTTP 401 when run against a Vercel deployment protected by Vercel Authentication / Deployment Protection.
That 401 happens before the Next.js app route is rendered, so it is not proof that `/taskuri` or the v7.7 routes are broken.

## Fix

Updated:

- `scripts/work-os-v770-functional-test.ps1`
- `scripts/audit-v770-screenshots.mjs`

The scripts now support `VERCEL_AUTOMATION_BYPASS_SECRET` / `-BypassSecret` and add the `x-vercel-protection-bypass` header when a secret is provided.

## Usage

```powershell
$env:VERCEL_AUTOMATION_BYPASS_SECRET = "PASTE_VERCEL_BYPASS_SECRET_HERE"
.\scripts\work-os-v770-functional-test.ps1 -BaseUrl "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app"
```

or:

```powershell
.\scripts\work-os-v770-functional-test.ps1 -BaseUrl "https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app" -BypassSecret "PASTE_VERCEL_BYPASS_SECRET_HERE"
```

For screenshot audit:

```powershell
$env:BASE_URL="https://servelect-work-os-ky01ppafk-mrshoby1.vercel.app"
$env:VERCEL_AUTOMATION_BYPASS_SECRET="PASTE_VERCEL_BYPASS_SECRET_HERE"
node scripts/audit-v770-screenshots.mjs
```

## Verification fallback

If no bypass secret is available, run against an unprotected production alias or disable Deployment Protection for the tested domain in Vercel settings.
