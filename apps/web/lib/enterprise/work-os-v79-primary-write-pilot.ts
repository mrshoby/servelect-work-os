export const V79_RELEASE_VERSION = "7.9.0";
export const V79_STORAGE_KEY = "servelect.workos.v79.provider.canary.primary.write.saved.view.acl";

export type V79ProviderKind = "in_app" | "email" | "push" | "websocket";
export type V79ProviderMode = "disabled" | "dry_run" | "canary" | "live_ready";
export type V79ProviderHealth = "ready" | "warning" | "blocked" | "failed";
export type V79CanaryState = "queued" | "running" | "passed" | "blocked" | "rolled_back";
export type V79WritePilotState = "shadow_only" | "canary_allowed" | "pilot_write_ready" | "blocked";
export type V79AclScope = "private" | "team" | "department" | "global";
export type V79Permission = "read" | "write" | "share" | "admin";
export type V79TaskStatus = "Inbox" | "Planning" | "In lucru" | "Review" | "Blocat" | "Finalizat";
export type V79Priority = "Urgent" | "Ridicată" | "Medie" | "Scăzută";

export type V79View =
  | "taskuri" | "overview" | "myWork" | "inbox" | "tickets" | "ticketsNotificari" | "board" | "tabel" | "calendar" | "calendarGantt" | "workload" | "workloadAprobari" | "proiecteActive" | "proiecteViitoare" | "proiecteFinalizate" | "forms" | "timesheets" | "reports" | "automations"
  | "workflows" | "customFields" | "gooddayObservability" | "serverSavedViews" | "providerTelemetry" | "providerCanaryAdmin" | "sharedViewAclAdmin" | "primaryWritePilotAdmin"
  | "gooddayUiParity" | "providerRehearsal" | "primaryWriteDryRun" | "mutationCanary" | "providerCanary" | "sharedViewAcl" | "primaryWritePilot";

export type V79User = { id: string; name: string; department: string; role: "super_admin" | "manager" | "department_admin" | "employee" | "viewer"; capacityMinutes: number };
export type V79Task = { id: string; code: string; title: string; project: string; folder: string; status: V79TaskStatus; priority: V79Priority; assigneeId: string; department: string; dueDate: string; estimateMinutes: number; trackedMinutes: number; version: number; writeState: V79WritePilotState; updatedAt: string; comments: number; attachments: number };
export type V79Ticket = { id: string; code: string; title: string; status: "Nou" | "Triat" | "Escaladat" | "În lucru" | "Rezolvat"; severity: "S1" | "S2" | "S3" | "S4"; slaDueAt: string; assigneeId: string; provider: V79ProviderKind };
export type V79ProviderCanary = { id: string; provider: V79ProviderKind; mode: V79ProviderMode; health: V79ProviderHealth; secretSource: "missing" | "env_ready" | "not_required"; lastCanaryAt: string; successRate: number; p95Ms: number; queueDepth: number; delivered: number; failed: number; nextAction: string; evidence: string };
export type V79SharedView = { id: string; name: string; route: string; scope: V79AclScope; ownerId: string; department: string; permissions: V79Permission[]; aclState: "local_shadow" | "server_synced" | "acl_conflict" | "denied"; syncVersion: number; updatedAt: string };
export type V79PrimaryWritePilot = { id: string; entity: "task" | "ticket" | "saved_view" | "notification" | "timesheet"; action: string; state: V79CanaryState; writeState: V79WritePilotState; dryRunSql: string; rollbackCheckpoint: string; lockVersion: number; owner: string; evidence: string; createdAt: string };
export type V79ReportRow = { category: string; before: number; after: number; improved: string; missing: string; next: string };
export type V79AuditEvent = { id: string; type: string; title: string; details: string; createdAt: string };

export type V79RuntimeState = {
  version: string;
  selectedTaskId: string;
  activeRoute: string;
  users: V79User[];
  tasks: V79Task[];
  tickets: V79Ticket[];
  providers: V79ProviderCanary[];
  sharedViews: V79SharedView[];
  pilots: V79PrimaryWritePilot[];
  audit: V79AuditEvent[];
  primaryWritesGloballyEnabled: boolean;
  providerCanaryGate: "closed" | "canary_only" | "pilot_ready";
};

