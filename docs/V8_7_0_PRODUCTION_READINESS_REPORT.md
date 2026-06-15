# v8.7.0 Production Readiness Report

v8.7.0 improves production readiness by adding credential readiness checks, HMAC signature verification contracts, pilot mutation replay and rollback checkpoints.

## Ready for pilot
- Department-scoped mutation replay.
- Provider readiness evidence.
- Webhook signature proof model.
- Rollback checkpoint manifest.
- Manager evidence panel.

## Not ready for global production
- Global writes remain disabled.
- Real email/push/websocket dispatch requires secrets and provider-specific device/session registries.
- Pixel-diff gate is prepared but not yet mandatory in CI.
- Webhook signature verification must be connected to real provider events before live inbound mutations.
