# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v8.9.0 — Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake

## What v8.9.0 completed
- Added provider delivery worker surfaces across Taskuri/Admin/Work OS.
- Added signed webhook intake proof and replay recovery controls.
- Added GitHub pixel-diff CI scaffold and route coverage gates.
- Added manager approval evidence panels for provider/replay events.
- Added additive Prisma migration scaffold.
- Added functional and screenshot audit scripts.

## Current scores
| Category | Score |
|---|---:|
| GoodDay visual/UX similarity | 90% |
| GoodDay functional parity | 98% |
| Local real functionality | 98% |
| Backend/API parity | 98% |
| Production readiness | 98% |
| QA confidence | 98% after local/deploy QA |
| Screenshot audit coverage | 100% target |

## Remaining critical gaps
- Live provider credentials are still ENV-gated and not production-enabled by default.
- Pixel-diff CI needs stable preview deployment and baseline artifact retention.
- Signed inbound webhook intake needs real provider payload tests.
- Global production writes remain disabled.
- Database-backed provider dispatch worker must be confirmed against a configured production database.

## Next recommended build
v9.0.0 — Production Pilot Cutover Console, Live Provider Dispatch & Signed Webhook Intake Hardening

## Scope for v9.0.0
1. Production pilot cutover console with explicit enable/disable gates.
2. Provider dispatch worker with ENV credential readiness and dead-letter recovery proof.
3. Signed webhook intake with replay protection and idempotency testing.
4. GitHub/Vercel pixel-diff CI artifacts and route baselines.
5. Manager approval workflow for pilot writes and provider replays.
6. Keep global writes off unless all gates pass.

## Do not do next
- Do not add unrelated modules.
- Do not create a demo page outside real Taskuri/Admin/Work OS routes.
- Do not claim 100% while provider live secrets and production DB writes remain gated.
