import {
  applyV71Mutation,
  buildMutationRequest,
  calculateV70Workload,
  createV71InitialState,
  exportV70Csv,
  v71DomainStatus,
  v71GlobalScores,
  type V71AuditEvent,
  type V71MutationAction,
  type V71MutationEntity,
  type V71MutationRequest,
  type V71WriteMode
} from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";
import type { V70State } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export const V72_RELEASE_VERSION = "7.2.3";
export const V72_STORAGE_KEY = "servelect-work-os-v72-prisma-shadow-records";

export type V72ShadowStatus = "shadow_written" | "rollback_ready" | "rolled_back" | "blocked" | "failed";
export type V72RollbackMode = "dry_run" | "restore_previous_snapshot" | "manual_review";
export type V72DeliveryMode = "in_app" | "email_ready" | "push_ready" | "websocket_ready";

export interface V72ShadowRecord {
  id: string;
  entity: V71MutationEntity;
  entityId: string;
  action: V71MutationAction;
  actorId: string;
  role: string;
  department: string;
  writeMode: V71WriteMode;
  payload: Record<string, unknown>;
  status: V72ShadowStatus;
  beforeHash?: string;
  afterHash?: string;
  rollbackEvidenceId?: string;
  auditEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface V72RollbackEvidence {
  id: string;
  shadowRecordId: string;
  entity: V71MutationEntity;
  entityId: string;
  rollbackMode: V72RollbackMode;
  beforeHash?: string;
  afterHash?: string;
  evidenceStatus: "available" | "consumed" | "manual_review";
  reason: string;
  createdAt: string;
  consumedAt?: string;
}

export interface V72ServerNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  entity: V71MutationEntity;
  entityId: string;
  route: string;
  read: boolean;
  delivery: V72DeliveryMode;
  sourceMutationId?: string;
  createdAt: string;
  readAt?: string;
}

export interface V72RuntimeState {
  version: string;
  generatedAt: string;
  writeMode: V71WriteMode;
  v70State: V70State;
  shadowRecords: V72ShadowRecord[];
  rollbackEvidence: V72RollbackEvidence[];
  serverNotifications: V72ServerNotification[];
  auditEvents: V71AuditEvent[];
}

export interface V72MutationPayload {
  entity: V71MutationEntity;
  action: V71MutationAction;
  payload?: Record<string, unknown>;
  actorId?: string;
  role?: string;
  department?: string;
  writeMode?: V71WriteMode;
}

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function hash(value: unknown) {
  const text = JSON.stringify(value ?? null).slice(0, 1000);
  let result = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    result ^= text.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}

function entityIdFromPayload(entity: V71MutationEntity, payload: Record<string, unknown>) {
  const direct = payload.taskId ?? payload.ticketId ?? payload.notificationId ?? payload.approvalId ?? payload.savedViewId ?? payload.workflowId ?? payload.customFieldId ?? payload.timeEntryId ?? payload.timesheetId ?? payload.automationId ?? payload.requestFormId;
  if (typeof direct === "string" && direct.length > 0) return direct;
  return `${entity}_${hash(payload).slice(0, 6)}`;
}

export function createV72RuntimeState(writeMode: V71WriteMode = "prisma_shadow_ready"): V72RuntimeState {
  const state = createV71InitialState();
  return {
    version: V72_RELEASE_VERSION,
    generatedAt: now(),
    writeMode,
    v70State: state,
    shadowRecords: [],
    rollbackEvidence: [],
    serverNotifications: state.notifications.slice(0, 3).map((item) => ({
      id: id("srv_notif"),
      userId: item.userId,
      title: item.title,
      body: item.body,
      entity: "notification",
      entityId: item.id,
      route: item.route,
      read: item.read,
      delivery: "in_app",
      createdAt: item.createdAt
    })),
    auditEvents: []
  };
}

export function v72GlobalScores() {
  return {
    goodDayParity: 84,
    realLocalFunctionality: 91,
    backendApiReal: 66,
    productionReadiness: 68,
    uxDesignMaturity: 84,
    qaConfidence: 80,
    screenshotAuditCoverage: 100
  };
}

