# v20.0.1 — Taskuri V200 Binding Fix

Fix target: production had v20 API deployed but visible Taskuri pages did not render data-v200-goodday-complete-interaction-layer.

Cause: V200 runtime component existed and API existed, but the real /taskuri/* page files were not bound to render it.

Rules preserved:
- V15 visual shell remains the baseline.
- No new shell.
- No Taskuri Workspace panel.
- No WORKSPACE HIERARCHY panel.
- V200 is an in-place runtime layer rendered after V150 inside existing real pages.

Acceptance target:
- /taskuri contains data-v150-goodday-structural-parity.
- /taskuri contains data-v200-goodday-complete-interaction-layer.
- /taskuri does not contain Taskuri Workspace.
- /taskuri does not contain WORKSPACE HIERARCHY.
- API contains GOODDAY_COMPLETE_INTERACTION_LAYER_ON_V15_SHELL and REAL_LOCAL_PERSISTENT.
