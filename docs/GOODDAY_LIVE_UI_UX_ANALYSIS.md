# GOODDAY LIVE UI/UX ANALYSIS — public audit for SERVELECT WORK OS v8.0.0

Date: 2026-06-15  
Scope: public GoodDay pages only. No login bypass, no copied branding/assets/screenshots.

## Public product signals used

GoodDay publicly presents itself as a complete work management platform with modules for projects, task management, views, customization, productivity suite, integrations, mobile/desktop apps, security and templates. Public module pages list core work management, planning/visualization, customization/structure, strategy/goals, collaboration, requests/forms, time/attendance, HR, finance/operations, CRM/client collaboration, reporting/analytics and automation/integrations.

## UI/UX direction relevant to SERVELECT

- Dense enterprise Work OS layout, not isolated dashboard cards.
- Work navigation is centered around My Work, Projects/Hierarchy, Views, Action Required, Resource Planning and Admin settings.
- GoodDay public feature pages emphasize tree-like hierarchy, portfolios, custom statuses/workflows, dependencies, recurring tasks, templates, custom fields, task checklists, time tracking, timer, work scheduling and reporting.
- Pricing matrix shows a clear tier split: custom workflows/custom views/activity stream in free tier; time tracking, Gantt, automations, custom fields, API and advanced analytics in Professional; workload/resource management, finance, CRM, customer portal, custom branding and custom task IDs in Business; SSO, enterprise access control, custom access rules, custom reports, risk matrix and goals in Enterprise.

## SERVELECT design adaptation

Do not copy GoodDay branding. Adapt the logic as SERVELECT:

- Dark professional Servelect sidebar with light Work OS content.
- My Work / Action Required first, then task views, tickets, forms, time, workload and admin.
- Compact tables and guard panels with badges instead of oversized cards.
- Right-side/secondary panels for ACL, provider state and rollback evidence.
- Saved views, department scope and role-aware work item visibility must stay visible in the UI.
- Enterprise access must distinguish departments: Audit, Administrativ, Automatizări, Audit energetic, Comercial, Marketing, Producție.

## v8.0.0 target decision

`docs/NEXT_BUILD_PLAN.md` after v7.9 explicitly recommends v8.0.0: Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill. Therefore this build does not do a broad redesign. It hardens the Work OS toward production-grade GoodDay-like behavior: access control, write gates, rollback evidence and provider readiness.
