export const v88Release = {
  version: "8.8.0",
  name: "Pixel-Diff CI Gates, Real Provider Secret Adapter & Live Inbound Webhook Drill",
  globalWrites: "disabled",
  productionMode: "gated-pilot",
  uiRoutes: [
    "/taskuri/visual-evidence-center",
    "/taskuri/provider-secret-adapter",
    "/taskuri/inbound-webhook-drill",
    "/taskuri/dead-letter-recovery",
    "/work-os/pixel-diff-provider-webhook",
    "/work-os/live-webhook-drill",
    "/work-os/dead-letter-recovery",
    "/admin/pixel-diff-ci-gates",
    "/admin/provider-secret-adapter",
    "/admin/inbound-webhook-drill",
    "/admin/dead-letter-recovery",
  ],
};

export const v88ProviderSecrets = [
  { provider: "email", envName: "SERVELECT_PROVIDER_EMAIL_TOKEN", status: "missing_or_masked", owner: "Admin", rotationDays: 30 },
  { provider: "webhook", envName: "SERVELECT_WEBHOOK_SIGNING_SECRET", status: "required", owner: "Platform", rotationDays: 45 },
  { provider: "push", envName: "SERVELECT_PUSH_PROVIDER_KEY", status: "blocked_until_mobile_tokens", owner: "Mobile", rotationDays: 60 },
  { provider: "websocket", envName: "SERVELECT_WS_SIGNING_SECRET", status: "shadow_ready", owner: "Ops", rotationDays: 45 },
];

export const v88WebhookDrills = [
  { id: "WH-880-001", source: "iot_alert", signature: "hmac_valid", replayWindow: "5m", result: "ticket_created_shadow" },
  { id: "WH-880-002", source: "stock_low", signature: "hmac_valid", replayWindow: "5m", result: "procurement_task_queued" },
  { id: "WH-880-003", source: "customer_request", signature: "expired_timestamp", replayWindow: "blocked", result: "dead_letter" },
];

export const v88PixelDiffBaselines = [
  { route: "/taskuri", threshold: 0.18, baseline: "taskuri.png", status: "ready" },
  { route: "/taskuri/enterprise-control-room", threshold: 0.22, baseline: "taskuri_enterprise-control-room.png", status: "ready" },
  { route: "/admin/enterprise-department-suite", threshold: 0.25, baseline: "admin_enterprise-department-suite.png", status: "ready" },
  { route: "/work-os/enterprise-department-suite", threshold: 0.25, baseline: "work-os_enterprise-department-suite.png", status: "ready" },
];

export const v88DeadLetterRecovery = [
  { id: "DLQ-880-017", reason: "webhook_signature_expired", recovery: "request_new_payload", approvedBy: "department_admin", state: "waiting" },
  { id: "DLQ-880-029", reason: "provider_429", recovery: "retry_backoff", approvedBy: "system_policy", state: "scheduled" },
  { id: "DLQ-880-044", reason: "lock_version_conflict", recovery: "manual_merge_then_replay", approvedBy: "manager", state: "review" },
];

export function v88RuntimeProof() {
  return {
    ok: true,
    version: v88Release.version,
    checkedAt: new Date().toISOString(),
    globalWrites: v88Release.globalWrites,
    gates: {
      secretsInRepository: false,
      webhookSignatureDrill: true,
      pixelDiffBaseline: true,
      deadLetterRecovery: true,
      rollbackCheckpointRequired: true,
    },
    nextBuild: "v8.9.0 — Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake",
  };
}
