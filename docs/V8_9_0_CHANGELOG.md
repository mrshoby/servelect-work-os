# v8.9.0 — Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake

## Summary
Major Work OS hardening release after v8.8.0. This build connects provider delivery execution, signed inbound webhook intake, replay recovery, manager evidence panels and GitHub pixel-diff CI scaffolding into the real Taskuri/Admin/Work OS route surface.

## Added
- Provider delivery worker UI/API lanes.
- GitHub pixel-diff CI workflow scaffold.
- Signed inbound webhook intake proof with HMAC/timestamp/idempotency model.
- Dead-letter recovery and replay queue controls.
- Manager approval evidence panels.
- Additive Prisma migration scaffold for delivery attempts, signed webhook events and pixel-diff CI gates.
- v8.9 functional and screenshot audit scripts.

## Not enabled globally
- Global production writes remain off.
- Provider secrets are ENV references only and are not stored in repo.
- Live provider delivery remains gated.
