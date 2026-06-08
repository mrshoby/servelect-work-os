# V6.2.0 Changelog

## Added
- Department-aware RBAC engine.
- Servelect department model with Audit, Administrativ, Automatizări, Audit energetic, Comercial, Marketing, Producție.
- Department task routing and visibility helpers.
- Department approvals and notifications routing.
- Department workload and manager/subordinate visibility cards.
- API endpoints for departments, tasks, approvals, visibility and completion status.

## Changed
- Work OS now separates `Audit log` from real Servelect departments `Audit` and `Audit energetic`.
- Completion/status percentages now include Department-aware RBAC.

## Safety
- No destructive writes enabled.
- All rules remain demo/shadow-safe and ready for future real DB integration.