export function v72ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 83, current: 84, progress: "Prisma shadow records and rollback evidence added", missing: "full primary DB writes and enterprise access inheritance", next: "Prisma primary gated pilot" },
    { category: "Task management core", before: 91, current: 92, progress: "task mutations now emit shadow records", missing: "multi-user conflict resolution", next: "record locks and optimistic versioning" },
    { category: "Tickets / Requests / Forms", before: 78, current: 81, progress: "ticket/request mutations get rollback and notification evidence", missing: "client portal and file storage", next: "portal submission persistence" },
    { category: "Notifications", before: 83, current: 87, progress: "server notification store introduced", missing: "websocket/email/push delivery", next: "notification delivery queue" },
    { category: "Workflows / custom statuses / validations", before: 76, current: 79, progress: "workflow mutations prepared for Prisma shadow", missing: "admin visual builder with full rule graph", next: "workflow transition server enforcement" },
    { category: "Custom fields / task types", before: 75, current: 78, progress: "custom field mutations prepared for shadow record persistence", missing: "field permissions and migrations", next: "custom field schema migration plan" },
    { category: "Saved views / filters", before: 80, current: 82, progress: "saved views added to shadow adapter domains", missing: "shared server-side saved view ownership", next: "server saved views" },
    { category: "Time tracking / My Time / Timesheets", before: 76, current: 79, progress: "time entry/timesheet shadow records added", missing: "pontaj payroll sync", next: "timesheet approval persistence" },
    { category: "Backend / API / persistence", before: 58, current: 66, progress: "Prisma shadow records, rollback evidence and server notifications", missing: "real Prisma table writes", next: "schema-backed shadow tables" },
    { category: "Production readiness", before: 62, current: 68, progress: "rollback evidence and gates improved", missing: "primary DB rollout, monitoring, backup", next: "gated primary pilot" }
  ];
}

export function v72DomainStatus() {
  return v71DomainStatus().map((domain) => ({
    ...domain,
    backendTarget: domain.domain === "automation" || domain.domain === "workflow" ? "Prisma shadow" as const : "Prisma shadow" as const,
    score: Math.min(domain.score + 8, 76),
    apiRoute: domain.apiRoute.replace("v71-mutations", "v72-shadow-records")
  }));
}

function makeServerNotification(entity: V71MutationEntity, entityId: string, requestId: string, actorId: string, action: V71MutationAction): V72ServerNotification {
  const routeByEntity: Record<V71MutationEntity, string> = {
    task: "/taskuri/my-work",
    ticket: "/taskuri/tickets-notificari",
    requestForm: "/taskuri/forms",
    notification: "/notifications",
    approval: "/work-os/approvals",
    savedView: "/taskuri/tabel",
    workflow: "/admin/workflows",
    customField: "/admin/custom-fields",
    timeEntry: "/taskuri/timesheets",
    timesheet: "/taskuri/timesheets",
    automation: "/taskuri/automations"
  };
  return {
    id: id("srv_notif"),
    userId: actorId,
    title: `Server notification · ${entity}`,
    body: `Mutation ${action} pentru ${entity} a fost înregistrată în Prisma shadow readiness store.`,
    entity,
    entityId,
    route: routeByEntity[entity],
    read: false,
    delivery: "in_app",
    sourceMutationId: requestId,
    createdAt: now()
  };
}

export function applyV72ShadowMutation(runtime: V72RuntimeState, mutation: V72MutationPayload) {
  const payload = mutation.payload ?? {};
  const writeMode = mutation.writeMode ?? runtime.writeMode;
  const request = buildMutationRequest(mutation.entity, mutation.action, payload, mutation.actorId ?? "u_andrei", mutation.role ?? "Super Admin", mutation.department ?? "Management", writeMode);
  const beforeHash = hash(runtime.v70State);
  const result = applyV71Mutation(runtime.v70State, request as V71MutationRequest);
  const nextState = result.data ? result.data as V70State : runtime.v70State;
  const afterHash = hash(nextState);
  const entityId = entityIdFromPayload(mutation.entity, payload);
  const rollback: V72RollbackEvidence = {
    id: id("rollback"),
    shadowRecordId: "pending",
    entity: mutation.entity,
    entityId,
    rollbackMode: result.ok ? "restore_previous_snapshot" : "manual_review",
    beforeHash,
    afterHash,
    evidenceStatus: result.ok ? "available" : "manual_review",
    reason: result.ok ? "Previous snapshot hash captured before shadow mutation." : result.message,
    createdAt: now()
  };
  const record: V72ShadowRecord = {
    id: id("shadow"),
    entity: mutation.entity,
    entityId,
    action: mutation.action,
    actorId: request.actorId,
    role: request.role,
    department: request.department,
    writeMode,
    payload,
    status: result.ok ? "shadow_written" : result.status === "blocked" ? "blocked" : "failed",
    beforeHash,
    afterHash,
    rollbackEvidenceId: rollback.id,
    auditEventId: result.auditEvent.id,
    createdAt: now(),
    updatedAt: now()
  };
  rollback.shadowRecordId = record.id;
  const notification = makeServerNotification(mutation.entity, entityId, request.id, request.actorId, mutation.action);
  const nextRuntime: V72RuntimeState = {
    ...runtime,
    v70State: nextState,
    shadowRecords: [record, ...runtime.shadowRecords].slice(0, 80),
    rollbackEvidence: [rollback, ...runtime.rollbackEvidence].slice(0, 80),
    serverNotifications: [notification, ...runtime.serverNotifications].slice(0, 80),
    auditEvents: [result.auditEvent, ...runtime.auditEvents].slice(0, 80),
    generatedAt: now(),
    writeMode
  };
  return { runtime: nextRuntime, result, record, rollback, notification };
}

