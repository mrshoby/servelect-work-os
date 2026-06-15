# SERVELECT GoodDay-like Design System — v8.0.0 refinement

## Principle

SERVELECT WORK OS should feel like a serious enterprise Work OS: compact, role-aware, task-first, dense but readable. Do not copy GoodDay branding or assets.

## Layout

- Sidebar: dark navy `#071826`, Servelect green accent `#00843D`.
- Content: light `#F8FAFC`, white cards, subtle borders `#E2E8F0`.
- Header: compact release/context bar, search/actions and route title.
- Work surfaces: tables, saved views, filters, tabs, drawers and status pills.
- Admin surfaces: matrices, gates, scorecards and provider health.

## Component rules

- Cards: radius 12px, border 1px, shadow-sm only.
- Tables: dense rows, small uppercase headers, badges for status and ACL.
- Badges: green = passed/ready/synced, amber = warning/dry-run/queued/conflict, red = blocked/failed/denied.
- Buttons: primary green, neutral white, destructive red only for irreversible actions.
- Drawers/modals: never display read-only demos only; must show edit/guard/persistence state.
- Empty states: explain missing adapter/provider and next action.
- Error states: show what is blocked, why, and what unlocks it.

## v8 application

v8.0.0 applies these rules to Production Pilot Readiness and Primary Write Pilot surfaces, replacing broad marketing cards with compact tables for ACL, mutation guard, rollback drill and provider readiness.
