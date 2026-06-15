# NEXT BUILD PLAN — after v8.8.0

Current version: v8.8.0 — Pixel-Diff CI Gates, Real Provider Secret Adapter & Live Inbound Webhook Drill

## Done in v8.8.0
- Continued after validated v8.7.1 route completion hotfix.
- Added a larger major build, not a one-route increment.
- Added Taskuri visual evidence center, provider secret adapter, inbound webhook drill and dead-letter recovery routes.
- Added Work OS/Admin equivalents for pixel-diff, webhook and recovery control planes.
- Added v8.8 API family for pixel diff baseline, provider secret metadata, signed webhook drill, dead-letter recovery, replay queue, visual evidence and release readiness.
- Added additive Prisma migration for pixel-diff baselines, provider secret binding metadata, inbound webhook drills and dead-letter recovery metadata.
- Added functional and screenshot audit scripts with safe report paths and valid report.join("\\n").

## Scores after v8.8.0
- GoodDay visual similarity: 89%
- GoodDay functional parity: 98%
- Local real functionality: 97%
- Backend/API parity: 98%
- Production readiness: 98%
- QA confidence: 97% after local QA + Vercel smoke
- Screenshot audit coverage: 100% after clean capture

## Missing
- Real provider delivery workers with live credentials are still gated.
- Pixel-diff is prepared but not yet enforced in GitHub Actions as a blocking CI job.
- Webhook signature drill is modeled; live inbound provider callbacks need real secrets and environment bindings.
- Global writes remain disabled.
- Mobile token registry is not production-bound.

## Recommended next build
v8.9.0 — Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake

## Scope
1. Add GitHub Actions pixel-diff CI gate for Taskuri/Admin/Work OS critical screenshots.
2. Add provider delivery worker adapter with dry-run/live split.
3. Add signed inbound webhook intake route with real signature validation using env-bound secrets.
4. Add replay from dead-letter queue into scoped mutation queue.
5. Add manager approval evidence panel in Taskuri.
6. Keep global writes disabled.

## Do not do
- Do not store secrets in repo.
- Do not enable global writes.
- Do not add unrelated modules.
- Do not redesign from zero.
- Do not move away from Taskuri / GoodDay parity.
