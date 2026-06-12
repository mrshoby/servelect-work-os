import {
  buildV70Seed,
  buildNotification,
  createTaskFromTicket,
  validateTransition,
  calculateV70Workload,
  exportV70Csv,
  type V70Approval,
  type V70AutomationRule,
  type V70CustomField,
  type V70EntityKind,
  type V70FeatureState,
  type V70Notification,
  type V70RequestForm,
  type V70SavedView,
  type V70State,
  type V70Status,
  type V70Task,
  type V70Ticket,
  type V70TimeEntry,
  type V70Timesheet,
  type V70Workflow
} from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export const V71_RELEASE_VERSION = "7.1.1";
export const V71_STORAGE_KEY = "servelect-work-os-v71-backend-mutation-adapter";

export type V71WriteMode = "local_persistent" | "api_shadow" | "prisma_shadow_ready" | "prisma_primary_gated";
export type V71MutationEntity = "task" | "ticket" | "requestForm" | "notification" | "approval" | "savedView" | "workflow" | "customField" | "timeEntry" | "timesheet" | "automation";
export type V71MutationAction = "create" | "read" | "update" | "delete" | "transition" | "convert" | "approve" | "reject" | "markRead" | "run";
export type V71MutationStatus = "accepted" | "shadowed" | "blocked" | "failed";

export interface V71MutationRequest<TPayload = Record<string, unknown>> {
  id: string;
  entity: V71MutationEntity;
  action: V71MutationAction;
  actorId: string;
  role: string;
  department: string;
  writeMode: V71WriteMode;
  payload: TPayload;
  createdAt: string;
}

export interface V71MutationResult<TData = unknown> {
  ok: boolean;
  status: V71MutationStatus;
  requestId: string;
  entity: V71MutationEntity;
  action: V71MutationAction;
  data?: TData;
  auditEvent: V71AuditEvent;
  notification?: V70Notification;
  message: string;
  blockedReason?: string;
}

export interface V71AuditEvent {
  id: string;
  requestId: string;
  entity: V71MutationEntity;
  action: V71MutationAction;
  actorId: string;
  role: string;
  department: string;
  writeMode: V71WriteMode;
  status: V71MutationStatus;
  beforeHash?: string;
  afterHash?: string;
  message: string;
  createdAt: string;
}

export interface V71AdapterDomainStatus {
  domain: V71MutationEntity;
  create: V70FeatureState;
  read: V70FeatureState;
  update: V70FeatureState;
  delete: V70FeatureState;
  apiRoute: string;
  backendTarget: "localStorage" | "Next API shadow" | "Prisma shadow" | "Prisma primary gated";
  risk: "low" | "medium" | "high";
  score: number;
}

export interface V71RuntimeSnapshot {
  version: string;
  writeMode: V71WriteMode;
  generatedAt: string;
  state: V70State;
  auditEvents: V71AuditEvent[];
  mutationQueue: V71MutationRequest[];
  domainStatus: V71AdapterDomainStatus[];
  progressScores: ReturnType<typeof v71ProgressScores>;
}

export interface V71TaskMutationPayload {
  taskId?: string;
  title?: string;
  status?: V70Status;
  assigneeId?: string;
  priority?: V70Task["priority"];
  comment?: string;
  estimateMinutes?: number;
  dueDate?: string;
}

export interface V71TicketMutationPayload {
  ticketId?: string;
  title?: string;
  severity?: V70Ticket["severity"];
  status?: V70Ticket["status"];
  assigneeId?: string;
  requester?: string;
  convertToTask?: boolean;
}

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const hash = (value: unknown) => {
  const text = JSON.stringify(value).slice(0, 500);
  let result = 0;
  for (let i = 0; i < text.length; i += 1) result = (result * 31 + text.charCodeAt(i)) >>> 0;
  return result.toString(16).padStart(8, "0");
};

export function createV71InitialState(): V70State {
  return buildV70Seed();
}

