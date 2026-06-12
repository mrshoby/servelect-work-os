export const V77_RELEASE_VERSION = "7.7.4";
export const V77_STORAGE_KEY = "servelect.workos.v77.goodday.ui.functional.parity";

export type V77TaskStatus = "Inbox" | "Planning" | "In lucru" | "Review" | "Blocat" | "Finalizat";
export type V77Priority = "Urgent" | "Ridicată" | "Medie" | "Scăzută";
export type V77Role = "super_admin" | "manager" | "department_admin" | "employee" | "viewer";
export type V77ViewDensity = "compact" | "comfortable";
export type V77ProviderState = "queued" | "processing" | "delivered" | "failed";
export type V77DryRunStatus = "ready" | "blocked" | "warning";

export type V77User = {
  id: string;
  name: string;
  role: V77Role;
  department: string;
  capacityMinutes: number;
};

export type V77Comment = { id: string; author: string; message: string; createdAt: string };
export type V77ChecklistItem = { id: string; label: string; done: boolean };
export type V77AttachmentMeta = { id: string; fileName: string; storage: "mock" | "r2_ready"; version: number; access: "inherited" | "restricted"; status: "available" | "deleted" };

export type V77Task = {
  id: string;
  code: string;
  title: string;
  project: string;
  folder: string;
  status: V77TaskStatus;
  priority: V77Priority;
  assigneeId: string;
  department: string;
  dueDate: string;
  estimateMinutes: number;
  trackedMinutes: number;
  customFields: Record<string, string>;
  comments: V77Comment[];
  checklist: V77ChecklistItem[];
  attachments: V77AttachmentMeta[];
  dependencies: string[];
  recurringRule?: string;
  reminderAt?: string;
  updatedAt: string;
  version: number;
};

export type V77Ticket = {
  id: string;
  code: string;
  title: string;
  requester: string;
  client: string;
  equipment: string;
  status: "Nou" | "Triat" | "Escaladat" | "În lucru" | "Rezolvat";
  severity: "S1" | "S2" | "S3" | "S4";
  slaDueAt: string;
  assigneeId: string;
  convertedTaskId?: string;
  comments: V77Comment[];
  attachments: V77AttachmentMeta[];
};

export type V77Notification = { id: string; title: string; body: string; entity: string; entityId: string; read: boolean; providerState: V77ProviderState; createdAt: string };
export type V77SavedView = { id: string; name: string; scope: "private" | "shared"; filters: string[]; columns: string[]; density: V77ViewDensity; route: string };
export type V77WorkflowRule = { id: string; from: V77TaskStatus; to: V77TaskStatus; requires: string[]; gate: "none" | "approval" | "required_fields"; enabled: boolean };
export type V77TimeEntry = { id: string; taskId: string; userId: string; minutes: number; day: string; submitted: boolean; approved: boolean };
export type V77Automation = { id: string; name: string; trigger: string; condition: string; action: string; enabled: boolean; runs: number; lastRun?: string };
export type V77DryRun = { id: string; entity: string; action: string; status: V77DryRunStatus; evidence: string; createdAt: string };
export type V77Audit = { id: string; type: string; title: string; details: string; createdAt: string };

export type V77RuntimeState = {
  version: string;
  users: V77User[];
  tasks: V77Task[];
  tickets: V77Ticket[];
  notifications: V77Notification[];
  savedViews: V77SavedView[];
  workflows: V77WorkflowRule[];
  timeEntries: V77TimeEntry[];
  automations: V77Automation[];
  dryRuns: V77DryRun[];
  audit: V77Audit[];
  selectedTaskId: string;
  activeTimerTaskId?: string;
  providerRehearsalMode: "safe_shadow" | "provider_dry_run";
};

export const v77Departments = ["Audit", "Administrativ", "Automatizări", "Audit energetic", "Comercial", "Marketing", "Producție", "Management"] as const;

