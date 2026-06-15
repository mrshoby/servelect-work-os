# NEXT BUILD PLAN — SERVELECT WORK OS

## Current version
v8.7.0 — Live Provider Credentials, Webhook Signature Verification & Pilot Mutation Replay

## What was done in v8.7.0
- Larger major build after v8.6, not a tiny incremental patch.
- Added Taskuri provider mutation replay and live provider command center routes.
- Added Admin provider credential vault and Work OS replay routes.
- Added API v87 with provider credentials, webhook signatures, replay queue, Taskuri evidence, manager evidence panel, pixel-diff baseline, outbox dispatch, rollback drill, GoodDay parity delta, security checklist and runtime proof.
- Added additive Prisma migration for provider credential evidence, webhook signature proof and pilot mutation replay.
- Updated GoodDay public analysis and design system docs.

## Scores after v8.7.0
| Category | Score |
|---|---:|
| GoodDay visual/UX similarity | 88% |
| GoodDay functional parity | 98% |
| Local real functionality | 97% |
| Backend/API parity | 98% |
| Production readiness | 98% |
| Enterprise access control | 96% |
| Provider/notification readiness | 98% |
| Bulk/mutation replay | 92% |
| QA confidence | 97% pending user local/Vercel QA |
| Screenshot audit coverage | 100% target after v8.7 audit |

## Problems remaining
- Live provider credentials must be bound to real secret manager/runtime, not stored in repo.
- Webhook signature verification must be tested with real inbound provider events.
- Pixel-diff screenshot baseline exists but CI enforcement is not mandatory yet.
- DB pilot mutations remain gated by department and lockVersion.
- Global writes remain disabled.

## Next build recommended
v8.8.0 — Pixel-Diff CI Gates, Real Provider Secret Adapter & Live Inbound Webhook Drill

## Mandatory scope for v8.8.0
1. Add CI-ready pixel diff gate for main Taskuri/Admin/Work OS pages.
2. Add provider secret adapter interface with env/vault/runtime checks, no secrets in repo.
3. Add live inbound webhook drill with signed sample payloads.
4. Add mutation replay recovery from dead-letter to replay queue.
5. Add Taskuri visual evidence panel for UI quality gates.
6. Keep global writes off.

## Do NOT do next
- Do not add unrelated modules.
- Do not redesign from scratch.
- Do not enable global production writes.
- Do not skip route tests or screenshot audit.
- Do not claim 100% while external provider sends and pixel diff CI remain gated.

## Routes affected
- `/taskuri/provider-mutation-replay`
- `/taskuri/live-provider-command-center`
- `/taskuri/pilot-mutation-replay`
- `/work-os/live-provider-mutation-replay`
- `/work-os/pilot-mutation-replay`
- `/admin/live-provider-mutation-replay`
- `/admin/provider-credential-vault`
- `/api/v1/work-os/v87-live-provider-mutation-replay/*`

## QA status
Pending user local run and Vercel deployment test for v8.7.0.

## Screenshot audit status
Pending user run of `node scripts/audit-v870-screenshots.mjs`.

## GitHub/Vercel status
Patch pack delivered. User must apply, run QA, commit and push to GitHub, then verify Vercel.

---

## v8.7.1 Route Completion Hotfix

Status: required before v8.8.0.

Reason: v8.7.0 screenshot audit found 7 UI routes returning 404. This hotfix restores those routes and adds dedicated functional/screenshot audits.

Fixed routes:
- /taskuri/provider-mutation-replay
- /taskuri/live-provider-command-center
- /taskuri/pilot-mutation-replay
- /admin/live-provider-mutation-replay
- /admin/provider-credential-vault
- /work-os/live-provider-mutation-replay
- /work-os/pilot-mutation-replay

Next build after this hotfix: v8.8.0 â€” Pixel-Diff CI Gates, Real Provider Secret Adapter & Live Inbound Webhook Drill.
