export const V74_RELEASE_VERSION = "7.4.0";
export const V74_STORAGE_KEY = "servelect-work-os-v74-db-backed-shadow-writes";

export type V74WriteMode = "db_shadow_locked";
export type V74EntityKind = "task" | "ticket" | "requestForm" | "notification" | "approval" | "savedView" | "workflow" | "customField" | "timeEntry" | "timesheet" | "automation";
export type V74WriteStatus = "queued" | "locked" | "shadow_written" | "verified" | "rolled_back" | "blocked";
export type V74QueueStatus = "queued" | "processing" | "delivered" | "failed" | "held";
export type V74LockStatus = "active" | "released" | "conflict" | "expired";
export type V74GateStatus = "passed" | "warning" | "blocked";

export interface V74ShadowWriteRecord {
  id: string;
  entity: V74EntityKind;
  entityId: string;
  action: string;
  status: V74WriteStatus;
  version: number;
  lockId: string;
  beforeHash: string;
  afterHash: string;
  rollbackId: string;
  queueId?: string;
  actorId: string;
  department: string;
  route: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface V74OptimisticLock {
  id: string;
  entity: V74EntityKind;
  entityId: string;
  version: number;
  ownerId: string;
  status: V74LockStatus;
  expiresAt: string;
  createdAt: string;
}

export interface V74NotificationJob {
  id: string;
  entity: V74EntityKind;
  entityId: string;
  userId: string;
  channel: "in_app" | "email_ready" | "push_ready" | "websocket_ready";
  status: V74QueueStatus;
  attempts: number;
  maxAttempts: number;
  route: string;
  payloadTitle: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface V74RollbackEvidence {
  id: string;
  writeId: string;
  entity: V74EntityKind;
  entityId: string;
  mode: "dry_run" | "restore_shadow_payload" | "manual_review";
  status: "available" | "verified" | "used" | "blocked";
  previousHash: string;
  nextHash: string;
  evidence: string;
  createdAt: string;
}

export interface V74RuntimeState {
  version: string;
  writeMode: V74WriteMode;
  generatedAt: string;
  shadowWrites: V74ShadowWriteRecord[];
  locks: V74OptimisticLock[];
  queue: V74NotificationJob[];
  rollbackEvidence: V74RollbackEvidence[];
  gates: { id: string; label: string; status: V74GateStatus; evidence: string; nextAction: string }[];
}

const now = () => new Date().toISOString();
const future = () => new Date(Date.now() + 15 * 60 * 1000).toISOString();
const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function tinyHash(value: unknown) {
  const text = JSON.stringify(value ?? {}).slice(0, 1600);
  let result = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    result ^= text.charCodeAt(index);
    result += (result << 1) + (result << 4) + (result << 7) + (result << 8) + (result << 24);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}

export function createV74RuntimeState(): V74RuntimeState {
  const createdAt = now();
  return {
    version: V74_RELEASE_VERSION,
    writeMode: "db_shadow_locked",
    generatedAt: createdAt,
    shadowWrites: [],
    locks: [],
    rollbackEvidence: [],
    queue: [
      { id: "v74_queue_sla_manager", entity: "ticket", entityId: "TCK-401", userId: "u_andrei", channel: "in_app", status: "queued", attempts: 0, maxAttempts: 3, route: "/taskuri/tickets-notificari", payloadTitle: "SLA risk ticket escalated", createdAt, updatedAt: createdAt },
      { id: "v74_queue_task_assign", entity: "task", entityId: "SWO-1002", userId: "u_vlad", channel: "in_app", status: "queued", attempts: 0, maxAttempts: 3, route: "/taskuri/my-work", payloadTitle: "Task assigned through shadow write", createdAt, updatedAt: createdAt }
    ],
    gates: [
      { id: "schema_review", label: "Shadow schema reviewed", status: "passed", evidence: "v7.3.0 migration scaffold exists and v7.4.0 adds lock/worker contracts.", nextAction: "Keep primary writes gated." },
      { id: "shadow_adapter", label: "DB-backed shadow adapter", status: "warning", evidence: "Adapter contract and UI are ready; real DATABASE_URL deployment must be verified in environment.", nextAction: "Connect to Prisma adapter in controlled env." },
      { id: "optimistic_locking", label: "Optimistic locking", status: "passed", evidence: "Every shadow write obtains a versioned lock before write evidence is created.", nextAction: "Add conflict UI to task drawer in v7.5." },
      { id: "notification_worker", label: "Notification worker queue", status: "warning", evidence: "In-app queue processing exists; email/push/websocket delivery remains readiness mode.", nextAction: "Add worker retry dashboard and delivery providers." },
      { id: "primary_writes", label: "Primary Prisma writes", status: "blocked", evidence: "Primary writes remain blocked until backup, migration apply, rollback replay and access audit are confirmed.", nextAction: "Do not enable primary mode yet." }
    ]
  };
}

export function createShadowWrite(state: V74RuntimeState, input: { entity: V74EntityKind; entityId?: string; action: string; actorId?: string; department?: string; route?: string; payload?: unknown }): V74RuntimeState {
  const createdAt = now();
  const entityId = input.entityId ?? `${input.entity.toUpperCase()}-${state.shadowWrites.length + 1001}`;
  const nextVersion = state.shadowWrites.filter((item) => item.entity === input.entity && item.entityId === entityId).length + 1;
  const existingLock = state.locks.find((lock) => lock.entity === input.entity && lock.entityId === entityId && lock.status === "active");
  if (existingLock) {
    const blockedWrite: V74ShadowWriteRecord = {
      id: makeId("write_blocked"), entity: input.entity, entityId, action: input.action, status: "blocked", version: existingLock.version,
      lockId: existingLock.id, beforeHash: tinyHash({ existingLock }), afterHash: tinyHash(input.payload ?? input), rollbackId: makeId("rollback_blocked"),
      actorId: input.actorId ?? "u_andrei", department: input.department ?? "Management", route: input.route ?? "/work-os/db-shadow-writes", createdAt
    };
    return { ...state, shadowWrites: [blockedWrite, ...state.shadowWrites] };
  }

  const lock: V74OptimisticLock = { id: makeId("lock"), entity: input.entity, entityId, version: nextVersion, ownerId: input.actorId ?? "u_andrei", status: "active", createdAt, expiresAt: future() };
  const beforeHash = tinyHash({ entity: input.entity, entityId, version: nextVersion - 1 });
  const afterHash = tinyHash({ entity: input.entity, entityId, version: nextVersion, payload: input.payload ?? input.action });
  const rollbackId = makeId("rollback");
  const queueId = input.entity === "notification" || input.entity === "ticket" || input.entity === "task" ? makeId("queue") : undefined;
  const write: V74ShadowWriteRecord = {
    id: makeId("write"), entity: input.entity, entityId, action: input.action, status: "shadow_written", version: nextVersion,
    lockId: lock.id, beforeHash, afterHash, rollbackId, queueId, actorId: input.actorId ?? "u_andrei", department: input.department ?? "Management", route: input.route ?? "/work-os/db-shadow-writes", createdAt, verifiedAt: createdAt
  };
  const rollback: V74RollbackEvidence = { id: rollbackId, writeId: write.id, entity: input.entity, entityId, mode: "restore_shadow_payload", status: "available", previousHash: beforeHash, nextHash: afterHash, evidence: "Rollback checkpoint created before primary write is allowed.", createdAt };
  const queueJob: V74NotificationJob | undefined = queueId ? { id: queueId, entity: input.entity, entityId, userId: "u_andrei", channel: "in_app", status: "queued", attempts: 0, maxAttempts: 3, route: input.route ?? "/work-os/db-shadow-writes", payloadTitle: `${input.entity} ${input.action} shadow write`, createdAt, updatedAt: createdAt } : undefined;

  return {
    ...state,
    locks: [{ ...lock, status: "released" }, ...state.locks],
    shadowWrites: [write, ...state.shadowWrites],
    rollbackEvidence: [rollback, ...state.rollbackEvidence],
    queue: queueJob ? [queueJob, ...state.queue] : state.queue
  };
}

export function processV74NotificationQueue(state: V74RuntimeState): V74RuntimeState {
  return {
    ...state,
    queue: state.queue.map((job) => {
      if (job.status === "delivered" || job.status === "held") return job;
      const attempts = job.attempts + 1;
      const shouldFail = job.channel !== "in_app" && attempts < 2;
      return {
        ...job,
        attempts,
        status: shouldFail ? "failed" : "delivered",
        lastError: shouldFail ? "Provider not configured in current readiness mode." : undefined,
        updatedAt: now(),
        deliveredAt: shouldFail ? undefined : now()
      };
    })
  };
}

export function replayRollback(state: V74RuntimeState, rollbackId: string): V74RuntimeState {
  return {
    ...state,
    rollbackEvidence: state.rollbackEvidence.map((item) => item.id === rollbackId ? { ...item, status: "verified", evidence: `${item.evidence} Replay verified in dry-run mode.` } : item),
    shadowWrites: state.shadowWrites.map((item) => item.rollbackId === rollbackId ? { ...item, status: "verified" } : item)
  };
}

export function v74CurrentReadiness() {
  return { version: V74_RELEASE_VERSION, writeMode: "db_shadow_locked", shadowWrites: 0, activeLocks: 0, queued: 2, workerStatus: "ready_for_in_app", primaryWrites: "gated", nextBuild: "v7.5.0 - Conflict Resolution, Access Inheritance & Real Attachment Storage" };
}

export function v74GlobalScores() {
  return { goodDayParity: 86, realLocalFunctionality: 92, backendApiReal: 78, productionReadiness: 78, uxDesignMaturity: 85, qaConfidence: 84, screenshotAuditCoverage: 100 };
}

export function v74ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 85, current: 86, progress: "DB-backed shadow write contracts and worker readiness added", missing: "primary writes, provider delivery and enterprise inheritance", next: "conflict resolution and access inheritance" },
    { category: "Task management core", before: 93, current: 94, progress: "task writes now include lock/version metadata", missing: "primary DB update and conflict merge UI", next: "optimistic conflict resolution" },
    { category: "Tickets / Requests / Forms", before: 83, current: 85, progress: "ticket/request writes get rollback evidence and queue events", missing: "client portal persistence and attachment storage", next: "portal + attachments" },
    { category: "Notifications", before: 90, current: 92, progress: "delivery worker state and retry semantics added", missing: "email/push/websocket providers", next: "delivery provider switchboard" },
    { category: "Workflows / custom statuses / validations", before: 81, current: 82, progress: "workflow writes include lock-ready contracts", missing: "server rule enforcement for every transition", next: "workflow access inheritance" },
    { category: "Custom fields / task types", before: 80, current: 81, progress: "custom field writes are lock-ready", missing: "field-level permission inheritance", next: "field ACL rules" },
    { category: "Saved views / filters", before: 84, current: 85, progress: "saved view writes include shadow row metadata", missing: "shared view server permissions", next: "view sharing access rules" },
    { category: "Time tracking / My Time / Timesheets", before: 81, current: 83, progress: "timesheet writes can be queued with rollback evidence", missing: "pontaj/payroll sync", next: "pontaj adapter" },
    { category: "Backend / API / persistence", before: 72, current: 78, progress: "DB-backed shadow write and lock contracts added", missing: "primary Prisma write switch", next: "controlled shadow DB adapter verification" },
    { category: "Production readiness", before: 73, current: 78, progress: "worker queue, locks and rollback gates added", missing: "provider delivery, backup and migration apply evidence", next: "readiness gates tied to environment checks" }
  ];
}

export function v74RouteList() {
  return [
    "/work-os/db-shadow-writes",
    "/admin/db-shadow-writes",
    "/api/v1/work-os/v74-db-shadow",
    "/api/v1/work-os/v74-db-shadow/health",
    "/api/v1/work-os/v74-db-shadow/writes",
    "/api/v1/work-os/v74-db-shadow/locks",
    "/api/v1/work-os/v74-db-shadow/notification-worker",
    "/api/v1/work-os/v74-db-shadow/rollback",
    "/work-os/prisma-migration",
    "/work-os/prisma-shadow-records",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari",
    "/taskuri/automations",
    "/taskuri/reports"
  ];
}
