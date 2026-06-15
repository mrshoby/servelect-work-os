export type V83Decision = "allow" | "dry_run" | "block";
export type V83Provider = "in_app" | "email" | "push" | "websocket" | "webhook";
export type V83OutboxStatus = "queued" | "processing" | "delivered" | "failed" | "blocked";
export type V83TransactionStatus = "shadow" | "canary" | "primary_pilot" | "committed" | "rolled_back" | "blocked";

export type V83SessionClaim = {
  actorId: string;
  actorName: string;
  role: "super_admin" | "department_admin" | "manager" | "technician" | "client";
  department: "Audit" | "Administrativ" | "Automatizari" | "Audit energetic" | "Comercial" | "Marketing" | "Productie";
  teamId: string;
  clientScope: string;
  canUsePrimaryWrites: boolean;
};

export type V83AuditEvent = {
  id: string;
  transactionId: string;
  actorId: string;
  entityType: "task" | "ticket" | "saved_view" | "workflow" | "timesheet" | "approval" | "provider_event";
  entityId: string;
  action: string;
  decision: V83Decision;
  beforeHash: string;
  afterHash: string;
  rollbackId: string;
  createdAt: string;
};

export type V83OutboxEvent = {
  id: string;
  transactionId: string;
  provider: V83Provider;
  channelTarget: string;
  status: V83OutboxStatus;
  attempts: number;
  lastError?: string;
  lastAttemptAt: string;
  nextRetryAt?: string;
};

export type V83WriteTransaction = {
  id: string;
  lane: "task_status" | "ticket_escalation" | "saved_view_server_sync" | "timesheet_submit" | "approval_decision";
  actorId: string;
  entityType: V83AuditEvent["entityType"];
  entityId: string;
  lockVersion: number;
  status: V83TransactionStatus;
  policyDecision: V83Decision;
  auditEventIds: string[];
  outboxEventIds: string[];
  rollbackCheckpoint: string;
  runtimeProofId: string;
};

export type V83RuntimeProof = {
  id: string;
  environment: "local" | "vercel_preview" | "vercel_production";
  baseUrl: string;
  apiRoute: string;
  lastSmokeStatus: "pending" | "pass" | "fail";
  evidence: string[];
  nextProofRequired: string;
};

export const v83SessionClaims: V83SessionClaim[] = [
  {
    actorId: "u-super-admin-vlad",
    actorName: "Vlad Taran",
    role: "super_admin",
    department: "Administrativ",
    teamId: "servelect-global-admin",
    clientScope: "all",
    canUsePrimaryWrites: true,
  },
  {
    actorId: "u-manager-productie",
    actorName: "Andrei Popescu",
    role: "manager",
    department: "Productie",
    teamId: "team-productie-field",
    clientScope: "servelect-internal",
    canUsePrimaryWrites: true,
  },
  {
    actorId: "u-technician-field",
    actorName: "Mihai Ionescu",
    role: "technician",
    department: "Productie",
    teamId: "team-productie-field",
    clientScope: "assigned-only",
    canUsePrimaryWrites: false,
  },
];

export const v83AuditEvents: V83AuditEvent[] = [
  {
    id: "audit-v83-001",
    transactionId: "txn-v83-001",
    actorId: "u-manager-productie",
    entityType: "ticket",
    entityId: "TCK-8321",
    action: "ticket.escalate.sla_risk",
    decision: "allow",
    beforeHash: "sha256:ticket-before-8321",
    afterHash: "sha256:ticket-after-8321",
    rollbackId: "rb-v83-001",
    createdAt: "2026-06-15T08:20:00.000Z",
  },
  {
    id: "audit-v83-002",
    transactionId: "txn-v83-002",
    actorId: "u-super-admin-vlad",
    entityType: "saved_view",
    entityId: "VIEW-DEPT-PROD-ACTIVE",
    action: "saved_view.server_sync.commit",
    decision: "allow",
    beforeHash: "sha256:view-before-prod-active",
    afterHash: "sha256:view-after-prod-active",
    rollbackId: "rb-v83-002",
    createdAt: "2026-06-15T08:25:00.000Z",
  },
  {
    id: "audit-v83-003",
    transactionId: "txn-v83-003",
    actorId: "u-technician-field",
    entityType: "task",
    entityId: "TSK-9130",
    action: "task.status.primary_write_attempt",
    decision: "block",
    beforeHash: "sha256:task-before-9130",
    afterHash: "sha256:unchanged-blocked-9130",
    rollbackId: "rb-v83-003",
    createdAt: "2026-06-15T08:29:00.000Z",
  },
];

