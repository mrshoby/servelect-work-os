# SERVELECT WORK OS v10.0.3 — Table/API Build Fix

## Purpose

This is a technical hotfix only. It repairs the failing build caused by `/taskuri/table/page.tsx` importing a missing `V100GoodDayTaskuriMatureWorkspace` module.

## Fix applied

- `/taskuri/table` is now a compatibility route that redirects to `/taskuri/tabel`.
- v100 API parity endpoints are ensured.
- Source audit verifies that the table route no longer imports the missing component.

## Not accepted as design final

This hotfix does not claim GoodDay visual parity. The next major build remains v11.0.0 for mature Taskuri UI density and browser-flow parity.
