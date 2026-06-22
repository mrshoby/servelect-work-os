# NEXT_BUILD_PLAN.md

## Current baseline
- Visual shell: V15 restored baseline (`taskuri-ui-v15-goodday-baseline-restored`).
- Latest planned build: v20.0.0 GoodDay Complete Interaction Layer on V15 Shell.
- Rule: no new visual shell, no permanent extra sidebar/panel, no demo route as main UI.

## Next major build
v21.0.0 — Server-Backed Mutation Adapter, Playwright Click-All QA & Screenshot Manual UI Audit

### Lowest remaining categories
1. Backend/API real persistence
2. Browser click-all QA
3. Screenshot/manual UI audit
4. Calendar/Gantt/Workload advanced interactions
5. Procurement real files/stock/budget linkage

### Scope
- Keep V15 shell and v20 in-place runtime.
- Add server-backed mutation adapter with local fallback.
- Add Playwright click-all audit that fails on any visible dead button.
- Add screenshot/contact-sheet audit for all Taskuri views.
- Add real route/API checks after GitHub/Vercel auto-deploy.
- Do not declare 100% until browser + screenshot + backend persistence are verified.