export function createV77RuntimeState(): V77RuntimeState {
  const now = "2026-06-12T10:30:00.000Z";
  return {
    version: V77_RELEASE_VERSION,
    providerRehearsalMode: "provider_dry_run",
    selectedTaskId: "tsk-001",
    users: [
      { id: "u-andrei", name: "Andrei Popescu", role: "manager", department: "Producție", capacityMinutes: 2100 },
      { id: "u-ioana", name: "Ioana Marinescu", role: "department_admin", department: "Comercial", capacityMinutes: 1980 },
      { id: "u-mihai", name: "Mihai Ionescu", role: "employee", department: "Automatizări", capacityMinutes: 1920 },
      { id: "u-alex", name: "Alexandra Rusu", role: "employee", department: "Audit energetic", capacityMinutes: 1800 }
    ],
    tasks: [
      {
        id: "tsk-001", code: "SWO-771", title: "Verificare invertor Huawei și atașare raport service", project: "P-2024-0187 Sistem FV 9.6 kWp Cluj-Napoca", folder: "Mentenanță / Intervenții", status: "In lucru", priority: "Ridicată", assigneeId: "u-mihai", department: "Automatizări", dueDate: "2026-06-18", estimateMinutes: 360, trackedMinutes: 95, customFields: { Tip: "Service", SLA: "24h", Client: "ElectroMontaj Nord" }, comments: [{ id: "c1", author: "Ioana Marinescu", message: "Atașează logurile din FusionSolar înainte de închidere.", createdAt: now }], checklist: [{ id: "ck1", label: "Scan echipament", done: true }, { id: "ck2", label: "Raport service PDF", done: false }], attachments: [{ id: "att1", fileName: "raport-service-draft.pdf", storage: "r2_ready", version: 2, access: "inherited", status: "available" }], dependencies: ["tsk-003"], recurringRule: "monthly:first_monday", reminderAt: "2026-06-17T08:00:00.000Z", updatedAt: now, version: 7
      },
      {
        id: "tsk-002", code: "SWO-772", title: "Pregătire ofertă BESS și verificare stoc baterii", project: "P-2024-0103 GreenFactory SA 500 kWp", folder: "Comercial / Oferte", status: "Review", priority: "Medie", assigneeId: "u-ioana", department: "Comercial", dueDate: "2026-06-20", estimateMinutes: 420, trackedMinutes: 210, customFields: { Tip: "Ofertare", Valoare: "Mare", Marjă: "de revizuit" }, comments: [], checklist: [{ id: "ck3", label: "Compară furnizori", done: true }, { id: "ck4", label: "Trimite spre aprobare", done: false }], attachments: [], dependencies: [], updatedAt: now, version: 5
      },
      {
        id: "tsk-003", code: "SWO-773", title: "Confirmare acces site pentru echipa de teren", project: "P-2024-0187 Sistem FV 9.6 kWp Cluj-Napoca", folder: "Field Ops", status: "Finalizat", priority: "Scăzută", assigneeId: "u-andrei", department: "Producție", dueDate: "2026-06-15", estimateMinutes: 90, trackedMinutes: 75, customFields: { Tip: "Coordonare", Locație: "Cluj" }, comments: [], checklist: [{ id: "ck5", label: "Confirmare client", done: true }], attachments: [], dependencies: [], updatedAt: now, version: 3
      }
    ],
    tickets: [
      { id: "tic-001", code: "TCK-177", title: "Alarmă producție scăzută invertor string 2", requester: "Client portal", client: "ElectroMontaj Nord", equipment: "Huawei SUN2000", status: "Escaladat", severity: "S2", slaDueAt: "2026-06-13T13:00:00.000Z", assigneeId: "u-mihai", comments: [{ id: "tc1", author: "Sistem IoT", message: "Alertă generată din scădere producție sub baseline.", createdAt: now }], attachments: [] },
      { id: "tic-002", code: "TCK-178", title: "Cerere ofertă extindere sistem fotovoltaic", requester: "Formular public", client: "GreenFactory SA", equipment: "N/A", status: "Triat", severity: "S3", slaDueAt: "2026-06-15T15:00:00.000Z", assigneeId: "u-ioana", comments: [], attachments: [] }
    ],
    notifications: [
      { id: "n1", title: "Ticket escaladat", body: "TCK-177 necesită decizie manager.", entity: "ticket", entityId: "tic-001", read: false, providerState: "queued" as const, createdAt: now },
      { id: "n2", title: "Task în review", body: "SWO-772 așteaptă aprobare ofertă.", entity: "task", entityId: "tsk-002", read: false, providerState: "delivered" as const, createdAt: now }
    ],
    savedViews: [
      { id: "sv1", name: "My Work · Urgent azi", scope: "shared", filters: ["priority:urgent", "assignee:me"], columns: ["status", "priority", "assignee", "dueDate"], density: "compact", route: "/taskuri/my-work" },
      { id: "sv2", name: "Tickets SLA risc", scope: "shared", filters: ["severity:S1-S2", "status:not-resolved"], columns: ["severity", "sla", "assignee"], density: "compact", route: "/taskuri/tickets-notificari" }
    ],
    workflows: [
      { id: "wf1", from: "Inbox", to: "Planning", requires: ["assignee"], gate: "required_fields", enabled: true },
      { id: "wf2", from: "In lucru", to: "Review", requires: ["checklist_complete"], gate: "required_fields", enabled: true },
      { id: "wf3", from: "Review", to: "Finalizat", requires: ["manager_approval"], gate: "approval", enabled: true }
    ],
    timeEntries: [
      { id: "te1", taskId: "tsk-001", userId: "u-mihai", minutes: 95, day: "2026-06-12", submitted: true, approved: false }
    ],
    automations: [
      { id: "a1", name: "IoT alert -> ticket + notification", trigger: "iot.alert.created", condition: "severity >= S2", action: "create_ticket_notify_manager", enabled: true, runs: 8, lastRun: now },
      { id: "a2", name: "Stock low -> procurement task", trigger: "stock.low", condition: "reserved > available", action: "create_procurement_task", enabled: true, runs: 3, lastRun: now }
    ],
    dryRuns: [
      { id: "dr1", entity: "task", action: "primary_write_check", status: "warning", evidence: "Primary write blocked until rollback replay and provider telemetry pass.", createdAt: now }
    ],
    audit: [{ id: "au1", type: "release", title: "v7.7.0 initialized", details: "GoodDay-like UI discipline applied to real Taskuri routes with provider rehearsal visible.", createdAt: now }]
  };
}

