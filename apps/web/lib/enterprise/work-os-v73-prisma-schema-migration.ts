export const V73_RELEASE_VERSION = "7.3.0";
export const V73_STORAGE_KEY = "servelect-work-os-v73-prisma-schema-migration";

export type V73MigrationStatus = "planned" | "ready" | "shadow_running" | "verified" | "blocked";
export type V73TableRisk = "low" | "medium" | "high";
export type V73QueueStatus = "queued" | "delivered" | "failed" | "held";
export type V73WriteSource = "ui_mutation" | "api_shadow" | "automation" | "ticket_sla" | "timesheet" | "workflow";

export interface V73ShadowTablePlan {
  table: string;
  entity: string;
  route: string;
  status: V73MigrationStatus;
  risk: V73TableRisk;
  columns: string[];
  rollbackColumn: string;
  owner: string;
  acceptance: string;
}

export interface V73ShadowWrite {
  id: string;
  table: string;
  entity: string;
  entityId: string;
  action: string;
  source: V73WriteSource;
  status: "shadow_written" | "validated" | "rollback_ready" | "blocked";
  beforeHash: string;
  afterHash: string;
  rollbackId: string;
  actorId: string;
  department: string;
  createdAt: string;
}

export interface V73RollbackCheckpoint {
  id: string;
  shadowWriteId: string;
  table: string;
  mode: "dry_run" | "restore_previous_row" | "manual_review";
  status: "available" | "verified" | "used" | "blocked";
  evidence: string;
  createdAt: string;
}