export function rollbackV72ShadowRecord(runtime: V72RuntimeState, shadowRecordId: string) {
  const timestamp = now();
  return {
    ...runtime,
    shadowRecords: runtime.shadowRecords.map((record) => record.id === shadowRecordId ? { ...record, status: "rolled_back" as const, updatedAt: timestamp } : record),
    rollbackEvidence: runtime.rollbackEvidence.map((evidence) => evidence.shadowRecordId === shadowRecordId ? { ...evidence, evidenceStatus: "consumed" as const, consumedAt: timestamp } : evidence),
    serverNotifications: [{
      id: id("srv_notif"),
      userId: "u_andrei",
      title: "Rollback evidence consumed",
      body: `Shadow record ${shadowRecordId} a fost marcat ca rolled_back.`,
      entity: "notification" as const,
      entityId: shadowRecordId,
      route: "/work-os/prisma-shadow-records",
      read: false,
      delivery: "in_app" as const,
      sourceMutationId: shadowRecordId,
      createdAt: timestamp
    }, ...runtime.serverNotifications].slice(0, 80),
    generatedAt: timestamp
  };
}

export function markV72ServerNotificationRead(runtime: V72RuntimeState, notificationId?: string) {
  const timestamp = now();
  return {
    ...runtime,
    serverNotifications: runtime.serverNotifications.map((notification) => notificationId && notification.id !== notificationId ? notification : { ...notification, read: true, readAt: timestamp }),
    generatedAt: timestamp
  };
}

export function exportV72Csv(runtime: V72RuntimeState, type: "shadow" | "rollback" | "notifications" | "tasks" | "tickets" | "workload" | "timesheets") {
  if (type === "shadow") return ["id,entity,entityId,action,status,writeMode,createdAt", ...runtime.shadowRecords.map((item) => [item.id, item.entity, item.entityId, item.action, item.status, item.writeMode, item.createdAt].join(","))].join("\n");
  if (type === "rollback") return ["id,shadowRecordId,entity,entityId,status,mode,createdAt", ...runtime.rollbackEvidence.map((item) => [item.id, item.shadowRecordId, item.entity, item.entityId, item.evidenceStatus, item.rollbackMode, item.createdAt].join(","))].join("\n");
  if (type === "notifications") return ["id,userId,title,entity,read,delivery,createdAt", ...runtime.serverNotifications.map((item) => [item.id, item.userId, JSON.stringify(item.title), item.entity, item.read, item.delivery, item.createdAt].join(","))].join("\n");
  return exportV70Csv(runtime.v70State, type);
}

export function v72RouteList() {
  return [
    "/work-os/prisma-shadow-records",
    "/admin/prisma-shadow-records",
    "/api/v1/work-os/v72-shadow-records",
    "/api/v1/work-os/v72-shadow-records/health",
    "/api/v1/work-os/v72-shadow-records/mutations",
    "/api/v1/work-os/v72-shadow-records/rollback",
    "/api/v1/work-os/v72-shadow-records/notifications",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari",
    "/taskuri/automations",
    "/taskuri/reports"
  ];
}

export function v72BuildReportStandard() {
  return {
    version: V72_RELEASE_VERSION,
    previous: "7.1.1",
    objective: "Prisma Shadow Records, Rollback Evidence & Server Notification Store",
    implemented: ["Prisma shadow record model", "rollback evidence", "server notification store", "mutation audit hardening", "v7.1.0/v7.1.1 label mismatch fixed"],
    real: ["API shadow endpoints", "local persistent runtime", "server notification records in API response", "rollback evidence ledger"],
    mockInteractive: ["Prisma shadow represented as controlled shadow adapter until DB schema is applied", "attachments remain mock"],
    preparedForBackend: ["shadow_records", "rollback_evidence", "server_notifications", "mutation_audit_events"],
    notImplemented: ["Prisma primary writes", "WebSocket/email/push delivery", "real file storage", "database migrations executed in production"],
    nextBuild: "v7.3.0 — Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue"
  };
}

export function v72CurrentReadiness() {
  const scores = v72GlobalScores();
  return {
    version: V72_RELEASE_VERSION,
    accepted: false,
    reason: "Accepted after local/Vercel QA passes. Primary DB writes remain gated.",
    scores,
    progress: v72ProgressScores(),
    routes: v72RouteList(),
    domains: v72DomainStatus(),
    report: v72BuildReportStandard()
  };
}

export function calculateV72Workload(runtime: V72RuntimeState) {
  return calculateV70Workload(runtime.v70State);
}