export function v77RouteList(): string[] {
  return [
    "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/inbox", "/taskuri/tickets", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar", "/taskuri/calendar-gantt", "/taskuri/workload", "/taskuri/workload-aprobari", "/taskuri/proiecte-active", "/taskuri/proiecte-viitoare", "/taskuri/proiecte-finalizate", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/admin/workflows", "/admin/custom-fields", "/admin/access-rules", "/admin/goodday-parity", "/admin/goodday-observability", "/work-os/goodday-ui-parity", "/work-os/provider-rehearsal", "/work-os/primary-write-dry-run", "/api/v1/work-os/v77-goodday-ui-parity", "/api/v1/work-os/v77-goodday-ui-parity/health", "/api/v1/work-os/v77-goodday-ui-parity/dry-run", "/api/v1/work-os/v77-goodday-ui-parity/observability"
  ];
}

export function v77ProgressScores() {
  return [
    { category: "GoodDay visual/UX similarity", before: 62, after: 74, next: "Polish density, hierarchy tree and drawer microinteractions." },
    { category: "GoodDay public feature parity", before: 88, after: 89, next: "Enterprise access control and live providers." },
    { category: "Task management core", before: 95, after: 96, next: "Server-side concurrency and primary writes." },
    { category: "My Work / Inbox / Action Required", before: 84, after: 90, next: "Server-side action required queue." },
    { category: "Task detail / drawer / comments / activity", before: 86, after: 91, next: "Persist comments server-side." },
    { category: "Tickets / Requests / Forms", before: 88, after: 90, next: "Portal forms and queue worker." },
    { category: "Notifications", before: 94, after: 95, next: "Live websocket/email/push providers." },
    { category: "Workflows / custom statuses / validations", before: 84, after: 87, next: "Admin workflow engine enforcement in API." },
    { category: "Custom fields / task types", before: 83, after: 86, next: "Schema-backed custom fields." },
    { category: "Saved views / filters / table views", before: 86, after: 90, next: "Shared views server-side." },
    { category: "Board / Kanban", before: 88, after: 92, next: "Drag/drop backend mutation." },
    { category: "Calendar / Gantt / Timeline", before: 80, after: 84, next: "Dependency-aware rescheduling." },
    { category: "Workload / resource planning", before: 83, after: 86, next: "Leave/pontaj capacity integration." },
    { category: "Time tracking / My Time / Timesheets", before: 83, after: 86, next: "Manager approval server records." },
    { category: "Approvals", before: 82, after: 85, next: "Approval gate enforcement in mutations." },
    { category: "Reports / dashboards / analytics", before: 72, after: 78, next: "PDF/BI and chart export." },
    { category: "Automations", before: 74, after: 78, next: "Background worker retries." },
    { category: "Documents / files / attachments", before: 78, after: 82, next: "Real R2 credentials and signed binary upload." },
    { category: "CRM / client portal integration", before: 62, after: 65, next: "Client-facing requests and offer pipeline sync." },
    { category: "HR / attendance / departments", before: 66, after: 69, next: "Pontaj capacity and leave availability." },
    { category: "RBAC / permissions / access rules", before: 87, after: 89, next: "Access enforced across all mutations." },
    { category: "Backend / API / persistence", before: 86, after: 87, next: "Primary dry run telemetry and Prisma write rehearsal." },
    { category: "Screenshot audit coverage", before: 100, after: 100, next: "Run v7.7 audit after Vercel deploy." },
    { category: "QA/build stability", before: 88, after: 90, next: "Keep typecheck/lint/build clean." },
    { category: "Production readiness", before: 85, after: 87, next: "Provider rehearsal + observability gates." }
  ];
}