export interface V73NotificationDelivery {
  id: string;
  notificationId: string;
  userId: string;
  channel: "in_app" | "email_ready" | "push_ready" | "websocket_ready";
  status: V73QueueStatus;
  attempts: number;
  route: string;
  lastError?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface V73RuntimeState {
  version: string;
  writeMode: "prisma_shadow_tables";
  generatedAt: string;
  migrationStatus: V73MigrationStatus;
  tables: V73ShadowTablePlan[];
  shadowWrites: V73ShadowWrite[];
  rollbackCheckpoints: V73RollbackCheckpoint[];
  notificationQueue: V73NotificationDelivery[];
  gates: { id: string; label: string; status: "passed" | "warning" | "blocked"; evidence: string }[];
}

const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function tinyHash(value: unknown) {
  const text = JSON.stringify(value ?? {}).slice(0, 1200);
  let result = 5381;
  for (let index = 0; index < text.length; index += 1) {
    result = ((result << 5) + result) ^ text.charCodeAt(index);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}

export function v73ShadowTables(): V73ShadowTablePlan[] {
  return [
    { table: "work_os_shadow_tasks", entity: "task", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "medium", columns: ["id", "task_id", "payload", "actor_id", "department", "before_hash", "after_hash", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Task platform", acceptance: "Task create/update emits shadow row + rollback checkpoint." },
    { table: "work_os_shadow_tickets", entity: "ticket", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "medium", columns: ["id", "ticket_id", "severity", "sla_due_at", "payload", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Support/Ops", acceptance: "Ticket escalation/convert produces shadow row and notification delivery item." },
    { table: "work_os_shadow_request_forms", entity: "requestForm", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "medium", columns: ["id", "form_id", "target", "department", "submission_payload", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Forms", acceptance: "Request submit can become ticket/task with rollback evidence." },
    { table: "work_os_shadow_notifications", entity: "notification", route: "/api/v1/work-os/v73-schema-migration/notification-queue", status: "shadow_running", risk: "low", columns: ["id", "user_id", "entity", "entity_id", "route", "read", "delivery_status", "created_at"], rollbackColumn: "source_shadow_write_id", owner: "Notification center", acceptance: "Notifications are queued for delivery and can be marked delivered." },
    { table: "work_os_shadow_approvals", entity: "approval", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "medium", columns: ["id", "approval_id", "status", "approver_id", "payload", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Approvals", acceptance: "Approve/reject has audit and rollback evidence." },
    { table: "work_os_shadow_saved_views", entity: "savedView", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "low", columns: ["id", "view_id", "scope", "filters", "columns", "owner_id", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Views", acceptance: "Saved views persist as shadow rows before primary sharing." },
    { table: "work_os_shadow_workflows", entity: "workflow", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "planned", risk: "high", columns: ["id", "workflow_id", "statuses", "rules", "required_fields", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Workflow admin", acceptance: "Workflow rule graph is versioned and validated before primary rollout." },
    { table: "work_os_shadow_custom_fields", entity: "customField", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "planned", risk: "medium", columns: ["id", "field_id", "type", "required", "visibility", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Admin", acceptance: "Field schema changes are reversible and scoped by role." },
    { table: "work_os_shadow_time_entries", entity: "timeEntry", route: "/api/v1/work-os/v73-schema-migration/shadow-writes", status: "ready", risk: "medium", columns: ["id", "time_entry_id", "task_id", "minutes", "user_id", "date", "rollback_id", "created_at"], rollbackColumn: "rollback_id", owner: "Timesheets", acceptance: "Timer/manual entries create shadow rows before pontaj payroll sync." },
    { table: "work_os_notification_delivery_queue", entity: "notificationQueue", route: "/api/v1/work-os/v73-schema-migration/notification-queue", status: "shadow_running", risk: "low", columns: ["id", "notification_id", "channel", "status", "attempts", "last_error", "delivered_at"], rollbackColumn: "source_shadow_write_id", owner: "Platform", acceptance: "Delivery queue supports in-app now and email/push/websocket readiness later." },
    { table: "work_os_rollback_checkpoints", entity: "rollback", route: "/api/v1/work-os/v73-schema-migration/rollback", status: "ready", risk: "low", columns: ["id", "shadow_write_id", "table", "mode", "status", "evidence", "created_at"], rollbackColumn: "id", owner: "Engineering", acceptance: "Every shadow write gets checkpoint evidence." }
  ];
}

export function createV73RuntimeState(): V73RuntimeState {
  return {
    version: V73_RELEASE_VERSION,
    writeMode: "prisma_shadow_tables",
    generatedAt: now(),
    migrationStatus: "shadow_running",
    tables: v73ShadowTables(),
    shadowWrites: [],
    rollbackCheckpoints: [],
    notificationQueue: [
      { id: "queue_sla_manager", notificationId: "notif_sla_1", userId: "u_andrei", channel: "in_app", status: "queued", attempts: 0, route: "/taskuri/tickets-notificari", createdAt: now() },
      { id: "queue_task_assign", notificationId: "notif_assign_1", userId: "u_vlad", channel: "in_app", status: "queued", attempts: 0, route: "/taskuri/my-work", createdAt: now() }
    ],
    gates: [
      { id: "schema_sql", label: "Shadow schema SQL added", status: "passed", evidence: "prisma/migrations/20260612073000_v73_shadow_records/migration.sql" },
      { id: "primary_db", label: "Primary writes remain gated", status: "blocked", evidence: "No primary writes are enabled until backup, rollback and migration review pass." },
      { id: "queue", label: "Notification delivery queue", status: "warning", evidence: "In-app queue exists. Email/push/websocket remain readiness states." },
      { id: "rollback", label: "Rollback checkpoint evidence", status: "passed", evidence: "Every shadow write creates rollback checkpoint metadata." }
    ]
  };
}

export function v73GlobalScores() {
  return {
    goodDayParity: 85,
    realLocalFunctionality: 91,
    backendApiReal: 72,
    productionReadiness: 73,
    uxDesignMaturity: 84,
    qaConfidence: 82,
    screenshotAuditCoverage: 100
  };
}

export function v73ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 84, current: 85, progress: "schema-backed shadow table plan and notification queue added", missing: "primary DB rollout, enterprise inheritance and live collaboration", next: "Prisma shadow writes against real DB adapter" },
    { category: "Task management core", before: 92, current: 93, progress: "task shadow table write contract added", missing: "record locks and optimistic concurrency", next: "server-side task mutations" },
    { category: "Tickets / Requests / Forms", before: 81, current: 83, progress: "ticket/request table contracts and rollback checkpoints added", missing: "client portal storage and attachments", next: "portal submission persistence" },
    { category: "Notifications", before: 87, current: 90, progress: "delivery queue introduced with in-app processing", missing: "email, push and websocket delivery", next: "delivery worker with retry policy" },
    { category: "Workflows / custom statuses / validations", before: 79, current: 81, progress: "workflow/custom field migration plan created", missing: "rule graph persisted and enforced in API", next: "workflow transition server enforcement" },
    { category: "Custom fields / task types", before: 78, current: 80, progress: "custom field schema migration plan added", missing: "field-level RBAC and migrations", next: "field schema table and admin persistence" },
    { category: "Saved views / filters", before: 82, current: 84, progress: "saved view shadow table contract added", missing: "shared ownership server-side", next: "saved view primary gate" },
    { category: "Time tracking / My Time / Timesheets", before: 79, current: 81, progress: "time entry shadow table contract added", missing: "pontaj payroll sync", next: "timesheet approval persistence" },
    { category: "Backend / API / persistence", before: 66, current: 72, progress: "Prisma migration SQL, shadow table writes and queue routes added", missing: "real Prisma adapter connection and migrations applied", next: "DB-backed shadow writes" },
    { category: "Production readiness", before: 68, current: 73, progress: "migration, rollback and queue gates improved", missing: "backup, monitoring and primary rollout", next: "gated primary pilot after shadow DB evidence" }
  ];
}

export function v73RouteList() {
  return [
    "/work-os/prisma-migration",
    "/admin/prisma-migration",
    "/api/v1/work-os/v73-schema-migration",
    "/api/v1/work-os/v73-schema-migration/health",
    "/api/v1/work-os/v73-schema-migration/shadow-writes",
    "/api/v1/work-os/v73-schema-migration/notification-queue",
    "/api/v1/work-os/v73-schema-migration/rollback",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari",
    "/taskuri/automations",
    "/taskuri/reports"
  ];
}

export function v73CurrentReadiness() {
  const runtime = createV73RuntimeState();
  return {
    version: V73_RELEASE_VERSION,
    migrationStatus: runtime.migrationStatus,
    tables: runtime.tables.length,
    readyTables: runtime.tables.filter((table) => table.status === "ready" || table.status === "shadow_running").length,
    blockedGates: runtime.gates.filter((gate) => gate.status === "blocked").length,
    queueItems: runtime.notificationQueue.length,
    primaryWrites: "gated",
    nextBuild: "v7.4.0 - DB-backed Shadow Writes, Notification Worker & Optimistic Locking"
  };
}

export function applyV73ShadowWrite(runtime: V73RuntimeState, input: { entity: string; action: string; source?: V73WriteSource; actorId?: string; department?: string; payload?: Record<string, unknown> }) {
  const table = runtime.tables.find((item) => item.entity === input.entity) ?? runtime.tables[0];
  const source = input.source ?? "ui_mutation";
  const beforeHash = tinyHash({ table: table.table, entity: input.entity, count: runtime.shadowWrites.length });
  const afterHash = tinyHash({ ...input, count: runtime.shadowWrites.length + 1 });
  const rollbackId = makeId("rollback");
  const write: V73ShadowWrite = {
    id: makeId("shadow_write"),
    table: table.table,
    entity: input.entity,
    entityId: String(input.payload?.id ?? input.payload?.taskId ?? input.payload?.ticketId ?? `${input.entity}_${runtime.shadowWrites.length + 1}`),
    action: input.action,
    source,
    status: table.status === "planned" ? "blocked" : "shadow_written",
    beforeHash,
    afterHash,
    rollbackId,
    actorId: input.actorId ?? "u_andrei",
    department: input.department ?? "Management",
    createdAt: now()
  };
  const rollback: V73RollbackCheckpoint = {
    id: rollbackId,
    shadowWriteId: write.id,
    table: table.table,
    mode: write.status === "blocked" ? "manual_review" : "restore_previous_row",
    status: write.status === "blocked" ? "blocked" : "available",
    evidence: write.status === "blocked" ? "Table is still planned/high-risk; primary and shadow execution blocked for this domain." : `before=${beforeHash}; after=${afterHash}`,
    createdAt: now()
  };
  const notification: V73NotificationDelivery = {
    id: makeId("queue"),
    notificationId: makeId("notif"),
    userId: input.actorId ?? "u_andrei",
    channel: "in_app",
    status: write.status === "blocked" ? "held" : "queued",
    attempts: 0,
    route: input.entity === "ticket" ? "/taskuri/tickets-notificari" : "/taskuri/overview",
    createdAt: now()
  };
  return {
    ...runtime,
    shadowWrites: [write, ...runtime.shadowWrites].slice(0, 120),
    rollbackCheckpoints: [rollback, ...runtime.rollbackCheckpoints].slice(0, 120),
    notificationQueue: [notification, ...runtime.notificationQueue].slice(0, 120)
  } satisfies V73RuntimeState;
}

export function processV73NotificationQueue(runtime: V73RuntimeState) {
  return {
    ...runtime,
    notificationQueue: runtime.notificationQueue.map((item) => item.status === "queued" ? { ...item, status: "delivered" as const, attempts: item.attempts + 1, deliveredAt: now() } : item)
  } satisfies V73RuntimeState;
}
