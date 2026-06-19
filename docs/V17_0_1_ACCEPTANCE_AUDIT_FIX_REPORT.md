# v17.0.1 — Route/API & Browser Audit Acceptance Fix

This hotfix does not redesign Taskuri and does not replace the v15 visual baseline. It fixes the acceptance harness around v17.0.0.

## Fixed

- Route/API test now decodes HTML entities before matching markers, so `Inbox &amp; Action Required` is correctly treated as `Inbox & Action Required`.
- Browser functional audit no longer defaults to `localhost:3000`; it uses `https://servelect-work-os-web.vercel.app` unless `BASE_URL` is explicitly supplied.
- Timer stop browser flow now starts and stops the timer in the same browser session/page flow.
- v17 audit reports are generated as explicit v17.0.1 reports.

## Not declared 100%

This hotfix only fixes acceptance/audit reliability. It does not complete backend, real import mapping, procurement, acquisitions or budgeting.
