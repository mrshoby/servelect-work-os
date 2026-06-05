# SERVELECT WORK OS v1.0.2 — Site Stability & Performance Hotfix

## Scope

This patch fixes the v1.0.1 build failure caused by using `PageHeader actions={...}` while the component accepted only `children`.

## Changes

- `PageHeader` now supports both `children` and `actions`.
- Topbar is simplified so search no longer overlaps `SERVELECT EMP / Live / Demo auth` labels.
- Adds `/admin/performance`.
- Adds `/api/v1/performance/audit`.
- Adds `scripts/site-smoke-test.ps1` for route checks after deploy.

## Manual browser step

After deploy, hard refresh `/taskuri` with Ctrl+F5 or test in Incognito to avoid old localStorage/cache.