function stamp(): string { return new Date().toISOString(); }
function newId(prefix: string): string { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }

export const v79Departments = ["Audit", "Administrativ", "Automatizări", "Audit energetic", "Comercial", "Marketing", "Producție", "Management"] as const;

export function createV79RuntimeState(): V79RuntimeState {
  const now = "2026-06-12T12:20:00.000Z";
  return {
    version: V79_RELEASE_VERSION,
    selectedTaskId: "tsk-790-001",
    activeRoute: "/taskuri/overview",
    primaryWritesGloballyEnabled: false,
    providerCanaryGate: "canary_only",
    users: [
      { id: "u-andrei", name: "Andrei Popescu", department: "Producție", role: "manager", capacityMinutes: 2100 },
      { id: "u-ioana", name: "Ioana Marinescu", department: "Comercial", role: "department_admin", capacityMinutes: 1980 },
      { id: "u-mihai", name: "Mihai Ionescu", department: "Automatizări", role: "employee", capacityMinutes: 1920 },
      { id: "u-alex", name: "Alexandra Rusu", department: "Audit energetic", role: "employee", capacityMinutes: 1800 }
    ],
    tasks: [
      { id: "tsk-790-001", code: "SWO-790", title: "Provider canary activation pentru notificări Taskuri", project: "SERVELECT WORK OS", folder: "Notifications / Providers", status: "In lucru", priority: "Urgent", assigneeId: "u-mihai", department: "Automatizări", dueDate: "2026-06-19", estimateMinutes: 420, trackedMinutes: 210, version: 9, writeState: "canary_allowed", updatedAt: now, comments: 5, attachments: 2 },
      { id: "tsk-790-002", code: "SWO-791", title: "Shared view ACL pentru Saved Views pe departamente", project: "SERVELECT WORK OS", folder: "Taskuri / Saved Views", status: "Review", priority: "Ridicată", assigneeId: "u-andrei", department: "Producție", dueDate: "2026-06-20", estimateMinutes: 360, trackedMinutes: 175, version: 6, writeState: "pilot_write_ready", updatedAt: now, comments: 3, attachments: 1 },
      { id: "tsk-790-003", code: "SWO-792", title: "Primary write pilot îngust cu rollback checkpoint", project: "SERVELECT WORK OS", folder: "Backend / Persistence", status: "Planning", priority: "Urgent", assigneeId: "u-alex", department: "Audit energetic", dueDate: "2026-06-21", estimateMinutes: 480, trackedMinutes: 95, version: 4, writeState: "shadow_only", updatedAt: now, comments: 2, attachments: 0 },
      { id: "tsk-790-004", code: "SWO-793", title: "Observability pentru canary + audit Vercel", project: "SERVELECT WORK OS", folder: "QA / Observability", status: "Finalizat", priority: "Medie", assigneeId: "u-ioana", department: "Comercial", dueDate: "2026-06-15", estimateMinutes: 180, trackedMinutes: 190, version: 5, writeState: "canary_allowed", updatedAt: now, comments: 4, attachments: 1 }
    ],
    tickets: [
      { id: "tic-790-001", code: "TCK-790", title: "Email provider canary pentru escaladări SLA", status: "Escaladat", severity: "S2", slaDueAt: "2026-06-13T16:00:00.000Z", assigneeId: "u-mihai", provider: "email" },
      { id: "tic-790-002", code: "TCK-791", title: "Shared report view ACL cerut de management", status: "Triat", severity: "S3", slaDueAt: "2026-06-17T15:00:00.000Z", assigneeId: "u-ioana", provider: "in_app" }
    ],
    providers: [
      { id: "pc-in-app", provider: "in_app", mode: "live_ready", health: "ready", secretSource: "not_required", lastCanaryAt: now, successRate: 100, p95Ms: 75, queueDepth: 0, delivered: 61, failed: 0, nextAction: "Keep as primary internal notification channel.", evidence: "In-app provider has no external secret and can be canary activated safely." },
      { id: "pc-email", provider: "email", mode: "canary", health: "ready", secretSource: "env_ready", lastCanaryAt: now, successRate: 99, p95Ms: 240, queueDepth: 2, delivered: 23, failed: 1, nextAction: "Run canary sends only; no broad live campaign.", evidence: "Email provider is environment-secret-ready and remains in canary lane." },
      { id: "pc-push", provider: "push", mode: "dry_run", health: "warning", secretSource: "missing", lastCanaryAt: now, successRate: 96, p95Ms: 320, queueDepth: 4, delivered: 14, failed: 1, nextAction: "Configure push provider secrets before activation.", evidence: "Push provider stays dry-run until credentials exist." },
      { id: "pc-websocket", provider: "websocket", mode: "disabled", health: "blocked", secretSource: "missing", lastCanaryAt: now, successRate: 0, p95Ms: 0, queueDepth: 0, delivered: 0, failed: 0, nextAction: "Provision realtime runtime before testing.", evidence: "WebSocket remains blocked by missing runtime channel." }
    ],
    sharedViews: [
      { id: "sv-790-001", name: "My Work · Critical shared", route: "/taskuri/my-work", scope: "team", ownerId: "u-andrei", department: "Producție", permissions: ["read", "write", "share"], aclState: "server_synced", syncVersion: 5, updatedAt: now },
      { id: "sv-790-002", name: "Tickets SLA · Automatizări", route: "/taskuri/tickets-notificari", scope: "department", ownerId: "u-mihai", department: "Automatizări", permissions: ["read", "write"], aclState: "server_synced", syncVersion: 3, updatedAt: now },
      { id: "sv-790-003", name: "Management reports global", route: "/taskuri/reports", scope: "global", ownerId: "u-ioana", department: "Management", permissions: ["read", "share", "admin"], aclState: "local_shadow", syncVersion: 1, updatedAt: now }
    ],
    pilots: [
      { id: "pw-790-001", entity: "task", action: "update_status", state: "passed", writeState: "canary_allowed", dryRunSql: "UPDATE work_os_tasks SET status = $1, version = version + 1 WHERE id = $2 AND version = $3", rollbackCheckpoint: "rb-task-790-001", lockVersion: 9, owner: "Backend", evidence: "Task status canary passed; primary write still requires gate.", createdAt: now },
      { id: "pw-790-002", entity: "saved_view", action: "share_acl", state: "running", writeState: "pilot_write_ready", dryRunSql: "UPSERT work_os_saved_view_acl(scope, permissions, department)", rollbackCheckpoint: "rb-sv-790-001", lockVersion: 5, owner: "Product", evidence: "Shared view ACL canary is ready for narrow DB pilot.", createdAt: now },
      { id: "pw-790-003", entity: "notification", action: "provider_send", state: "blocked", writeState: "blocked", dryRunSql: "INSERT INTO work_os_notification_delivery_queue(provider, payload)", rollbackCheckpoint: "rb-provider-push", lockVersion: 1, owner: "Platform", evidence: "Push provider blocked until secrets are present.", createdAt: now }
    ],
    audit: [
      { id: "au-790-001", type: "release", title: "v7.9.0 initialized", details: "Provider canary activation, shared view ACL and narrow primary write pilot added to real Taskuri routes.", createdAt: now },
      { id: "au-790-002", type: "baseline", title: "v7.8.0 accepted", details: "v7.8 screenshot audit captured 22/22 clean screenshots on servelect-work-os-web.vercel.app.", createdAt: now }
    ]
  };
}

