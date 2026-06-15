export function getV83ApiPayload() {
  const sessionClaims = [
    { actorId: "u-super-admin-vlad", actorName: "Vlad Taran", role: "super_admin", department: "Administrativ", canUsePrimaryWrites: true },
    { actorId: "u-manager-productie", actorName: "Andrei Popescu", role: "manager", department: "Productie", canUsePrimaryWrites: true },
    { actorId: "u-technician-field", actorName: "Mihai Ionescu", role: "technician", department: "Productie", canUsePrimaryWrites: false },
  ];

  const transactions = [
    { id: "txn-v83-001", lane: "ticket_escalation", entityType: "ticket", entityId: "TCK-8321", lockVersion: 14, policyDecision: "allow", status: "primary_pilot", rollbackCheckpoint: "rb-v83-001" },
    { id: "txn-v83-002", lane: "saved_view_server_sync", entityType: "saved_view", entityId: "VIEW-DEPT-PROD-ACTIVE", lockVersion: 5, policyDecision: "allow", status: "committed", rollbackCheckpoint: "rb-v83-002" },
    { id: "txn-v83-003", lane: "task_status", entityType: "task", entityId: "TSK-9130", lockVersion: 9, policyDecision: "block", status: "blocked", rollbackCheckpoint: "rb-v83-003" },
  ];

  const auditEvents = [
    { id: "audit-v83-001", transactionId: "txn-v83-001", actorId: "u-manager-productie", entityType: "ticket", action: "ticket.escalate.sla_risk", decision: "allow", beforeHash: "sha256:ticket-before-8321", afterHash: "sha256:ticket-after-8321", rollbackId: "rb-v83-001" },
    { id: "audit-v83-002", transactionId: "txn-v83-002", actorId: "u-super-admin-vlad", entityType: "saved_view", action: "saved_view.server_sync.commit", decision: "allow", beforeHash: "sha256:view-before-prod-active", afterHash: "sha256:view-after-prod-active", rollbackId: "rb-v83-002" },
    { id: "audit-v83-003", transactionId: "txn-v83-003", actorId: "u-technician-field", entityType: "task", action: "task.status.primary_write_attempt", decision: "block", beforeHash: "sha256:task-before-9130", afterHash: "sha256:unchanged-blocked-9130", rollbackId: "rb-v83-003" },
  ];

  const outboxEvents = [
    { id: "outbox-v83-001", transactionId: "txn-v83-001", provider: "in_app", target: "manager:productie", status: "delivered", attempts: 1 },
    { id: "outbox-v83-002", transactionId: "txn-v83-001", provider: "webhook", target: "work-os.provider-events.ticket-escalation", status: "queued", attempts: 0 },
    { id: "outbox-v83-003", transactionId: "txn-v83-003", provider: "email", target: "security-admin@servelect.local", status: "blocked", attempts: 0 },
  ];

  const prismaModels = ["WorkOsAuditEvent", "WorkOsProviderOutboxEvent", "WorkOsWriteTransactionPilot", "WorkOsRuntimeProof"];

  return {
    version: "8.3.0",
    build: "Prisma Audit/Outbox Tables, Transactional Write Pilot & Vercel Runtime Proof",
    productionWrites: "gated-primary-pilot-only",
    health: { ok: true, writeMode: "primary_pilot_gated", globalProductionWrites: false, runtimeProofRequired: true },
    sessionClaims,
    transactions,
    auditEvents,
    outboxEvents,
    prismaModels,
    runtimeProof: {
      environment: "vercel_production",
      baseUrl: "https://servelect-work-os-web.vercel.app",
      route: "/api/v1/work-os/v83-prisma-audit-outbox-transaction-pilot",
      expectedSmoke: "35/35",
      expectedScreenshots: "real_png_no_NO_PNG",
    },
    rollbackReplay: {
      ready: true,
      requirements: ["auditEvent.beforeHash", "auditEvent.afterHash", "rollbackCheckpoint", "outbox event replay state", "lockVersion"],
      dryRunOnly: true,
    },
  };
}
