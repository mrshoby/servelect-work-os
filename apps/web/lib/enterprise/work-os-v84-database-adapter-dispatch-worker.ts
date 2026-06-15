export type V84AdapterMode = "shadow" | "dry_run" | "pilot_enabled" | "blocked";
export type V84DispatchStatus = "idle" | "leased" | "processing" | "delivered" | "retry_wait" | "dead_letter" | "blocked";
export type V84Provider = "in_app" | "email" | "push" | "websocket" | "webhook";
export type V84ExecutionLane = "ticket_sla" | "task_status" | "saved_view_sync" | "timesheet_submit" | "approval_decision" | "stock_low";

export type V84DatabaseAdapter = {
  id: string;
  name: string;
  mode: V84AdapterMode;
  connection: "not_configured" | "shadow_configured" | "pilot_ready" | "blocked";
  writesEnabled: boolean;
  rlsRequired: boolean;
  transactionScope: string;
  lastProofAt: string;
  blockers: string[];
};

export type V84DispatchWorker = {
  id: string;
  provider: V84Provider;
  status: "ready" | "dry_run" | "blocked" | "degraded";
  leaseTtlSec: number;
  maxAttempts: number;
  retryBackoff: string;
  deadLetterEnabled: boolean;
  processed24h: number;
  failed24h: number;
};

export type V84QueueItem = {
  id: string;
  lane: V84ExecutionLane;
  entityType: "task" | "ticket" | "saved_view" | "timesheet" | "approval" | "provider_outbox";
  entityId: string;
  actorId: string;
  department: "Audit" | "Administrativ" | "Automatizari" | "Audit energetic" | "Comercial" | "Marketing" | "Productie";
  lockVersion: number;
  adapterMode: V84AdapterMode;
  status: V84DispatchStatus;
  provider: V84Provider;
  attempts: number;
  nextRetryAt?: string;
  rollbackCheckpoint: string;
  evidence: string[];
};

export type V84DeadLetterItem = {
  id: string;
  sourceQueueId: string;
  reason: string;
  provider: V84Provider;
  entityId: string;
  recoveryAction: "retry_after_secret_config" | "manual_review" | "rollback_replay" | "block_until_policy_update";
  createdAt: string;
};

export type V84AdapterExecutionSummary = {
  version: "8.4.0";
  build: string;
  globalProductionWrites: false;
  primaryPilot: boolean;
  adapters: V84DatabaseAdapter[];
  workers: V84DispatchWorker[];
  queue: V84QueueItem[];
  deadLetters: V84DeadLetterItem[];
  metrics: {
    queued: number;
    delivered: number;
    retryWait: number;
    deadLetter: number;
    blocked: number;
    avgDispatchMs: number;
    p95DispatchMs: number;
    rollbackReady: number;
  };
  runtimeProof: {
    baseUrl: string;
    apiRoute: string;
    expectedSmoke: string;
    expectedScreenshots: string;
    vercelRuntime: "edge-compatible-json" | "node-runtime-required";
  };
  nextBuild: string;
};

export const v84Adapters: V84DatabaseAdapter[] = [
  {
    id: "adapter-prisma-audit-outbox",
    name: "Prisma audit/outbox adapter",
    mode: "pilot_enabled",
    connection: "pilot_ready",
    writesEnabled: true,
    rlsRequired: true,
    transactionScope: "audit_event + provider_outbox + transaction_pilot",
    lastProofAt: "2026-06-15T08:40:00.000Z",
    blockers: [],
  },
  {
    id: "adapter-primary-task-write",
    name: "Primary task/ticket write adapter",
    mode: "dry_run",
    connection: "shadow_configured",
    writesEnabled: false,
    rlsRequired: true,
    transactionScope: "task/ticket mutation guarded by policy + lockVersion",
    lastProofAt: "2026-06-15T08:42:00.000Z",
    blockers: ["real auth provider binding", "RLS policy proof", "seeded rollback table"],
  },
  {
    id: "adapter-provider-dispatch",
    name: "Provider dispatch adapter",
    mode: "pilot_enabled",
    connection: "pilot_ready",
    writesEnabled: true,
    rlsRequired: false,
    transactionScope: "outbox lease + attempt + dead letter",
    lastProofAt: "2026-06-15T08:44:00.000Z",
    blockers: ["production provider secrets not enabled in repository"],
  },
];

export const v84Workers: V84DispatchWorker[] = [
  { id: "worker-in-app", provider: "in_app", status: "ready", leaseTtlSec: 60, maxAttempts: 5, retryBackoff: "10s, 30s, 2m, 10m", deadLetterEnabled: true, processed24h: 129, failed24h: 0 },
  { id: "worker-email", provider: "email", status: "dry_run", leaseTtlSec: 90, maxAttempts: 4, retryBackoff: "30s, 2m, 15m, 1h", deadLetterEnabled: true, processed24h: 38, failed24h: 2 },
  { id: "worker-webhook", provider: "webhook", status: "ready", leaseTtlSec: 75, maxAttempts: 6, retryBackoff: "15s, 1m, 5m, 30m, 2h", deadLetterEnabled: true, processed24h: 57, failed24h: 1 },
  { id: "worker-push", provider: "push", status: "blocked", leaseTtlSec: 90, maxAttempts: 4, retryBackoff: "30s, 5m, 30m", deadLetterEnabled: true, processed24h: 0, failed24h: 0 },
  { id: "worker-websocket", provider: "websocket", status: "degraded", leaseTtlSec: 30, maxAttempts: 3, retryBackoff: "5s, 15s, 1m", deadLetterEnabled: true, processed24h: 16, failed24h: 3 },
];