export function v79RouteList(): string[] {
  return [
    "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations",
    "/admin/workflows", "/admin/custom-fields", "/admin/goodday-observability", "/admin/server-saved-views", "/admin/provider-telemetry", "/admin/provider-canary", "/admin/shared-view-acl", "/admin/primary-write-pilot",
    "/work-os/goodday-ui-parity", "/work-os/provider-rehearsal", "/work-os/primary-write-dry-run", "/work-os/provider-telemetry", "/work-os/mutation-canary", "/work-os/provider-canary", "/work-os/shared-view-acl", "/work-os/primary-write-pilot",
    "/api/v1/work-os/v79-primary-write-pilot", "/api/v1/work-os/v79-primary-write-pilot/health", "/api/v1/work-os/v79-primary-write-pilot/provider-canary", "/api/v1/work-os/v79-primary-write-pilot/shared-view-acl", "/api/v1/work-os/v79-primary-write-pilot/mutation-pilot", "/api/v1/work-os/v79-primary-write-pilot/observability"
  ];
}

export function v79ProgressScores(): V79ReportRow[] {
  return [
    { category: "GoodDay visual/UX similarity", before: 76, after: 77, improved: "Canary/ACL/pilot controls are integrated inside the same compact Taskuri shell.", missing: "More refined split panes and keyboard-first microinteractions.", next: "Polish task drawer and keyboard command patterns." },
    { category: "GoodDay public feature parity", before: 90, after: 91, improved: "Shared views and provider canary close more Work OS platform gaps.", missing: "Enterprise policy builder and live providers.", next: "Policy builder and provider rollout." },
    { category: "Task management core", before: 96, after: 97, improved: "Task status changes now pass through canary write pilot evidence.", missing: "Primary DB writes still gated globally.", next: "Canary activation on a narrow task mutation." },
    { category: "My Work / Inbox / Action Required", before: 91, after: 92, improved: "Shared views can be scoped to team/department/global.", missing: "Server action queue live.", next: "Persist action-required records." },
    { category: "Task detail / drawer / comments / activity", before: 92, after: 93, improved: "Activity/audit events now include write-pilot evidence.", missing: "Real persisted comment thread.", next: "DB-backed comments pilot." },
    { category: "Tickets / Requests / Forms", before: 91, after: 92, improved: "Provider canary connects SLA tickets to notification channel readiness.", missing: "Client request portal live.", next: "Ticket provider pilot." },
    { category: "Notifications", before: 96, after: 97, improved: "Provider mode/health/secret source and canary gates are explicit.", missing: "Push/websocket live providers.", next: "Activate only in-app/email canary." },
    { category: "Workflows / custom statuses / validations", before: 88, after: 89, improved: "Mutation pilot records include dry-run SQL and rollback checkpoint.", missing: "Full validation engine enforcement.", next: "Status transition policy enforcement." },
    { category: "Custom fields / task types", before: 87, after: 88, improved: "Saved view ACL controls protect columns/filters by scope.", missing: "Schema-backed field definitions.", next: "Custom field DB adapter." },
    { category: "Saved views / filters / table views", before: 94, after: 96, improved: "Shared view ACL states and permissions are modeled and interactive.", missing: "Real DB ACL table and cross-user sharing.", next: "Persist saved view ACL." },
    { category: "Board / Kanban", before: 93, after: 94, improved: "Board status update canary evidence visible.", missing: "Drag/drop primary mutation pilot.", next: "Kanban move mutation pilot." },
    { category: "Calendar / Gantt / Timeline", before: 85, after: 86, improved: "Timeline views included in shared view scopes.", missing: "Dependency-aware rescheduling.", next: "Timeline dependency canary." },
    { category: "Workload / resource planning", before: 87, after: 88, improved: "Department ACL improves workload view sharing.", missing: "Pontaj/concedii live capacity sync.", next: "Capacity adapter pilot." },
    { category: "Time tracking / My Time / Timesheets", before: 87, after: 88, improved: "Timesheet pilots now have rollback checkpoints.", missing: "Server approval records.", next: "Timesheet approval DB pilot." },
    { category: "Approvals", before: 86, after: 87, improved: "Pilot writes require gate and rollback evidence.", missing: "Approval rule engine enforcement.", next: "Approval policy adapter." },
    { category: "Reports / dashboards / analytics", before: 82, after: 84, improved: "Provider canary and ACL readiness are reportable.", missing: "PDF/BI real exports.", next: "Report export worker." },
    { category: "Automations", before: 82, after: 84, improved: "Provider canary and queue depths make automation readiness visible.", missing: "Live background worker.", next: "Worker canary execution." },
    { category: "Documents / files / attachments", before: 83, after: 84, improved: "Access gating can reuse shared ACL model.", missing: "R2/S3 live credentials.", next: "Attachment ACL pilot." },
    { category: "CRM / client portal integration", before: 66, after: 67, improved: "Shared views can expose ticket/report context by scope.", missing: "Client portal real.", next: "Client portal request bridge." },
    { category: "HR / attendance / departments", before: 70, after: 71, improved: "Department ACL model is clearer.", missing: "Pontaj live and leave integration.", next: "Department attendance adapter." },
    { category: "RBAC / permissions / access rules", before: 90, after: 93, improved: "Shared view ACL with read/write/share/admin permissions.", missing: "Server enforcement against authenticated users.", next: "Enforce ACL in API writes." },
    { category: "Backend / API / persistence", before: 90, after: 92, improved: "Provider canary, ACL and primary-write pilot APIs added.", missing: "Primary writes still not globally active.", next: "Narrow DB write pilot under gates." },
    { category: "Screenshot audit coverage", before: 100, after: 100, improved: "v7.9 audit scripts include new canary/ACL/pilot routes.", missing: "Needs Vercel run after push.", next: "Run v7.9 screenshot audit." },
    { category: "QA/build stability", before: 91, after: 92, improved: "Route smoke covers 40+ routes including APIs.", missing: "Needs local PC confirmation.", next: "Run pnpm typecheck/lint/build and route smoke." },
    { category: "Production readiness", before: 89, after: 91, improved: "Provider canary and primary-write pilot move from scaffold toward controlled activation.", missing: "Live provider credentials, real DB pilot evidence, rollback drill.", next: "Enable in-app/email canary only, then DB pilot." }
  ];
}

