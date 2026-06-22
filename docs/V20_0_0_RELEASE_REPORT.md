# v20.0.0 — GoodDay Complete Interaction Layer on V15 Shell

Scope:
- Preserves V15 visual shell and route-specific pages.
- Adds in-place functional interaction layer with no new permanent sidebar/shell.
- Extends REAL_LOCAL_PERSISTENT behavior for task, ticket, inbox, board, table, drawer, comments, timer, approvals, import/export, procurement and activity systems.
- Does not declare 100%.

Acceptance gates:
- V150 marker must remain present.
- V160/V170 bad shell markers must remain absent.
- Taskuri Workspace / WORKSPACE HIERARCHY must remain absent.
- Dead buttons audit must pass 36/36.
- Source audit must pass.
- Route/API production test must pass after GitHub/Vercel auto-deploy.
- Browser/manual UI audit remains required before raising QA and production readiness further.
