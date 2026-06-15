# v9.7.1 — Visual Density Taskuri Workspace Correction

## Why this build exists

v9.7.0 passed route, screenshot and source audits, but the UI was still too simple and did not look close enough to a dense work-management workspace. Passing HTTP/screenshot checks only proves routes render; it does not prove GoodDay-like visual density.

## Correction scope

- Keep Taskuri as the single canonical Work OS entry.
- Do not add a second /work-os shell.
- Do not create a separate showcase or demo surface.
- Replace the simple v9.7 content cards with a denser workspace layout:
  - workspace tree
  - view tabs
  - command/filter toolbar
  - board + task table
  - timeline / WorkGraph lane
  - reporting command panel
  - right task drawer
  - saved layout panel
- Keep global production writes OFF / pilot gated.

## Acceptance target

- Functional: 17/17 existing v97 routes remain PASS.
- Screenshot: 9/9 v97 surfaces captured.
- Source: required workspace visual signals exist and forbidden stale/demo wording is absent.

## Next build direction

After this correction is visually accepted, continue with v9.8.0: advanced task detail interactions, persisted layout preferences, exportable reporting packs and deeper GoodDay-like task table/board interactions.