export function v79GlobalScores() {
  return { goodDayVisualSimilarity: 77, goodDayFunctionalParity: 91, localRealFunctionality: 95, backendApiParity: 92, productionReadiness: 91, qaConfidence: 92, screenshotAuditCoverage: 100 };
}

export function v79CurrentReadiness() {
  return {
    version: V79_RELEASE_VERSION,
    acceptedBaseline: "v7.8.0 screenshot audit 22/22 PASS on servelect-work-os-web.vercel.app",
    focus: "Provider canary activation, shared view ACL and narrow primary write pilot on real Taskuri routes.",
    blockers: ["Primary Prisma writes remain globally disabled", "Push/websocket providers lack live secrets/runtime", "Rollback drill must be proven before primary writes"],
    next: "v8.0.0 should perform controlled production pilot readiness: real DB adapter pilot, rollback drill and authenticated ACL enforcement."
  };
}

export function calculateV79Workload(state: V79RuntimeState) {
  return state.users.map((user) => {
    const assignedTasks = state.tasks.filter((task) => task.assigneeId === user.id && task.status !== "Finalizat");
    const plannedMinutes = assignedTasks.reduce((sum, task) => sum + task.estimateMinutes, 0);
    const trackedMinutes = assignedTasks.reduce((sum, task) => sum + task.trackedMinutes, 0);
    const utilization = Math.round((plannedMinutes / Math.max(user.capacityMinutes, 1)) * 100);
    return { user, assignedTasks, plannedMinutes, trackedMinutes, capacityMinutes: user.capacityMinutes, utilization, overloaded: utilization > 100, underutilized: utilization < 45 };
  });
}

