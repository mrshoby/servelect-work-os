# V57 Deployment Report

## Target

SERVELECT WORK OS v5.7.0 — Real Database Adapter Switchboard & Record Mutations.

## Local source

`D:\01_digitalizare_automatizare\servelect-work-os-main`

## GitHub

`https://github.com/mrshoby/servelect-work-os`

## Vercel

Deploy should trigger automatically after push to `main`.

## Manual verification

```powershell
cd "D:\01_digitalizare_automatizare\servelect-work-os-main"
pnpm typecheck
pnpm build
.\scripts\work-os-data-switchboard-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"
```
