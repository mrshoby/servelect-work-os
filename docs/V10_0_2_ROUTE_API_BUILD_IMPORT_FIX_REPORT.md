# SERVELECT WORK OS v10.0.2 — Route/API + Table Import Build Fix

## Verdict

v10.0.2 is a technical hotfix. It is not a GoodDay visual parity build.

## What failed before

The local build failed because `apps/web/app/taskuri/table/page.tsx` imported `V100GoodDayTaskuriMatureWorkspace` as a default export even though the component is exported as a named function.

Because the build failed, Vercel could not deploy the v10 API route completion, so the live smoke test stayed at 19 / 27.

## What this hotfix changes

- Rewrites `/taskuri/table` to use the named import.
- Ensures `/taskuri/table` opens the mature table/list view via `initialView="tabel"`.
- Ensures the v100 parity API endpoints exist.
- Adds a v10.0.2 functional test with safe `Join-Path` report writing.
- Adds a source audit that catches the default-import regression.

## What this hotfix does not solve

- It does not fix the manual UI density result of 0 / 19.
- It does not claim GoodDay parity.
- It does not replace the required v11.0.0 redesign.

## Next required build

v11.0.0 — Major GoodDay Taskuri Workspace Redesign, Browser Flow QA & Shared State Hardening.
