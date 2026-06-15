# v8.7.0 — Live Provider Credentials, Webhook Signature Verification & Pilot Mutation Replay

## Scope
This is a larger major build after v8.6.0. It does not add an isolated demo. It adds Taskuri, Admin and Work OS routes plus API/runtime proof for provider credentials, webhook signatures, pilot mutation replay, rollback and pixel-diff baselines.

## Added
- Taskuri provider command center routes.
- Admin provider credential vault and live mutation replay route.
- Work OS mutation replay route.
- API v87 with 13 endpoints.
- HMAC webhook signature proof model.
- Provider credential readiness without secrets in repository.
- Pilot mutation replay queue with lockVersion, decision and rollback checkpoint.
- Pixel-diff baseline manifest endpoint.
- Additive Prisma migration for credential evidence, webhook signature proof and pilot replay.

## Still gated
- Global writes remain disabled.
- Email/push/websocket live sends require secrets and device/session registries.
- Pixel-diff CI is prepared but not enforced until the next build.