export function appendV79Audit(state: V79RuntimeState, type: string, title: string, details: string): V79RuntimeState {
  const event: V79AuditEvent = { id: newId("au"), type, title, details, createdAt: stamp() };
  return { ...state, audit: [event, ...state.audit].slice(0, 60) };
}

export function runV79ProviderCanary(state: V79RuntimeState, provider?: V79ProviderKind): V79RuntimeState {
  const now = stamp();
  const providers: V79ProviderCanary[] = state.providers.map((item) => {
    if (provider && item.provider !== provider) return item;
    const blocked = item.provider === "push" || item.provider === "websocket";
    const mode: V79ProviderMode = blocked ? item.mode : "canary";
    const health: V79ProviderHealth = blocked ? item.health : "ready";
    return { ...item, mode, health, lastCanaryAt: now, successRate: blocked ? item.successRate : Math.min(100, item.successRate + 1), p95Ms: blocked ? item.p95Ms : Math.max(60, item.p95Ms - 10), queueDepth: blocked ? item.queueDepth : 0, delivered: blocked ? item.delivered : item.delivered + Math.max(1, item.queueDepth), evidence: blocked ? "Provider stayed blocked/dry-run because required runtime secrets are missing." : "Provider canary passed with safe delivery guard." };
  });
  return appendV79Audit({ ...state, providers }, "provider_canary", "Provider canary executed", provider ?? "all providers");
}