export const v83OutboxEvents: V83OutboxEvent[] = [
  {
    id: "outbox-v83-001",
    transactionId: "txn-v83-001",
    provider: "in_app",
    channelTarget: "manager:productie",
    status: "delivered",
    attempts: 1,
    lastAttemptAt: "2026-06-15T08:20:10.000Z",
  },
  {
    id: "outbox-v83-002",
    transactionId: "txn-v83-001",
    provider: "webhook",
    channelTarget: "work-os.provider-events.ticket-escalation",
    status: "queued",
    attempts: 0,
    lastAttemptAt: "2026-06-15T08:20:11.000Z",
    nextRetryAt: "2026-06-15T08:35:00.000Z",
  },
  {
    id: "outbox-v83-003",
    transactionId: "txn-v83-003",
    provider: "email",
    channelTarget: "security-admin@servelect.local",
    status: "blocked",
    attempts: 0,
    lastError: "Policy blocked primary write attempt for technician role",
    lastAttemptAt: "2026-06-15T08:29:10.000Z",
  },
];

export const v83Transactions: V83WriteTransaction[] = [
  {
    id: "txn-v83-001",
    lane: "ticket_escalation",
    actorId: "u-manager-productie",
    entityType: "ticket",
    entityId: "TCK-8321",
    lockVersion: 14,
    status: "primary_pilot",
    policyDecision: "allow",
    auditEventIds: ["audit-v83-001"],
    outboxEventIds: ["outbox-v83-001", "outbox-v83-002"],
    rollbackCheckpoint: "rb-v83-001",
    runtimeProofId: "runtime-v83-vercel-production",
  },
  {
    id: "txn-v83-002",
    lane: "saved_view_server_sync",
    actorId: "u-super-admin-vlad",
    entityType: "saved_view",
    entityId: "VIEW-DEPT-PROD-ACTIVE",
    lockVersion: 5,
    status: "committed",
    policyDecision: "allow",
    auditEventIds: ["audit-v83-002"],
    outboxEventIds: [],
    rollbackCheckpoint: "rb-v83-002",
    runtimeProofId: "runtime-v83-vercel-production",
  },
  {
    id: "txn-v83-003",
    lane: "task_status",
    actorId: "u-technician-field",
    entityType: "task",
    entityId: "TSK-9130",
    lockVersion: 9,
    status: "blocked",
    policyDecision: "block",
    auditEventIds: ["audit-v83-003"],
    outboxEventIds: ["outbox-v83-003"],
    rollbackCheckpoint: "rb-v83-003",
    runtimeProofId: "runtime-v83-vercel-production",
  },
];

export const v83RuntimeProof: V83RuntimeProof = {
  id: "runtime-v83-vercel-production",
  environment: "vercel_production",
  baseUrl: "https://servelect-work-os-web.vercel.app",
  apiRoute: "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot",
  lastSmokeStatus: "pending",
  evidence: [
    "Route/API smoke must pass 35/35 after deploy.",
    "Screenshot audit must produce real PNG files, not NO_PNG.",
    "Prisma schema patch is additive and write-safe; production writes remain gated.",
    "Rollback replay must reference an audit event and an outbox event before allow." ,
  ],
  nextProofRequired: "Run scripts/work-os-v830-functional-test.ps1 after GitHub/Vercel deploy.",
};

export const v83PrismaSchemaModels = [
  "WorkOsAuditEvent",
  "WorkOsProviderOutboxEvent",
  "WorkOsWriteTransactionPilot",
  "WorkOsRuntimeProof",
];

export function getV83PrismaAuditOutboxTransactionPilot() {
  const delivered = v83OutboxEvents.filter((event) => event.status === "delivered").length;
  const queued = v83OutboxEvents.filter((event) => event.status === "queued").length;
  const blocked = v83OutboxEvents.filter((event) => event.status === "blocked").length;
  const allowed = v83Transactions.filter((txn) => txn.policyDecision === "allow").length;
  const denied = v83Transactions.filter((txn) => txn.policyDecision === "block").length;

  return {
    version: "8.3.0",
    buildName: "Prisma Audit/Outbox Tables, Transactional Write Pilot & Vercel Runtime Proof",
    productionWrites: "gated-primary-pilot-only",
    prismaSchemaModels: v83PrismaSchemaModels,
    sessionClaims: v83SessionClaims,
    auditEvents: v83AuditEvents,
    outboxEvents: v83OutboxEvents,
    transactions: v83Transactions,
    runtimeProof: v83RuntimeProof,
    summary: {
      sessionActors: v83SessionClaims.length,
      auditEvents: v83AuditEvents.length,
      outboxEvents: v83OutboxEvents.length,
      deliveredOutbox: delivered,
      queuedOutbox: queued,
      blockedOutbox: blocked,
      allowedTransactions: allowed,
      blockedTransactions: denied,
      transactionPilotCoverage: "task_status, ticket_escalation, saved_view_server_sync",
      nextRequiredBuild: "v8.4.0 — Database Adapter Transaction Execution & Provider Dispatch Worker",
    },
  };
}
