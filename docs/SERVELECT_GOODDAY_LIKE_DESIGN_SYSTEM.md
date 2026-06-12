# SERVELECT GoodDay-like Design System — v7.7.0

## Principles
Compact, aligned, enterprise, hierarchy-first and action-oriented. No GoodDay branding or copied assets.

## Shell
- Dark navy sidebar `#0c1824` with Servelect green active state.
- Light content background `#f5f7fb`.
- Sticky white topbar with search, unread badge, release and capability status.

## Components
- Cards: white, subtle border `#e2e8f0`, radius 16–20px, minimal shadow.
- Tables: compact rows, no heavy blocks, hover states.
- Badges: low-saturation status colors for status, priority, SLA, provider state.
- Drawers/panels: right side task context with comments, checklist, notifications and dry-run actions.
- Buttons: primary Servelect green, secondary border-only.
- Filters/views: route-aware saved views, compact chips.
- Workload: progress bars calculated from planned minutes and capacity.
- Error/empty states: explicit action and route context.

## Applied in code
- `V77GoodDayUiParityClient` is the shared shell for real `/taskuri` and admin routes.
- It preserves interaction: create task, status transition, comments, saved views, timer, tickets, notifications, provider rehearsal and primary write dry-run.