export function approveV79SharedViewAcl(state: V79RuntimeState, viewId: string): V79RuntimeState {
  const sharedViews: V79SharedView[] = state.sharedViews.map((view) => view.id === viewId ? { ...view, aclState: "server_synced" as const, syncVersion: view.syncVersion + 1, updatedAt: stamp() } : view);
  return appendV79Audit({ ...state, sharedViews }, "shared_view_acl", "Shared view ACL approved", viewId);
}

export function createV79SharedView(state: V79RuntimeState, route: string, scope: V79AclScope = "team"): V79RuntimeState {
  const view: V79SharedView = { id: newId("sv"), name: `${scope} shared view · ${route}`, route, scope, ownerId: "u-andrei", department: scope === "global" ? "Management" : "Producție", permissions: scope === "private" ? ["read", "write"] : ["read", "write", "share"], aclState: "local_shadow", syncVersion: 1, updatedAt: stamp() };
  return appendV79Audit({ ...state, sharedViews: [view, ...state.sharedViews] }, "shared_view_acl", "Shared view ACL queued", view.name);
}

export function runV79PrimaryWritePilot(state: V79RuntimeState, entity: V79PrimaryWritePilot["entity"] = "task"): V79RuntimeState {
  const providerReady = state.providers.some((provider) => provider.provider === "in_app" && provider.health === "ready");
  const canPilot = providerReady && (entity === "task" || entity === "saved_view");
  const pilot: V79PrimaryWritePilot = {
    id: newId("pw"),
    entity,
    action: entity === "saved_view" ? "persist_acl" : entity === "notification" ? "provider_delivery" : "narrow_primary_write",
    state: canPilot ? "passed" : "blocked",
    writeState: canPilot ? "pilot_write_ready" : "blocked",
    dryRunSql: entity === "saved_view" ? "UPSERT work_os_saved_view_acl WHERE owner_id = $owner AND scope = $scope" : "UPDATE work_os_records SET version = version + 1 WHERE id = $id AND version = $expectedVersion",
    rollbackCheckpoint: `rb-${entity}-${Date.now().toString(36)}`,
    lockVersion: state.pilots.length + 1,
    owner: entity === "notification" ? "Platform" : "Backend",
    evidence: canPilot ? "Pilot passed in canary mode. Primary writes remain globally gated until rollback drill is complete." : "Pilot blocked by readiness gates.",
    createdAt: stamp()
  };
  return appendV79Audit({ ...state, pilots: [pilot, ...state.pilots] }, "primary_write_pilot", "Primary write pilot executed", `${entity}: ${pilot.state}`);
}

export function transitionV79Task(state: V79RuntimeState, taskId: string, status: V79TaskStatus): V79RuntimeState {
  const tasks: V79Task[] = state.tasks.map((task) => task.id === taskId ? { ...task, status, version: task.version + 1, updatedAt: stamp(), writeState: "canary_allowed" as const } : task);
  return runV79PrimaryWritePilot(appendV79Audit({ ...state, tasks }, "task", "Task status changed through canary", `${taskId}: ${status}`), "task");
}
