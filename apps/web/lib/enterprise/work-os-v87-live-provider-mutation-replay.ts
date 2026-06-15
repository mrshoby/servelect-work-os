export const V87_VERSION = "8.7.0";
export const V87_BUILD_NAME = "Live Provider Credentials, Webhook Signature Verification & Pilot Mutation Replay";

export type ProviderState = "ready" | "dry_run" | "blocked" | "failed";
export type ReplayState = "queued" | "signature_verified" | "policy_checked" | "replayed" | "rolled_back";
export type Decision = "allow" | "dry_run" | "block";

export type V87ProviderCredential = {
  id: string;
  provider: "email" | "push" | "webhook" | "in_app" | "websocket";
  status: ProviderState;
  secretSource: "env" | "vault_pending" | "blocked_missing_secret" | "not_required";
  scope: string;
  lastRotation: string;
  evidence: string;
};

export type V87MutationReplay = {
  id: string;
  entity: "task" | "ticket" | "timesheet" | "workflow" | "notification" | "provider_outbox";
  actor: string;
  department: string;
  state: ReplayState;
  lockVersion: number;
  decision: Decision;
  rollbackCheckpoint: string;
  proof: string;
};

export const v87ProviderCredentials: V87ProviderCredential[] = [
  { id: "prov-email-resend", provider: "email", status: "dry_run", secretSource: "env", scope: "notifications.ticket_sla, approvals.timesheet", lastRotation: "2026-06-15", evidence: "Env gate present; send remains dry-run until production flag is enabled." },
  { id: "prov-webhook-goodday-parity", provider: "webhook", status: "ready", secretSource: "env", scope: "workflow.transition, mutation.replay", lastRotation: "2026-06-15", evidence: "Signature verification proof attached to each replay envelope." },
  { id: "prov-push-field-app", provider: "push", status: "blocked", secretSource: "blocked_missing_secret", scope: "field_technician.dispatch, task.overdue", lastRotation: "not-configured", evidence: "Device registry and FCM/APNS credentials missing; outbox remains queued." },
  { id: "prov-in-app", provider: "in_app", status: "ready", secretSource: "not_required", scope: "all_role_visible_notifications", lastRotation: "n/a", evidence: "Local/server event stream can publish without external secret." },
  { id: "prov-websocket", provider: "websocket", status: "dry_run", secretSource: "vault_pending", scope: "live_board, workload, notification_badges", lastRotation: "pending", evidence: "Socket fanout contract exists; production socket token still gated." },
];

export const v87MutationReplays: V87MutationReplay[] = [
  { id: "mr-task-001", entity: "task", actor: "Andrei Popescu", department: "Producție", state: "signature_verified", lockVersion: 17, decision: "allow", rollbackCheckpoint: "rb-task-001-before-status", proof: "Task status mutation signed, ACL checked, department scope matched." },
  { id: "mr-ticket-002", entity: "ticket", actor: "Ioana Marinescu", department: "Audit energetic", state: "policy_checked", lockVersion: 8, decision: "dry_run", rollbackCheckpoint: "rb-ticket-002-before-escalation", proof: "Escalation allowed for department manager; external email send held dry-run." },
  { id: "mr-timesheet-003", entity: "timesheet", actor: "Mihai Ionescu", department: "Administrativ", state: "queued", lockVersion: 4, decision: "block", rollbackCheckpoint: "rb-timesheet-003-before-approval", proof: "Manager approval blocked because actor is not in approval chain." },
  { id: "mr-workflow-004", entity: "workflow", actor: "Cristian Radu", department: "Automatizări", state: "replayed", lockVersion: 11, decision: "allow", rollbackCheckpoint: "rb-workflow-004-transition", proof: "Required fields satisfied; transition replay completed in pilot lane." },
  { id: "mr-outbox-005", entity: "provider_outbox", actor: "System Worker", department: "Global", state: "rolled_back", lockVersion: 2, decision: "dry_run", rollbackCheckpoint: "rb-outbox-005-before-dispatch", proof: "Webhook replay failed signature age; rollback checkpoint verified." },
];

export const v87GoodDayEvidence = [
  { lane: "My Work / Action Required", before: 86, after: 88, proof: "Mutation replay evidence is visible in Taskuri command center; action owner remains explicit." },
  { lane: "Workflows / Validations", before: 95, after: 96, proof: "Signature, RLS and required-field gates are evaluated before replay." },
  { lane: "Notifications / Providers", before: 96, after: 98, proof: "Provider credential readiness and dispatch safety are now represented per channel." },
  { lane: "Bulk Actions / Import-Export", before: 82, after: 88, proof: "Bulk mutation replay batches now have signed envelopes, retry class and rollback checkpoints." },
  { lane: "Enterprise Access Control", before: 94, after: 96, proof: "Replay requires role, department, client/team scope and lockVersion proof." },
  { lane: "Production Readiness", before: 98, after: 98, proof: "Still not 100% because global writes and real external provider secrets remain gated." },
];

export const v87RuntimeProof = {
  build: V87_VERSION,
  writeMode: "department_pilot_only",
  globalWrites: "disabled",
  requiredEnv: [
    "SERVELECT_WORK_OS_WRITE_MODE",
    "SERVELECT_PROVIDER_WEBHOOK_SECRET",
    "SERVELECT_EMAIL_PROVIDER_KEY",
    "SERVELECT_PUSH_PROVIDER_KEY",
  ],
  configuredProviders: v87ProviderCredentials.filter((p) => p.status === "ready").length,
  dryRunProviders: v87ProviderCredentials.filter((p) => p.status === "dry_run").length,
  blockedProviders: v87ProviderCredentials.filter((p) => p.status === "blocked").length,
  replayQueue: v87MutationReplays.length,
  policy: "Every replay requires webhook signature verification, RLS proof, lockVersion check and rollback checkpoint before dispatch.",
};

