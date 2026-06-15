export function getV84ApiPayload() {
  const adapters = [
    { id: "adapter-prisma-audit-outbox", mode: "pilot_enabled", connection: "pilot_ready", writesEnabled: true, transactionScope: "audit_event + provider_outbox + transaction_pilot" },
    { id: "adapter-primary-task-write", mode: "dry_run", connection: "shadow_configured", writesEnabled: false, transactionScope: "task/ticket mutation guarded by policy + lockVersion" },
    { id: "adapter-provider-dispatch", mode: "pilot_enabled", connection: "pilot_ready", writesEnabled: true, transactionScope: "outbox lease + attempt + dead letter" },
  ];

  const workers = [
    { id: "worker-in-app", provider: "in_app", status: "ready", leaseTtlSec: 60, maxAttempts: 5, processed24h: 129, failed24h: 0 },
    { id: "worker-email", provider: "email", status: "dry_run", leaseTtlSec: 90, maxAttempts: 4, processed24h: 38, failed24h: 2 },
    { id: "worker-webhook", provider: "webhook", status: "ready", leaseTtlSec: 75, maxAttempts: 6, processed24h: 57, failed24h: 1 },
    { id: "worker-push", provider: "push", status: "blocked", leaseTtlSec: 90, maxAttempts: 4, processed24h: 0, failed24h: 0 },
    { id: "worker-websocket", provider: "websocket", status: "degraded", leaseTtlSec: 30, maxAttempts: 3, processed24h: 16, failed24h: 3 },
  ];

  const queue = [
    { id: "q-v84-001", lane: "ticket_sla", entityType: "ticket", entityId: "TCK-8321", department: "Productie", lockVersion: 15, adapterMode: "pilot_enabled", status: "delivered", provider: "in_app", attempts: 1, rollbackCheckpoint: "rb-v84-ticket-8321" },
    { id: "q-v84-002", lane: "saved_view_sync", entityType: "saved_view", entityId: "VIEW-DEPT-PROD-ACTIVE", department: "Administrativ", lockVersion: 6, adapterMode: "pilot_enabled", status: "processing", provider: "webhook", attempts: 1, rollbackCheckpoint: "rb-v84-view-prod-active" },
    { id: "q-v84-003", lane: "timesheet_submit", entityType: "timesheet", entityId: "TSH-2026-W24-MIHAI", department: "Productie", lockVersion: 3, adapterMode: "dry_run", status: "retry_wait", provider: "email", attempts: 2, rollbackCheckpoint: "rb-v84-timesheet-w24" },
    { id: "q-v84-004", lane: "stock_low", entityType: "task", entityId: "TSK-PROC-LOW-STOCK-004", department: "Productie", lockVersion: 1, adapterMode: "dry_run", status: "dead_letter", provider: "push", attempts: 4, rollbackCheckpoint: "rb-v84-stock-low-004" },
  ];

  const deadLetters = [
    { id: "dlq-v84-001", sourceQueueId: "q-v84-004", provider: "push", reason: "Push provider blocked until mobile token registry is bound to real sessions.", recoveryAction: "retry_after_secret_config" },
    { id: "dlq-v84-002", sourceQueueId: "q-v84-003", provider: "email", reason: "Email provider dry-run until production secret is configured.", recoveryAction: "manual_review" },
  ];

  return {
    version: "8.4.0",
    build: "Database Adapter Transaction Execution & Provider Dispatch Worker",
    health: { ok: true, globalProductionWrites: false, primaryPilot: true, adapterExecution: "gated", workerDispatch: "dry_run_or_pilot", deadLetterQueue: true },
    adapters,
    workers,
    queue,
    deadLetters,
    metrics: { queued: queue.length, delivered: queue.filter((item) => item.status === "delivered").length, deadLetter: deadLetters.length, avgDispatchMs: 386, p95DispatchMs: 940 },
    adapterExecution: { enabled: true, globalProductionWrites: false, lanes: ["ticket_sla", "saved_view_sync", "timesheet_submit", "stock_low"], requiresLockVersion: true, requiresRollbackCheckpoint: true },
    dispatchWorker: { leaseBased: true, retryBackoff: true, deadLetterQueue: true, supportedProviders: workers.map((worker) => worker.provider) },
    deadLetterRecovery: { manualReview: true, rollbackReplay: true, retryAfterSecretConfig: true, policyUpdateRequired: true },
    runtimeProof: { baseUrl: "https://servelect-work-os-web.vercel.app", apiRoute: "/api/v1/work-os/v84-database-adapter-dispatch-worker", expectedSmoke: "38/38", expectedScreenshots: "real_png_no_NO_PNG" },
  };
}
