# v9.0.3 — API Subroute Completion & v90 Functional Smoke Fix

## Problem

The pushed v9.0.2 build deployed the main v90 API route, but the functional smoke test showed 76/91 because 15 subroutes under `/api/v1/work-os/v90-production-pilot-cutover/*` returned 404.

## Root cause

The Next.js App Router requires physical subroute handlers or a correctly deployed catch-all segment. The previous pack had the summary route, but the subroutes were not present on GitHub/Vercel after apply/commit.

## Fix

This hotfix adds explicit route handlers for all 15 v90 API subroutes:

- health
- production-pilot-cutover
- live-provider-dispatch
- signed-webhook-hardening
- webhook-replay-protection
- provider-secret-env-check
- action-required
- workload-capacity
- hierarchy-map
- cross-module-activity
- rollback-drill
- manager-approval-gates
- pixel-diff-release-gates
- goodday-parity-delta
- release-readiness

## Expected result

After push and Vercel deployment:

- `scripts/work-os-v903-api-subroute-completion-test.ps1`: 15/15 PASS
- `scripts/work-os-v900-functional-test.ps1`: 91/91 PASS