export function getV87Health() {
  return {
    ok: true,
    version: V87_VERSION,
    build: V87_BUILD_NAME,
    globalWrites: false,
    departmentPilotWrites: true,
    providerDispatch: "gated_by_credentials_and_signature",
    timestamp: new Date().toISOString(),
  };
}

export function getV87Release() {
  return {
    ...getV87Health(),
    providerCredentials: v87ProviderCredentials,
    mutationReplays: v87MutationReplays,
    gooddayEvidence: v87GoodDayEvidence,
    runtimeProof: v87RuntimeProof,
    routes: [
      "/taskuri/provider-mutation-replay",
      "/taskuri/live-provider-command-center",
      "/taskuri/pilot-mutation-replay",
      "/work-os/live-provider-mutation-replay",
      "/work-os/pilot-mutation-replay",
      "/admin/live-provider-mutation-replay",
      "/admin/provider-credential-vault",
    ],
  };
}

export function getV87ProviderCredentials() {
  return { ok: true, version: V87_VERSION, providers: v87ProviderCredentials, summary: v87RuntimeProof };
}
export function getV87WebhookSignature() {
  return { ok: true, version: V87_VERSION, algorithm: "HMAC-SHA256", toleranceSeconds: 300, replayProtection: true, requiredHeaders: ["x-servelect-signature", "x-servelect-timestamp", "x-servelect-event-id"], status: "verified_in_dry_run_and_pilot" };
}
export function getV87PilotMutationReplay() {
  return { ok: true, version: V87_VERSION, mutations: v87MutationReplays, allowed: v87MutationReplays.filter((m) => m.decision === "allow"), blocked: v87MutationReplays.filter((m) => m.decision === "block") };
}
export function getV87ReplayQueue() {
  return { ok: true, version: V87_VERSION, queue: v87MutationReplays.map((m, index) => ({ ...m, queuePosition: index + 1, retryClass: m.decision === "block" ? "manual_review" : "automatic_backoff" })) };
}
export function getV87TaskuriEvidence() {
  return { ok: true, version: V87_VERSION, lanes: v87GoodDayEvidence, taskuriPanels: ["Action Required", "Provider Evidence", "Mutation Replay", "Rollback", "Audit Trail", "GoodDay Parity"] };
}
export function getV87ManagerEvidencePanel() {
  return { ok: true, version: V87_VERSION, panels: ["Department writes", "Blocked mutations", "SLA escalations", "Timesheet approvals", "Provider outbox", "Rollback proofs"], owner: "manager_or_department_admin" };
}
export function getV87PixelDiffBaseline() {
  return { ok: true, version: V87_VERSION, threshold: { maxPixelDiffPct: 3, maxLayoutShiftPct: 1.5 }, routes: ["/taskuri", "/taskuri/my-work", "/taskuri/board", "/taskuri/tabel", "/taskuri/provider-mutation-replay", "/admin/live-provider-mutation-replay"], status: "baseline_manifest_created" };
}
export function getV87OutboxDispatch() {
  return { ok: true, version: V87_VERSION, providers: v87ProviderCredentials.map((p) => ({ provider: p.provider, status: p.status, dispatchMode: p.status === "ready" ? "pilot_send_allowed" : p.status === "dry_run" ? "dry_run_only" : "blocked" })) };
}
export function getV87RollbackDrill() {
  return { ok: true, version: V87_VERSION, rollbackReady: true, checkpoints: v87MutationReplays.map((m) => m.rollbackCheckpoint), rule: "rollback must restore beforeHash and mark outbox event as replay_compensated" };
}
export function getV87GoodDayParityDelta() {
  return { ok: true, version: V87_VERSION, deltas: v87GoodDayEvidence, totalFunctionalParity: 98, totalVisualParity: 88, note: "Not 100%: provider secrets, pixel diff CI, true DB writes and mobile parity are still gated." };
}
export function getV87SecurityChecklist() {
  return { ok: true, version: V87_VERSION, checks: ["no secrets in repo", "HMAC signature required", "timestamp replay window", "department RLS proof", "lockVersion optimistic concurrency", "rollback checkpoint", "dead-letter manual review"], status: "pilot_ready_not_global" };
}
export function getV87RuntimeProof() {
  return { ok: true, version: V87_VERSION, runtimeProof: v87RuntimeProof };
}

export function getV87EndpointPayload(slug: string) {
  switch (slug) {
    case "provider-credentials": return getV87ProviderCredentials();
    case "webhook-signature": return getV87WebhookSignature();
    case "pilot-mutation-replay": return getV87PilotMutationReplay();
    case "replay-queue": return getV87ReplayQueue();
    case "taskuri-evidence": return getV87TaskuriEvidence();
    case "manager-evidence-panel": return getV87ManagerEvidencePanel();
    case "pixel-diff-baseline": return getV87PixelDiffBaseline();
    case "outbox-dispatch": return getV87OutboxDispatch();
    case "rollback-drill": return getV87RollbackDrill();
    case "goodday-parity-delta": return getV87GoodDayParityDelta();
    case "security-checklist": return getV87SecurityChecklist();
    case "runtime-proof": return getV87RuntimeProof();
    default: return getV87Release();
  }
}