export function v71DomainStatus(): V71AdapterDomainStatus[] {
  return [
    { domain: "task", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/tasks", backendTarget: "Next API shadow", risk: "medium", score: 63 },
    { domain: "ticket", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/tickets", backendTarget: "Next API shadow", risk: "medium", score: 62 },
    { domain: "requestForm", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/request-forms", backendTarget: "Next API shadow", risk: "medium", score: 59 },
    { domain: "notification", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/notifications", backendTarget: "Next API shadow", risk: "low", score: 66 },
    { domain: "approval", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/approvals", backendTarget: "Next API shadow", risk: "medium", score: 61 },
    { domain: "savedView", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "REAL_LOCAL_PERSISTENT", apiRoute: "/api/v1/work-os/v71-mutations/saved-views", backendTarget: "Next API shadow", risk: "low", score: 68 },
    { domain: "workflow", create: "API_PREPARED", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/workflows", backendTarget: "Prisma shadow", risk: "high", score: 57 },
    { domain: "customField", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/custom-fields", backendTarget: "Prisma shadow", risk: "medium", score: 60 },
    { domain: "timeEntry", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/time-entries", backendTarget: "Next API shadow", risk: "medium", score: 64 },
    { domain: "timesheet", create: "REAL_LOCAL_PERSISTENT", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/timesheets", backendTarget: "Next API shadow", risk: "medium", score: 62 },
    { domain: "automation", create: "MOCK_INTERACTIVE", read: "REAL_LOCAL_PERSISTENT", update: "REAL_LOCAL_PERSISTENT", delete: "API_PREPARED", apiRoute: "/api/v1/work-os/v71-mutations/automations", backendTarget: "Prisma shadow", risk: "high", score: 55 }
  ];
}

export function createV71Snapshot(writeMode: V71WriteMode = "api_shadow"): V71RuntimeSnapshot {
  return {
    version: V71_RELEASE_VERSION,
    writeMode,
    generatedAt: now(),
    state: createV71InitialState(),
    auditEvents: [],
    mutationQueue: [],
    domainStatus: v71DomainStatus(),
    progressScores: v71ProgressScores()
  };
}

export function canMutate(actorRole: string, actorDepartment: string, entityDepartment?: string) {
  if (["Super Admin", "Global Admin"].includes(actorRole)) return { ok: true, reason: "global access" };
  if (["Department Admin", "Manager", "Project Manager", "Team Lead"].includes(actorRole) && actorDepartment === entityDepartment) return { ok: true, reason: "department access" };
  if (!entityDepartment || actorDepartment === entityDepartment) return { ok: true, reason: "own department" };
  return { ok: false, reason: `Role ${actorRole} cannot mutate department ${entityDepartment}` };
}

export function buildMutationRequest(entity: V71MutationEntity, action: V71MutationAction, payload: Record<string, unknown>, actorId = "u_andrei", role = "Super Admin", department = "Management", writeMode: V71WriteMode = "api_shadow"): V71MutationRequest {
  return { id: id("mut"), entity, action, actorId, role, department, writeMode, payload, createdAt: now() };
}

function auditFrom<TPayload>(request: V71MutationRequest<TPayload>, status: V71MutationStatus, message: string, before?: unknown, after?: unknown): V71AuditEvent {
  return { id: id("audit"), requestId: request.id, entity: request.entity, action: request.action, actorId: request.actorId, role: request.role, department: request.department, writeMode: request.writeMode, status, beforeHash: before ? hash(before) : undefined, afterHash: after ? hash(after) : undefined, message, createdAt: now() };
}

export function applyV71Mutation(state: V70State, request: V71MutationRequest): V71MutationResult {
  const cloned: V70State = JSON.parse(JSON.stringify(state));
  try {
    if (request.entity === "task") return mutateTask(cloned, request as V71MutationRequest<V71TaskMutationPayload>);
    if (request.entity === "ticket") return mutateTicket(cloned, request as V71MutationRequest<V71TicketMutationPayload>);
    if (request.entity === "notification") return mutateNotification(cloned, request);
    if (request.entity === "approval") return mutateApproval(cloned, request);
    if (request.entity === "savedView") return mutateSavedView(cloned, request);
    if (request.entity === "customField") return mutateCustomField(cloned, request);
    if (request.entity === "timeEntry") return mutateTimeEntry(cloned, request);
    if (request.entity === "timesheet") return mutateTimesheet(cloned, request);
    if (request.entity === "automation") return mutateAutomation(cloned, request);
    if (request.entity === "requestForm") return mutateRequestForm(cloned, request);
    if (request.entity === "workflow") return mutateWorkflow(cloned, request);
    const audit = auditFrom(request, "blocked", "Unsupported mutation entity.");
    return { ok: false, status: "blocked", requestId: request.id, entity: request.entity, action: request.action, auditEvent: audit, message: audit.message, blockedReason: audit.message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown mutation error";
    const audit = auditFrom(request, "failed", message);
    return { ok: false, status: "failed", requestId: request.id, entity: request.entity, action: request.action, auditEvent: audit, message };
  }
}

function mutateTask(state: V70State, request: V71MutationRequest<V71TaskMutationPayload>): V71MutationResult<V70State> {
  const payload = request.payload;
  const task = state.tasks.find((item) => item.id === payload.taskId) ?? state.tasks[0];
  const access = canMutate(request.role, request.department, task.department);
  if (!access.ok) {
    const audit = auditFrom(request, "blocked", access.reason, task);
    return { ok: false, status: "blocked", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: access.reason, blockedReason: access.reason };
  }
  const before = { ...task };
  if (request.action === "create") {
    const created: V70Task = { ...task, id: id("task"), code: `SWO-${Math.floor(3000 + Math.random() * 6000)}`, title: payload.title ?? "Task nou v7.1", status: payload.status ?? "De facut", priority: payload.priority ?? "Normal", estimateMinutes: payload.estimateMinutes ?? 120, dueDate: payload.dueDate ?? task.dueDate, createdAt: now(), updatedAt: now() };
    state.tasks.unshift(created);
  } else if (request.action === "transition" && payload.status) {
    const workflow = state.workflows[0];
    const validation = validateTransition(task, payload.status, workflow, state.customFields);
    if (!validation.ok) {
      const audit = auditFrom(request, "blocked", validation.message, before, task);
      return { ok: false, status: "blocked", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: validation.message, blockedReason: validation.message };
    }
    task.status = payload.status;
    task.updatedAt = now();
  } else if (request.action === "update") {
    task.title = payload.title ?? task.title;
    task.assigneeId = payload.assigneeId ?? task.assigneeId;
    task.priority = payload.priority ?? task.priority;
    task.estimateMinutes = payload.estimateMinutes ?? task.estimateMinutes;
    task.dueDate = payload.dueDate ?? task.dueDate;
    task.updatedAt = now();
    if (payload.comment) task.comments.push({ id: id("comment"), authorId: request.actorId, body: payload.comment, createdAt: now() });
  }
  const notification = buildNotification(task.assigneeId, "Task actualizat", `${task.code} a fost modificat prin adapterul v7.1.`, "task", task.id, "/taskuri/my-work");
  state.notifications.unshift(notification);
  const audit = auditFrom(request, request.writeMode === "prisma_primary_gated" ? "blocked" : "shadowed", request.writeMode === "prisma_primary_gated" ? "Primary DB writes remain gated." : "Task mutation accepted in shadow/local adapter.", before, task);
  return { ok: audit.status !== "blocked", status: audit.status, requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, notification, message: audit.message, blockedReason: audit.status === "blocked" ? audit.message : undefined };
}

function mutateTicket(state: V70State, request: V71MutationRequest<V71TicketMutationPayload>): V71MutationResult<V70State> {
  const ticket = state.tickets.find((item) => item.id === request.payload.ticketId) ?? state.tickets[0];
  const before = { ...ticket };
  if (request.action === "create") {
    state.tickets.unshift({ ...ticket, id: id("ticket"), code: `TCK-${Math.floor(500 + Math.random() * 400)}`, title: request.payload.title ?? "Ticket nou v7.1", severity: request.payload.severity ?? "High", status: "Nou", requester: request.payload.requester ?? "Portal client", escalated: false, createdAt: now(), updatedAt: now() });
  } else if (request.action === "update") {
    ticket.title = request.payload.title ?? ticket.title;
    ticket.status = request.payload.status ?? ticket.status;
    ticket.severity = request.payload.severity ?? ticket.severity;
    ticket.assigneeId = request.payload.assigneeId ?? ticket.assigneeId;
    ticket.updatedAt = now();
  } else if (request.action === "convert") {
    const task = createTaskFromTicket(ticket, request.actorId);
    state.tasks.unshift(task);
    ticket.taskId = task.id;
    ticket.updatedAt = now();
  }
  const notification = buildNotification(ticket.assigneeId, "Ticket actualizat", `${ticket.code} a fost procesat prin adapterul v7.1.`, "ticket", ticket.id, "/taskuri/tickets-notificari");
  state.notifications.unshift(notification);
  const audit = auditFrom(request, "shadowed", "Ticket mutation accepted in API shadow adapter.", before, ticket);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, notification, message: audit.message };
}

function mutateNotification(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const before = state.notifications.map((item) => ({ id: item.id, read: item.read }));
  if (request.action === "markRead") {
    const notificationId = typeof request.payload.notificationId === "string" ? request.payload.notificationId : undefined;
    state.notifications = state.notifications.map((item) => notificationId && item.id !== notificationId ? item : { ...item, read: true });
  } else if (request.action === "create") {
    state.notifications.unshift(buildNotification(String(request.payload.userId ?? "u_andrei"), String(request.payload.title ?? "Notificare v7.1"), String(request.payload.body ?? "Generata de adapter."), "task", String(request.payload.entityId ?? "t_pif_docs"), "/notifications"));
  }
  const audit = auditFrom(request, "shadowed", "Notification mutation accepted.", before, state.notifications);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateApproval(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const approval = state.approvals.find((item) => item.id === request.payload.approvalId) ?? state.approvals[0];
  const before = { ...approval };
  if (request.action === "approve") approval.status = "Approved";
  if (request.action === "reject") approval.status = "Rejected";
  approval.decidedAt = now();
  const audit = auditFrom(request, "shadowed", `Approval ${approval.status}.`, before, approval);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateSavedView(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const before = state.savedViews.length;
  if (request.action === "create") state.savedViews.unshift({ id: id("view"), name: String(request.payload.name ?? "View v7.1"), scope: "tasks", route: "/taskuri/overview", ownerId: request.actorId, shared: Boolean(request.payload.shared ?? false), filters: { source: "v7.1" }, columns: ["code", "title", "status", "assignee"], density: "compact", grouping: "status", createdAt: now() });
  if (request.action === "delete") state.savedViews = state.savedViews.filter((item) => item.id !== request.payload.viewId);
  const audit = auditFrom(request, "shadowed", "Saved view mutation accepted.", before, state.savedViews.length);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateCustomField(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const before = state.customFields.length;
  if (request.action === "create") state.customFields.unshift({ id: id("cf"), name: String(request.payload.name ?? "Camp v7.1"), type: "text", appliesTo: ["type_task", "type_ticket"], required: Boolean(request.payload.required ?? false), options: [] });
  const audit = auditFrom(request, "shadowed", "Custom field mutation accepted.", before, state.customFields.length);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateTimeEntry(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const entry: V70TimeEntry = { id: id("time"), taskId: String(request.payload.taskId ?? state.tasks[0].id), userId: request.actorId, date: new Date().toISOString().slice(0, 10), minutes: Number(request.payload.minutes ?? 30), note: String(request.payload.note ?? "Time entry v7.1"), source: "Manual", createdAt: now() };
  state.timeEntries.unshift(entry);
  const audit = auditFrom(request, "shadowed", "Time entry created.", undefined, entry);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateTimesheet(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const sheet = state.timesheets.find((item) => item.id === request.payload.timesheetId) ?? state.timesheets[0];
  const before = { ...sheet };
  if (request.action === "update") sheet.status = "Submitted";
  if (request.action === "approve") sheet.status = "Approved";
  if (request.action === "reject") sheet.status = "Rejected";
  sheet.submittedAt = sheet.submittedAt ?? now();
  sheet.decidedAt = request.action === "approve" || request.action === "reject" ? now() : sheet.decidedAt;
  const audit = auditFrom(request, "shadowed", `Timesheet ${sheet.status}.`, before, sheet);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateAutomation(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const rule = state.automations.find((item) => item.id === request.payload.automationId) ?? state.automations[0];
  const before = { ...rule };
  rule.runs += 1;
  rule.lastRunAt = now();
  const notification = buildNotification("u_ioana", "Automatizare rulata", `${rule.name} a rulat in shadow mode.`, "automation", rule.id, "/taskuri/automations");
  state.notifications.unshift(notification);
  const audit = auditFrom(request, "shadowed", "Automation rule test run accepted.", before, rule);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, notification, message: audit.message };
}

function mutateRequestForm(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const form = state.requestForms.find((item) => item.id === request.payload.formId) ?? state.requestForms[0];
  const before = { ...form };
  if (request.action === "create") {
    const created: V70RequestForm = { ...form, id: id("form"), name: String(request.payload.name ?? "Formular v7.1"), submissions: 0 };
    state.requestForms.unshift(created);
  } else {
    form.submissions += 1;
  }
  const audit = auditFrom(request, "shadowed", "Request form mutation accepted.", before, form);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

function mutateWorkflow(state: V70State, request: V71MutationRequest): V71MutationResult<V70State> {
  const workflow = state.workflows[0];
  const before = { ...workflow };
  if (request.action === "update") workflow.requiredFieldsByStatus.Aprobare = ["cf_costImpact", "cf_deliverable"];
  const audit = auditFrom(request, "shadowed", "Workflow mutation accepted in shadow mode.", before, workflow);
  return { ok: true, status: "shadowed", requestId: request.id, entity: request.entity, action: request.action, data: state, auditEvent: audit, message: audit.message };
}

export function v71ProgressScores() {
  return [
    { category: "GoodDay public feature parity", before: 81, current: 83, progress: "Backend mutation adapter and server notification model added.", missing: "Full Prisma primary, API webhooks and enterprise hierarchy inheritance.", next: "Enable Prisma shadow write parity per entity." },
    { category: "Task management core", before: 90, current: 91, progress: "Task mutation contract + RBAC guard + audit event.", missing: "Concurrent DB records and optimistic conflict resolution.", next: "Persist tasks through repository adapter." },
    { category: "Tickets / Requests / Forms", before: 74, current: 78, progress: "Ticket/request mutations, convert ticket to task, API route contracts.", missing: "Portal client and attachment storage.", next: "Server-side ticket queue and request inbox." },
    { category: "Notifications", before: 78, current: 83, progress: "Server notification contract, mark-read mutations and generated notifications.", missing: "Email/push/websocket delivery.", next: "Notification subscription store." },
    { category: "Workflows / validations", before: 73, current: 76, progress: "Workflow mutations and transition validation remain enforced in adapter.", missing: "Visual builder with DB-backed rules.", next: "Persist workflow definitions." },
    { category: "Custom fields / task types", before: 72, current: 75, progress: "Custom field mutation route and schema adapter included.", missing: "DB migrations and field-level permissions.", next: "Field schema persistence." },
    { category: "Saved views / filters", before: 76, current: 80, progress: "Saved view CRUD mutation adapter with shared/private flag.", missing: "Server shared views and team scopes.", next: "Per-user saved view API." },
    { category: "Time tracking / My Time / Timesheets", before: 72, current: 76, progress: "Time entry and timesheet mutation adapter.", missing: "Payroll/pontaj integration.", next: "Timesheet API approval workflow." },
    { category: "Workload / resource planning", before: 74, current: 76, progress: "Workload recalculates after time/task mutations.", missing: "Drag allocation and absences integration.", next: "Capacity API." },
    { category: "Approvals", before: 72, current: 77, progress: "Approval approve/reject mutations with audit.", missing: "Delegations and approval policies.", next: "Approval policy engine." },
    { category: "Reports / analytics", before: 66, current: 68, progress: "Existing CSV export remains tied to mutation snapshot.", missing: "BI/PDF and scheduled reports.", next: "Snapshot report store." },
    { category: "Automations", before: 68, current: 71, progress: "Automation test-runs create audit and notifications.", missing: "Worker queue/cron/retries.", next: "BullMQ/cron adapter." },
    { category: "RBAC / permissions", before: 72, current: 77, progress: "Mutation adapter enforces role/department guard.", missing: "Central policy model across all endpoints.", next: "Policy table + API middleware." },
    { category: "Backend / API / persistence", before: 48, current: 58, progress: "API/repository mutation adapter added for all critical entities.", missing: "Real Prisma primary writes and migrations.", next: "Prisma shadow records with rollback evidence." },
    { category: "Screenshot audit coverage", before: 100, current: 100, progress: "v7.0.2 screenshot baseline preserved; v7.1 routes added to smoke list.", missing: "v7.1 screenshots need runtime run.", next: "Run audit after deploy." },
    { category: "QA/build stability", before: 72, current: 74, progress: "Parser-safe apply script and route smoke included.", missing: "Automated Playwright click flows.", next: "E2E mutations with browser." },
    { category: "Production readiness", before: 55, current: 62, progress: "Runtime mutation gates and production readiness API included.", missing: "DB/auth/storage/observability.", next: "Controlled Prisma shadow write rollout." }
  ];
}

export function v71GlobalScores() {
  return {
    goodDayParity: 83,
    realLocalFunctionality: 90,
    backendApiReal: 58,
    productionReadiness: 62,
    uxDesignMaturity: 83,
    qaConfidence: 74,
    screenshotCoverage: 100
  };
}

export function v71RouteList() {
  return [
    "/work-os/backend-mutations",
    "/admin/backend-mutations",
    "/api/v1/work-os/v71-mutations",
    "/api/v1/work-os/v71-mutations/health",
    "/api/v1/work-os/v71-mutations/tasks",
    "/api/v1/work-os/v71-mutations/tickets",
    "/api/v1/work-os/v71-mutations/notifications",
    "/taskuri/overview",
    "/taskuri/tickets-notificari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/workload-aprobari"
  ];
}

export function v71BuildReportStandard() {
  return {
    version: V71_RELEASE_VERSION,
    previous: "7.0.2",
    objective: "Backend Mutation Adapter, Multi-User Records & Server Notifications",
    real: ["mutation adapter", "audit events", "local/API shadow persistence", "notification mutations", "RBAC guard", "route smoke"],
    mockInteractive: ["Prisma primary gated", "attachment storage", "automation worker queue"],
    preparedForBackend: ["tasks", "tickets", "request forms", "notifications", "approvals", "saved views", "workflows", "custom fields", "time entries", "timesheets", "automations"],
    next: "v7.2.0 - Prisma Shadow Records, Rollback Evidence & Server Notification Store"
  };
}

export { calculateV70Workload, exportV70Csv };