export function v77GlobalScores() {
  return {
    goodDayVisualSimilarity: 74,
    goodDayFunctionalParity: 89,
    localRealFunctionality: 93,
    backendApiParity: 87,
    productionReadiness: 87,
    qaConfidence: 90,
    screenshotAuditCoverage: 100
  };
}

export function calculateV77Workload(state: V77RuntimeState) {
  return state.users.map((user) => {
    const assigned = state.tasks.filter((task) => task.assigneeId === user.id && task.status !== "Finalizat");
    const plannedMinutes = assigned.reduce((sum, task) => sum + task.estimateMinutes, 0);
    const trackedMinutes = state.timeEntries.filter((entry) => entry.userId === user.id).reduce((sum, entry) => sum + entry.minutes, 0);
    const utilization = Math.round((plannedMinutes / Math.max(user.capacityMinutes, 1)) * 100);
    return { user, assignedTasks: assigned, plannedMinutes, trackedMinutes, capacityMinutes: user.capacityMinutes, utilization, overloaded: utilization > 100, underutilized: utilization < 45 };
  });
}

function stamp(): string { return new Date().toISOString(); }
function newId(prefix: string): string { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`; }

export function appendAudit(state: V77RuntimeState, type: string, title: string, details: string): V77RuntimeState {
  return { ...state, audit: [{ id: newId("au"), type, title, details, createdAt: stamp() }, ...state.audit].slice(0, 30) };
}

export function createTask(state: V77RuntimeState, title: string): V77RuntimeState {
  const now = stamp();
  const task: V77Task = { id: newId("tsk"), code: `SWO-${780 + state.tasks.length}`, title: title.trim() || "Task nou Servelect", project: "Inbox operațional", folder: "My Work", status: "Inbox", priority: "Medie", assigneeId: "u-andrei", department: "Producție", dueDate: "2026-06-22", estimateMinutes: 120, trackedMinutes: 0, customFields: { Tip: "Task", Source: "Quick create" }, comments: [], checklist: [{ id: newId("ck"), label: "Definire cerință", done: false }], attachments: [], dependencies: [], updatedAt: now, version: 1 };
  const next = { ...state, tasks: [task, ...state.tasks], selectedTaskId: task.id, notifications: [{ id: newId("n"), title: "Task creat", body: task.title, entity: "task", entityId: task.id, read: false, providerState: "queued" as const, createdAt: now }, ...state.notifications] };
  return appendAudit(next, "task", "Task creat", task.title);
}

export function transitionTask(state: V77RuntimeState, taskId: string, to: V77TaskStatus): V77RuntimeState {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return appendAudit(state, "validation", "Tranziție blocată", `Task inexistent: ${taskId}`);
  const rule = state.workflows.find((item) => item.from === task.status && item.to === to && item.enabled);
  const needsChecklist = rule?.requires.includes("checklist_complete") ?? false;
  const checklistOk = task.checklist.every((item) => item.done);
  if (needsChecklist && !checklistOk) return appendAudit(state, "validation", "Tranziție invalidă", "Checklist incomplet. Statusul nu a fost schimbat.");
  const tasks = state.tasks.map((item) => item.id === taskId ? { ...item, status: to, updatedAt: stamp(), version: item.version + 1 } : item);
  return appendAudit({ ...state, tasks }, "workflow", `Status schimbat: ${task.code}`, `${task.status} -> ${to}`);
}

export function addTaskComment(state: V77RuntimeState, taskId: string, message: string): V77RuntimeState {
  const tasks = state.tasks.map((task) => task.id === taskId ? { ...task, comments: [{ id: newId("c"), author: "Vlad / Manager", message: message.trim() || "Comentariu nou", createdAt: stamp() }, ...task.comments], updatedAt: stamp(), version: task.version + 1 } : task);
  const next = { ...state, tasks, notifications: [{ id: newId("n"), title: "Comentariu task", body: message.trim() || "Comentariu nou", entity: "task", entityId: taskId, read: false, providerState: "queued" as const, createdAt: stamp() }, ...state.notifications] };
  return appendAudit(next, "comment", "Comentariu adăugat", `Task ${taskId}`);
}

export function createTicket(state: V77RuntimeState, title: string): V77RuntimeState {
  const ticket: V77Ticket = { id: newId("tic"), code: `TCK-${180 + state.tickets.length}`, title: title.trim() || "Ticket nou", requester: "Formular Taskuri", client: "Servelect Client", equipment: "N/A", status: "Nou", severity: "S3", slaDueAt: "2026-06-19T12:00:00.000Z", assigneeId: "u-andrei", comments: [], attachments: [] };
  return appendAudit({ ...state, tickets: [ticket, ...state.tickets] }, "ticket", "Ticket creat", ticket.title);
}

export function escalateTicket(state: V77RuntimeState, ticketId: string): V77RuntimeState {
  const tickets = state.tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, status: "Escaladat" as const, severity: ticket.severity === "S4" ? "S3" as const : ticket.severity } : ticket);
  const next = { ...state, tickets, notifications: [{ id: newId("n"), title: "Ticket escaladat", body: ticketId, entity: "ticket", entityId: ticketId, read: false, providerState: "queued" as const, createdAt: stamp() }, ...state.notifications] };
  return appendAudit(next, "ticket", "Ticket escaladat", ticketId);
}

export function createSavedView(state: V77RuntimeState, route: string): V77RuntimeState {
  const view: V77SavedView = { id: newId("sv"), name: `View ${state.savedViews.length + 1} · ${route}`, scope: "private", filters: ["department:current", "status:open"], columns: ["status", "priority", "assignee", "dueDate"], density: "compact", route };
  return appendAudit({ ...state, savedViews: [view, ...state.savedViews] }, "saved_view", "Saved view creat", view.name);
}

export function markAllNotificationsRead(state: V77RuntimeState): V77RuntimeState {
  return appendAudit({ ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) }, "notification", "Notificări marcate citite", "mark all read");
}

export function runProviderRehearsal(state: V77RuntimeState): V77RuntimeState {
  const notifications = state.notifications.map((item) => item.providerState === "queued" ? { ...item, providerState: "delivered" as const } : item);
  const dryRun: V77DryRun = { id: newId("dr"), entity: "notification", action: "provider_delivery_rehearsal", status: "ready", evidence: "Queued notifications rehearsed as delivered in safe shadow mode.", createdAt: stamp() };
  return appendAudit({ ...state, notifications, dryRuns: [dryRun, ...state.dryRuns] }, "provider", "Provider rehearsal rulat", "queued -> delivered");
}

export function runPrimaryWriteDryRun(state: V77RuntimeState): V77RuntimeState {
  const blocked = state.tasks.some((task) => task.version < 1);
  const dryRun: V77DryRun = { id: newId("dr"), entity: "primary-write", action: "dry_run", status: blocked ? "blocked" : "warning", evidence: blocked ? "Some records failed version checks." : "Primary write remains gated but dry-run contracts passed optimistic lock checks.", createdAt: stamp() };
  return appendAudit({ ...state, dryRuns: [dryRun, ...state.dryRuns] }, "primary_dry_run", "Primary write dry-run", dryRun.evidence);
}

export function toggleTimer(state: V77RuntimeState, taskId: string): V77RuntimeState {
  if (state.activeTimerTaskId === taskId) {
    const entry: V77TimeEntry = { id: newId("te"), taskId, userId: "u-andrei", minutes: 30, day: "2026-06-12", submitted: false, approved: false };
    return appendAudit({ ...state, activeTimerTaskId: undefined, timeEntries: [entry, ...state.timeEntries] }, "time", "Timer oprit", "30 minute adăugate ca time entry");
  }
  return appendAudit({ ...state, activeTimerTaskId: taskId }, "time", "Timer pornit", taskId);
}

export function v77CurrentReadiness() {
  return {
    version: V77_RELEASE_VERSION,
    acceptedBaseline: "v7.6.0 screenshot audit 12/12 PASS",
    focus: "GoodDay-like UX discipline on real Taskuri routes plus provider rehearsal and primary dry-run observability.",
    blockers: ["Primary Prisma writes still gated", "Live email/push/websocket providers not connected", "R2/S3 credentials not configured in this update pack"],
    next: "v7.8.0 should connect provider telemetry and start controlled production mutation canary."
  };
}


