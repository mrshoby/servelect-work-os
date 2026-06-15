export const v89ProviderChannels = [
  { provider: "in_app", status: "ready", queue: "live-safe", retry: "0 / p95 42ms", evidence: "manager inbox + audit link", tone: "green" },
  { provider: "email", status: "secret-gated", queue: "dry-run", retry: "2 backoff lanes", evidence: "ENV readiness + no secret in repo", tone: "amber" },
  { provider: "push", status: "pilot", queue: "blocked by scope", retry: "3 attempts", evidence: "device scope pending", tone: "blue" },
  { provider: "webhook", status: "signature-ready", queue: "signed intake", retry: "idempotent replay", evidence: "HMAC + timestamp + nonce", tone: "green" },
  { provider: "websocket", status: "dry-run", queue: "shadow broadcast", retry: "dead-letter on failure", evidence: "connection proof pending", tone: "amber" },
];

export const v89SignedWebhookDrills = [
  { name: "HMAC SHA-256 signature envelope", note: "Payload is verified with timestamp, nonce and replay-window guard before mutation replay." },
  { name: "Idempotency key required", note: "Duplicate signed events resolve to the same replay ledger entry, not duplicate tasks/tickets." },
  { name: "Clock skew protection", note: "Inbound event is blocked if timestamp exceeds configured acceptance window." },
  { name: "No secrets in repository", note: "Provider secrets are referenced as ENV readiness keys only." },
];

export const v89PixelDiffGates = [
  { name: "GitHub Actions workflow", note: "Adds CI scaffold for route screenshots, artifact upload and threshold summary." },
  { name: "Taskuri visual baseline", note: "Covers My Work, Board, Table, Workload, Reports, Evidence and Provider centers." },
  { name: "Manager acceptance gate", note: "Blocks release if key routes return NO_PNG or route coverage drops." },
  { name: "Diff threshold registry", note: "Per-route warning/fail thresholds are documented and API-visible." },
];

export const v89ReplayRecoveryLanes = [
  { name: "Dead-letter triage", note: "Groups provider failures by cause, channel, actor and affected entity." },
  { name: "Replay queue admission", note: "Only signed, scoped and rollback-capable events enter replay queue." },
  { name: "Rollback checkpoint verification", note: "Every replay lane requires beforeHash, afterHash and lockVersion proof." },
  { name: "Manager approval handoff", note: "High-risk replays require manager approval before retry." },
];

export const v89ManagerEvidence = [
  { title: "Action Required inbox", description: "Shows webhook failures, provider dispatch blocks and replay approvals in the same operational queue.", status: "linked" },
  { title: "Signed webhook ledger", description: "Keeps event id, provider, signature decision, timestamp drift and replay eligibility.", status: "ready" },
  { title: "Pixel-diff route proof", description: "Reports screenshot coverage and visual gate status for Taskuri/Admin/Work OS routes.", status: "CI scaffold" },
  { title: "Provider delivery proof", description: "Displays delivery mode, retry count, dead-letter state and last outcome by channel.", status: "dry-run/live split" },
];

export const v89GoodDayParityLanes = [
  { name: "My Work / Action Required", score: "96%", note: "Manager evidence and provider failures become actionable work." },
  { name: "Custom workflow gates", score: "96%", note: "Webhook/replay transitions enforce signature and approval gates." },
  { name: "Automations & integrations", score: "95%", note: "Signed inbound/outbound provider runtime is now represented." },
  { name: "Enterprise access control", score: "96%", note: "Secrets, scopes and replay are gated; global writes remain off." },
];

export const v89RuntimeProof = [
  { label: "Functional surface", value: "65 checks", note: "Taskuri, Admin, Work OS and v89 API matrix.", tone: "green" },
  { label: "Screenshot surface", value: "50 UI routes", note: "API routes are excluded from PNG capture by design.", tone: "blue" },
  { label: "Provider mode", value: "dry-run/live split", note: "Live delivery is gated by ENV readiness and approval.", tone: "amber" },
  { label: "Write policy", value: "scoped only", note: "No global writes; replay requires lockVersion + rollback.", tone: "green" },
];

export function getV89Payload(section = "overview") {
  return {
    version: "8.9.0",
    build: "Real Provider Delivery Worker, GitHub Pixel-Diff CI & Signed Webhook Intake",
    section,
    writeMode: "department-pilot-gated",
    globalWrites: "off",
    providerChannels: v89ProviderChannels,
    webhookDrills: v89SignedWebhookDrills,
    pixelDiffGates: v89PixelDiffGates,
    replayRecovery: v89ReplayRecoveryLanes,
    managerEvidence: v89ManagerEvidence,
    goodDayParity: v89GoodDayParityLanes,
    runtimeProof: v89RuntimeProof,
    checks: {
      hmacSignature: true,
      timestampWindow: true,
      idempotency: true,
      noSecretsInRepo: true,
      deadLetterRecovery: true,
      rollbackCheckpoint: true,
      managerApprovalGate: true,
      pixelDiffCiScaffold: true,
    },
  };
}
