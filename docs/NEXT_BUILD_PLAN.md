# NEXT BUILD PLAN — after v9.0.2

## Current baseline

Current stabilization target: **v9.0.2 — Release Manifest Contract & Typecheck Stabilization**.

v8.9.0 was validated with:

- Functional/API: 66 / 66 PASS
- Screenshot/UI: 50 / 50 PASS

v9.0.0 introduced production pilot cutover, but v9.0.1/v9.0.2 are required because:

1. two navigation shells were visible;
2. stale visible label `v7.9.0 · Provider Canary / ACL / Primary Pilot` remained in the app;
3. `apps/web/lib/release/manifest.ts` did not match `/admin/release` and `lib/system/status.ts` contracts.

## Canonical navigation rule

The app must use **one main navigation entry** for task execution:

- canonical: Dashboard principal → Taskuri
- compatible: `/work-os/*` routes remain for legacy/admin/deep links
- forbidden: second visible shell that shows `SERVELECT / Work OS / v7.9.0`

## Next major build

### v9.1.0 — DB-Backed Provider Dispatch Worker, Real Webhook Intake Ledger & Task Mutation Pilot

Scope:

1. real provider dispatch ledger table/API;
2. signed webhook intake ledger with replay protection;
3. task mutation pilot with manager approval gates;
4. Action Required queue connected to provider/webhook events;
5. GoodDay-like task object model first runtime pass;
6. keep global writes disabled until all production gates pass;
7. extend screenshot/functional tests without creating demo routes.

## Guardrails

- No new demo-only pages.
- No duplicate navigation shell.
- No stale version labels.
- No secrets in repo.
- Version must be controlled from release manifest/version source of truth.