export const v84Queue: V84QueueItem[] = [
  {
    id: "q-v84-001",
    lane: "ticket_sla",
    entityType: "ticket",
    entityId: "TCK-8321",
    actorId: "u-manager-productie",
    department: "Productie",
    lockVersion: 15,
    adapterMode: "pilot_enabled",
    status: "delivered",
    provider: "in_app",
    attempts: 1,
    rollbackCheckpoint: "rb-v84-ticket-8321",
    evidence: ["acl.allow", "audit.inserted", "outbox.leased", "provider.delivered"],
  },
  {
    id: "q-v84-002",
    lane: "saved_view_sync",
    entityType: "saved_view",
    entityId: "VIEW-DEPT-PROD-ACTIVE",
    actorId: "u-super-admin-vlad",
    department: "Administrativ",
    lockVersion: 6,
    adapterMode: "pilot_enabled",
    status: "processing",
    provider: "webhook",
    attempts: 1,
    rollbackCheckpoint: "rb-v84-view-prod-active",
    evidence: ["view_acl.scope_department", "audit.inserted", "outbox.lease.active"],
  },
  {
    id: "q-v84-003",
    lane: "timesheet_submit",
    entityType: "timesheet",
    entityId: "TSH-2026-W24-MIHAI",
    actorId: "u-technician-field",
    department: "Productie",
    lockVersion: 3,
    adapterMode: "dry_run",
    status: "retry_wait",
    provider: "email",
    attempts: 2,
    nextRetryAt: "2026-06-15T09:10:00.000Z",
    rollbackCheckpoint: "rb-v84-timesheet-w24",
    evidence: ["policy.dry_run", "manager_approval.required", "email.secret.missing"],
  },
  {
    id: "q-v84-004",
    lane: "stock_low",
    entityType: "task",
    entityId: "TSK-PROC-LOW-STOCK-004",
    actorId: "system-automation",
    department: "Productie",
    lockVersion: 1,
    adapterMode: "dry_run",
    status: "dead_letter",
    provider: "push",
    attempts: 4,
    rollbackCheckpoint: "rb-v84-stock-low-004",
    evidence: ["automation.stock_low", "push.provider.blocked", "dead_letter.created"],
  },
];

export const v84DeadLetters: V84DeadLetterItem[] = [
  {
    id: "dlq-v84-001",
    sourceQueueId: "q-v84-004",
    reason: "Push provider is blocked until mobile token registry is bound to real user sessions.",
    provider: "push",
    entityId: "TSK-PROC-LOW-STOCK-004",
    recoveryAction: "retry_after_secret_config",
    createdAt: "2026-06-15T08:55:00.000Z",
  },
  {
    id: "dlq-v84-002",
    sourceQueueId: "q-v84-003",
    reason: "Email provider in dry-run because production secret is not configured in repository/runtime.",
    provider: "email",
    entityId: "TSH-2026-W24-MIHAI",
    recoveryAction: "manual_review",
    createdAt: "2026-06-15T08:58:00.000Z",
  },
];

export function getV84DatabaseAdapterDispatchWorker(): V84AdapterExecutionSummary {
  const queued = v84Queue.length;
  const delivered = v84Queue.filter((item) => item.status === "delivered").length;
  const retryWait = v84Queue.filter((item) => item.status === "retry_wait").length;
  const deadLetter = v84Queue.filter((item) => item.status === "dead_letter").length;
  const blocked = v84Queue.filter((item) => item.status === "blocked").length + v84Workers.filter((worker) => worker.status === "blocked").length;

  return {
    version: "8.4.0",
    build: "Database Adapter Transaction Execution & Provider Dispatch Worker",
    globalProductionWrites: false,
    primaryPilot: true,
    adapters: v84Adapters,
    workers: v84Workers,
    queue: v84Queue,
    deadLetters: v84DeadLetters,
    metrics: {
      queued,
      delivered,
      retryWait,
      deadLetter,
      blocked,
      avgDispatchMs: 386,
      p95DispatchMs: 940,
      rollbackReady: v84Queue.filter((item) => item.rollbackCheckpoint).length,
    },
    runtimeProof: {
      baseUrl: "https://servelect-work-os-web.vercel.app",
      apiRoute: "/api/v1/work-os/v84-database-adapter-dispatch-worker",
      expectedSmoke: "38/38",
      expectedScreenshots: "real_png_no_NO_PNG",
      vercelRuntime: "edge-compatible-json",
    },
    nextBuild: "v8.5.0 - Real User Session Adapter, RLS Policy Proof & Department Write Scopes",
  };
}
