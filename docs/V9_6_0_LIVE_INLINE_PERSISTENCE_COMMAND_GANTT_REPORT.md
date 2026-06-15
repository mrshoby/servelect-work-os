# v9.6.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening

This build continues incrementally from v9.5.0 and follows `docs/NEXT_BUILD_PLAN.md`.

## Implemented

- Inline persistence adapter surface in Taskuri.
- Command palette actions for owner, status, due date, dependencies, watchers and manager gate request.
- Gantt/timeline conflict review with rollback preview.
- Notification routing for approvals, policy changes and dependency conflicts.
- Saved view persistence contracts.
- Task change audit and manager gate inbox.
- Admin governance surface.
- v9.6 API root and section endpoints.

## Guardrails

- Taskuri remains the canonical entry.
- No second Work OS shell was added.
- No separate non-production surface wording.
- Global production writes remain disabled / pilot gated.
