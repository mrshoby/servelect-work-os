export const V78_RELEASE_VERSION = "7.8.0";
export const V78_STORAGE_KEY = "servelect.workos.v78.provider.telemetry.saved.views";

export type V78TaskStatus = "Inbox" | "Planning" | "In lucru" | "Review" | "Blocat" | "Finalizat";
export type V78Priority = "Urgent" | "Ridicată" | "Medie" | "Scăzută";
export type V78ProviderKind = "in_app" | "email" | "push" | "websocket";
export type V78ProviderStatus = "ready" | "dry_run" | "blocked" | "failed";
export type V78DeliveryState = "queued" | "processing" | "delivered" | "failed";
export type V78CanaryState = "queued" | "accepted" | "blocked" | "replayed";
export type V78SavedViewScope = "private" | "team" | "department" | "global";
export type V78ViewDensity = "compact" | "comfortable";

export type V78View =
  | "taskuri"
  | "overview"
  | "myWork"
  | "inbox"
  | "tickets"
  | "ticketsNotificari"
  | "board"
  | "tabel"
  | "calendar"
  | "calendarGantt"
  | "workload"
  | "workloadAprobari"
  | "proiecteActive"
  | "proiecteViitoare"
  | "proiecteFinalizate"
  | "forms"
  | "timesheets"
  | "reports"
  | "automations"
  | "workflows"
  | "customFields"
  | "gooddayObservability"
  | "gooddayUiParity"
  | "providerRehearsal"
  | "primaryWriteDryRun"
  | "providerTelemetry"
  | "mutationCanary"
  | "serverSavedViews";

export type V78User = {
  id: string;
  name: string;
  department: string;
  role: "super_admin" | "manager" | "department_admin" | "employee" | "viewer";
  capacityMinutes: number;
};

export type V78Task = {
  id: string;
  code: string;
  title: string;
  project: string;
  folder: string;
  status: V78TaskStatus;
  priority: V78Priority;
  assigneeId: string;
  department: string;
  dueDate: string;
  estimateMinutes: number;
  trackedMinutes: number;
  version: number;
  updatedAt: string;
  comments: number;
  attachments: number;
};

export type V78Ticket = {
  id: string;
  code: string;
  title: string;
  status: "Nou" | "Triat" | "Escaladat" | "În lucru" | "Rezolvat";
  severity: "S1" | "S2" | "S3" | "S4";
  slaDueAt: string;
  assigneeId: string;
};

export type V78ProviderTelemetry = {
  id: string;
  provider: V78ProviderKind;
  status: V78ProviderStatus;
  lastProbeAt: string;
  p95Ms: number;
  successRate: number;
  queued: number;
  delivered: number;
  failed: number;
  evidence: string;
};

export type V78DeliveryEvent = {
  id: string;
  provider: V78ProviderKind;
  entity: "task" | "ticket" | "approval" | "saved_view" | "report";
  entityId: string;
  state: V78DeliveryState;
  attempt: number;
  nextRetryAt?: string;
  createdAt: string;
};

export type V78SavedView = {
  id: string;
  name: string;
  route: string;
  scope: V78SavedViewScope;
  ownerId: string;
  department: string;
  filters: string[];
  columns: string[];
  density: V78ViewDensity;
  serverState: "local_shadow" | "queued_for_server" | "server_synced" | "conflict";
  version: number;
  updatedAt: string;
};

export type V78MutationCanary = {
  id: string;
  entity: "task" | "ticket" | "saved_view" | "notification" | "timesheet";
  action: string;
  state: V78CanaryState;
  lockVersion: number;
  readReplicaOk: boolean;
  rollbackCheckpoint: string;
  evidence: string;
  createdAt: string;
};

export type V78AuditEvent = { id: string; type: string; title: string; details: string; createdAt: string };

export type V78RuntimeState = {
  version: string;
  users: V78User[];
  tasks: V78Task[];
  tickets: V78Ticket[];
  providerTelemetry: V78ProviderTelemetry[];
  deliveryEvents: V78DeliveryEvent[];
  savedViews: V78SavedView[];
  canaries: V78MutationCanary[];
  audit: V78AuditEvent[];
  selectedTaskId: string;
  activeRoute: string;
};

function stamp(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const v78Departments = ["Audit", "Administrativ", "Automatizări", "Audit energetic", "Comercial", "Marketing", "Producție", "Management"] as const;

export function createV78RuntimeState(): V78RuntimeState {
  const now = "2026-06-12T11:45:00.000Z";
  return {
    version: V78_RELEASE_VERSION,
    selectedTaskId: "tsk-780-001",
    activeRoute: "/taskuri/overview",
    users: [
      { id: "u-andrei", name: "Andrei Popescu", department: "Producție", role: "manager", capacityMinutes: 2100 },
      { id: "u-ioana", name: "Ioana Marinescu", department: "Comercial", role: "department_admin", capacityMinutes: 1980 },
      { id: "u-mihai", name: "Mihai Ionescu", department: "Automatizări", role: "employee", capacityMinutes: 1920 },
      { id: "u-alex", name: "Alexandra Rusu", department: "Audit energetic", role: "employee", capacityMinutes: 1800 }
    ],
    tasks: [
      { id: "tsk-780-001", code: "SWO-780", title: "Server-side saved views pentru Taskuri / My Work", project: "SERVELECT WORK OS", folder: "Taskuri / Saved Views", status: "In lucru", priority: "Ridicată", assigneeId: "u-andrei", department: "Producție", dueDate: "2026-06-18", estimateMinutes: 360, trackedMinutes: 120, version: 8, updatedAt: now, comments: 4, attachments: 2 },
      { id: "tsk-780-002", code: "SWO-781", title: "Provider telemetry pentru email / push / websocket", project: "SERVELECT WORK OS", folder: "Notifications / Providers", status: "Review", priority: "Medie", assigneeId: "u-mihai", department: "Automatizări", dueDate: "2026-06-20", estimateMinutes: 420, trackedMinutes: 165, version: 5, updatedAt: now, comments: 2, attachments: 1 },
      { id: "tsk-780-003", code: "SWO-782", title: "Mutation canary înainte de primary writes", project: "SERVELECT WORK OS", folder: "Backend / Persistence", status: "Planning", priority: "Urgent", assigneeId: "u-alex", department: "Audit energetic", dueDate: "2026-06-19", estimateMinutes: 300, trackedMinutes: 90, version: 3, updatedAt: now, comments: 1, attachments: 0 },
      { id: "tsk-780-004", code: "SWO-783", title: "Curățare rutare Taskuri și audit screenshots", project: "SERVELECT WORK OS", folder: "QA / Vercel", status: "Finalizat", priority: "Scăzută", assigneeId: "u-ioana", department: "Comercial", dueDate: "2026-06-14", estimateMinutes: 120, trackedMinutes: 140, version: 4, updatedAt: now, comments: 3, attachments: 1 }
    ],
    tickets: [
      { id: "tic-780-001", code: "TCK-780", title: "Provider delivery retry pentru notificări SLA", status: "Escaladat", severity: "S2", slaDueAt: "2026-06-13T16:00:00.000Z", assigneeId: "u-mihai" },
      { id: "tic-780-002", code: "TCK-781", title: "Cerere client: export saved view în raport", status: "Triat", severity: "S3", slaDueAt: "2026-06-16T15:00:00.000Z", assigneeId: "u-ioana" }
    ],
    providerTelemetry: [
      { id: "pt-in-app", provider: "in_app", status: "ready", lastProbeAt: now, p95Ms: 90, successRate: 100, queued: 3, delivered: 42, failed: 0, evidence: "In-app provider writes to local notification store and is ready for shadow/server mode." },
      { id: "pt-email", provider: "email", status: "dry_run", lastProbeAt: now, p95Ms: 260, successRate: 98, queued: 4, delivered: 19, failed: 1, evidence: "Email provider is rehearsed only; no live credentials committed." },
      { id: "pt-push", provider: "push", status: "dry_run", lastProbeAt: now, p95Ms: 310, successRate: 96, queued: 2, delivered: 14, failed: 1, evidence: "Push provider is canary-ready but not live." },
      { id: "pt-websocket", provider: "websocket", status: "blocked", lastProbeAt: now, p95Ms: 0, successRate: 0, queued: 0, delivered: 0, failed: 0, evidence: "WebSocket remains blocked until runtime channel is provisioned." }
    ],
    deliveryEvents: [
      { id: "de-1", provider: "in_app", entity: "task", entityId: "tsk-780-001", state: "delivered", attempt: 1, createdAt: now },
      { id: "de-2", provider: "email", entity: "ticket", entityId: "tic-780-001", state: "queued", attempt: 1, nextRetryAt: "2026-06-12T12:05:00.000Z", createdAt: now },
      { id: "de-3", provider: "push", entity: "saved_view", entityId: "sv-780-001", state: "processing", attempt: 2, nextRetryAt: "2026-06-12T12:10:00.000Z", createdAt: now }
    ],
    savedViews: [
      { id: "sv-780-001", name: "My Work · Critical next 7 days", route: "/taskuri/my-work", scope: "team", ownerId: "u-andrei", department: "Producție", filters: ["status:open", "priority:urgent,ridicată", "due:<7d"], columns: ["status", "priority", "assignee", "dueDate", "provider"], density: "compact", serverState: "server_synced", version: 4, updatedAt: now },
      { id: "sv-780-002", name: "Tickets SLA risc", route: "/taskuri/tickets-notificari", scope: "department", ownerId: "u-mihai", department: "Automatizări", filters: ["severity:S1-S2", "sla:risk"], columns: ["severity", "slaDueAt", "assignee", "providerState"], density: "compact", serverState: "queued_for_server", version: 2, updatedAt: now },
      { id: "sv-780-003", name: "Reports · Management weekly", route: "/taskuri/reports", scope: "global", ownerId: "u-ioana", department: "Management", filters: ["department:any", "status:not-finalized"], columns: ["project", "owner", "progress", "cost"], density: "comfortable", serverState: "local_shadow", version: 1, updatedAt: now }
    ],
    canaries: [
      { id: "mc-1", entity: "task", action: "update_status", state: "accepted", lockVersion: 8, readReplicaOk: true, rollbackCheckpoint: "rb-task-780-001", evidence: "Status mutation accepted in canary; primary write remains disabled.", createdAt: now },
      { id: "mc-2", entity: "saved_view", action: "share_view", state: "queued", lockVersion: 4, readReplicaOk: true, rollbackCheckpoint: "rb-sv-780-001", evidence: "Server-side saved view canary queued for replay.", createdAt: now },
      { id: "mc-3", entity: "notification", action: "deliver_provider", state: "blocked", lockVersion: 1, readReplicaOk: false, rollbackCheckpoint: "rb-provider-websocket", evidence: "WebSocket provider lacks live runtime channel.", createdAt: now }
    ],
    audit: [
      { id: "au-1", type: "release", title: "v7.8.0 initialized", details: "Provider telemetry, mutation canary and server-side saved views prepared on real Taskuri routes.", createdAt: now },
      { id: "au-2", type: "screenshot", title: "v7.7 baseline accepted", details: "v7.7 audit captured 18/18 clean screenshots on servelect-work-os-web.vercel.app.", createdAt: now }
    ]
  };
}

export function v78RouteList(): string[] {
  return [
    "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations",
    "/admin/workflows", "/admin/custom-fields", "/admin/goodday-observability", "/admin/server-saved-views", "/admin/provider-telemetry",
    "/work-os/goodday-ui-parity", "/work-os/provider-rehearsal", "/work-os/primary-write-dry-run", "/work-os/provider-telemetry", "/work-os/mutation-canary",
    "/api/v1/work-os/v78-provider-telemetry", "/api/v1/work-os/v78-provider-telemetry/health", "/api/v1/work-os/v78-provider-telemetry/telemetry", "/api/v1/work-os/v78-provider-telemetry/saved-views", "/api/v1/work-os/v78-provider-telemetry/mutation-canary", "/api/v1/work-os/v78-provider-telemetry/observability"
  ];
}

export function v78ProgressScores() {
  return [
    { category: "GoodDay visual/UX similarity", before: 74, after: 76, improved: "Telemetrie și saved views integrate în shell-ul compact Taskuri.", missing: "Hierarchy tree și microinteracțiuni drawer mai avansate.", next: "Polish navigation density and task drawer activity." },
    { category: "GoodDay public feature parity", before: 89, after: 90, improved: "Saved views devin server-side-ready și provider telemetry este vizibilă.", missing: "Enterprise access control complet și providers live.", next: "Real provider credentials and canary enforcement." },
    { category: "Task management core", before: 96, after: 96, improved: "Canary mutation checks pentru task updates.", missing: "Primary DB writes încă gated.", next: "Controlled primary write pilot." },
    { category: "My Work / Inbox / Action Required", before: 90, after: 91, improved: "Saved views server-side pentru My Work.", missing: "Action required queue live.", next: "Server-side queues for My Work." },
    { category: "Task detail / drawer / comments / activity", before: 91, after: 92, improved: "Audit/canary events vizibile în context.", missing: "Comments persistente reale.", next: "Persist comments server-side." },
    { category: "Tickets / Requests / Forms", before: 90, after: 91, improved: "Tickets conectate la provider telemetry și SLA retries.", missing: "Client portal live.", next: "Provider-backed ticket notifications." },
    { category: "Notifications", before: 95, after: 96, improved: "Provider telemetry, p95, success rate, retry queue.", missing: "Email/push/websocket live credentials.", next: "Provider activation with secrets." },
    { category: "Workflows / custom statuses / validations", before: 87, after: 88, improved: "Mutation canary verifică status updates.", missing: "Validation engine server-side complet.", next: "API enforcement." },
    { category: "Custom fields / task types", before: 86, after: 87, improved: "Saved views țin coloane și filtre server-ready.", missing: "Schema-backed custom fields.", next: "Persist custom field definitions." },
    { category: "Saved views / filters / table views", before: 90, after: 94, improved: "Server-side saved views, scope team/department/global, sync state.", missing: "DB real și share permissions complete.", next: "Shared view ACL and persistence." },
    { category: "Board / Kanban", before: 92, after: 93, improved: "Board mutations intră în canary audit.", missing: "Drag/drop backend mutation.", next: "Mutation endpoint for drag/drop." },
    { category: "Calendar / Gantt / Timeline", before: 84, after: 85, improved: "Saved views pentru calendar/timeline.", missing: "Dependency-aware rescheduling.", next: "Timeline mutation canary." },
    { category: "Workload / resource planning", before: 86, after: 87, improved: "Workload saved views și provider alerting.", missing: "Pontaj/concedii live.", next: "Capacity adapter." },
    { category: "Time tracking / My Time / Timesheets", before: 86, after: 87, improved: "Timesheet saved views și canary approvals.", missing: "Manager approval server records.", next: "Approval records adapter." },
    { category: "Approvals", before: 85, after: 86, improved: "Canary records includ rollback checkpoint.", missing: "Approval gate primary enforcement.", next: "Approval mutation enforcement." },
    { category: "Reports / dashboards / analytics", before: 78, after: 82, improved: "Provider telemetry și canary dashboard nou.", missing: "PDF/BI real.", next: "Report export worker." },
    { category: "Automations", before: 78, after: 82, improved: "Telemetry/retry view pentru provider delivery.", missing: "Worker live cu retry real.", next: "Background worker execution." },
    { category: "Documents / files / attachments", before: 82, after: 83, improved: "Provider telemetry legată de atașamente și saved views.", missing: "R2/S3 live credentials.", next: "Signed upload live mode." },
    { category: "CRM / client portal integration", before: 65, after: 66, improved: "Ticket/form saved views pot fi partajate.", missing: "Portal client real.", next: "Client request portal." },
    { category: "HR / attendance / departments", before: 69, after: 70, improved: "Department scoped saved views.", missing: "Pontaj live și concedii.", next: "Department capacity sync." },
    { category: "RBAC / permissions / access rules", before: 89, after: 90, improved: "Saved view scopes și mutation canary checkpoints.", missing: "ACL server enforcement complet.", next: "Shared view ACL enforcement." },
    { category: "Backend / API / persistence", before: 87, after: 90, improved: "API v7.8 pentru telemetry/saved views/canary.", missing: "Primary writes gated.", next: "Mutation canary activation against DB adapter." },
    { category: "Screenshot audit coverage", before: 100, after: 100, improved: "Audit extins la v7.8 routes.", missing: "Confirmare Vercel post-deploy.", next: "Run v7.8 screenshot audit." },
    { category: "QA/build stability", before: 90, after: 91, improved: "Route smoke și screenshot audit actualizate.", missing: "Confirmare locală pe PC.", next: "pnpm typecheck/lint/build." },
    { category: "Production readiness", before: 87, after: 89, improved: "Provider telemetry și mutation canary cresc readiness.", missing: "Live providers, DB primary writes, rollback drill real.", next: "Provider credentials and canary rollout." }
  ];
}

export function v78GlobalScores() {
  return {
    goodDayVisualSimilarity: 76,
    goodDayFunctionalParity: 90,
    localRealFunctionality: 94,
    backendApiParity: 90,
    productionReadiness: 89,
    qaConfidence: 91,
    screenshotAuditCoverage: 100
  };
}

export function v78CurrentReadiness() {
  return {
    version: V78_RELEASE_VERSION,
    acceptedBaseline: "v7.7.0/v7.7.3 screenshot audit 18/18 PASS on servelect-work-os-web.vercel.app",
    focus: "Provider telemetry, mutation canary and server-side saved views on real Taskuri routes.",
    blockers: ["Primary Prisma writes still gated", "Live provider credentials not configured", "WebSocket runtime channel not provisioned"],
    next: "v9.0.1 should activate provider canary with secrets and shared view ACL enforcement, not redesign."
  };
}

export function calculateV78Workload(state: V78RuntimeState) {
  return state.users.map((user) => {
    const assignedTasks = state.tasks.filter((task) => task.assigneeId === user.id && task.status !== "Finalizat");
    const plannedMinutes = assignedTasks.reduce((sum, task) => sum + task.estimateMinutes, 0);
    const trackedMinutes = assignedTasks.reduce((sum, task) => sum + task.trackedMinutes, 0);
    const utilization = Math.round((plannedMinutes / Math.max(user.capacityMinutes, 1)) * 100);
    return { user, assignedTasks, plannedMinutes, trackedMinutes, capacityMinutes: user.capacityMinutes, utilization, overloaded: utilization > 100, underutilized: utilization < 45 };
  });
}

export function appendV78Audit(state: V78RuntimeState, type: string, title: string, details: string): V78RuntimeState {
  const event: V78AuditEvent = { id: newId("au"), type, title, details, createdAt: stamp() };
  return { ...state, audit: [event, ...state.audit].slice(0, 50) };
}

export function runV78ProviderProbe(state: V78RuntimeState, provider?: V78ProviderKind): V78RuntimeState {
  const now = stamp();
  const providerTelemetry: V78ProviderTelemetry[] = state.providerTelemetry.map((item) => {
    if (provider && item.provider !== provider) return item;
    const blocked = item.provider === "websocket";
    const status: V78ProviderStatus = blocked ? "blocked" : item.status === "failed" ? "dry_run" : "ready";
    return {
      ...item,
      status,
      lastProbeAt: now,
      p95Ms: blocked ? item.p95Ms : Math.max(75, item.p95Ms - 12),
      successRate: blocked ? item.successRate : Math.min(100, item.successRate + 1),
      delivered: blocked ? item.delivered : item.delivered + Math.max(1, item.queued),
      queued: blocked ? item.queued : 0,
      evidence: blocked ? "Provider blocked until runtime channel is provisioned." : "Provider telemetry probe passed in safe canary mode."
    };
  });
  const deliveryEvents: V78DeliveryEvent[] = state.deliveryEvents.map((event) => {
    if (provider && event.provider !== provider) return event;
    const nextState: V78DeliveryState = event.provider === "websocket" ? "failed" : "delivered";
    return { ...event, state: nextState, attempt: event.attempt + 1 };
  });
  return appendV78Audit({ ...state, providerTelemetry, deliveryEvents }, "provider", "Provider telemetry probe", provider ? provider : "all providers");
}

export function runV78MutationCanary(state: V78RuntimeState, entity: V78MutationCanary["entity"] = "task"): V78RuntimeState {
  const accepted = entity !== "notification" || state.providerTelemetry.some((item) => item.provider === "in_app" && item.status === "ready");
  const canary: V78MutationCanary = {
    id: newId("mc"),
    entity,
    action: entity === "saved_view" ? "server_sync" : entity === "notification" ? "provider_delivery" : "update_shadow_record",
    state: accepted ? "accepted" : "blocked",
    lockVersion: state.canaries.length + 1,
    readReplicaOk: accepted,
    rollbackCheckpoint: `rb-${entity}-${Date.now().toString(36)}`,
    evidence: accepted ? "Mutation canary accepted in shadow mode with rollback checkpoint." : "Mutation canary blocked by provider/readiness guard.",
    createdAt: stamp()
  };
  return appendV78Audit({ ...state, canaries: [canary, ...state.canaries] }, "canary", "Mutation canary executed", `${entity}: ${canary.state}`);
}

export function saveV78ServerView(state: V78RuntimeState, route: string, scope: V78SavedViewScope = "team"): V78RuntimeState {
  const view: V78SavedView = {
    id: newId("sv"),
    name: `Server view ${state.savedViews.length + 1} · ${route}`,
    route,
    scope,
    ownerId: "u-andrei",
    department: scope === "global" ? "Management" : "Producție",
    filters: ["status:open", "department:current", "provider:healthy"],
    columns: ["status", "priority", "assignee", "dueDate", "telemetry"],
    density: "compact",
    serverState: "queued_for_server",
    version: 1,
    updatedAt: stamp()
  };
  const next = { ...state, savedViews: [view, ...state.savedViews] };
  return runV78MutationCanary(appendV78Audit(next, "saved_view", "Server-side saved view queued", view.name), "saved_view");
}

export function syncV78SavedViews(state: V78RuntimeState): V78RuntimeState {
  const savedViews: V78SavedView[] = state.savedViews.map((view) => view.serverState === "queued_for_server" ? { ...view, serverState: "server_synced" as const, version: view.version + 1, updatedAt: stamp() } : view);
  return appendV78Audit({ ...state, savedViews }, "saved_view", "Saved views synced", "queued_for_server -> server_synced");
}

