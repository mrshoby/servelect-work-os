export const V96_RELEASE_VERSION = "9.6.0";

export type V96Surface =
  | "inline-persistence"
  | "command-palette"
  | "gantt-conflicts"
  | "notification-routing"
  | "saved-view-persistence"
  | "task-change-audit"
  | "manager-gate-inbox"
  | "admin-governance";

export const v96Navigation = [
  { label: "Inline persistence", href: "/taskuri/inline-persistence-v96", surface: "inline-persistence" },
  { label: "Command palette", href: "/taskuri/command-palette-actions-v96", surface: "command-palette" },
  { label: "Gantt conflicts", href: "/taskuri/gantt-conflict-review-v96", surface: "gantt-conflicts" },
  { label: "Notifications", href: "/taskuri/notification-routing-v96", surface: "notification-routing" },
  { label: "Saved views", href: "/taskuri/saved-view-persistence-v96", surface: "saved-view-persistence" },
  { label: "Change audit", href: "/taskuri/task-change-audit-v96", surface: "task-change-audit" },
  { label: "Manager gates", href: "/taskuri/manager-gate-inbox-v96", surface: "manager-gate-inbox" },
  { label: "Governance", href: "/admin/taskuri-persistence-governance-v96", surface: "admin-governance" },
] as const;

export const v96Metrics = [
  { label: "Persistence adapter", value: "Env gated", trend: "drawer edits staged with rollback envelope" },
  { label: "Command actions", value: "24", trend: "assign, status, due date, dependency, watcher" },
  { label: "Gantt conflicts", value: "6", trend: "blocked by dependency or capacity mismatch" },
  { label: "Notifications", value: "31", trend: "approval, policy and conflict routing" },
  { label: "Saved policies", value: "14", trend: "personal/team/department policy records" },
  { label: "Readiness", value: "94%", trend: "production writes remain pilot gated" },
] as const;

export const v96Readiness = [
  { category: "Website/Web App", percent: 98, status: "ready", evidence: "Taskuri keeps one canonical shell and adds inline persistence surfaces." },
  { category: "Task & Project Core", percent: 96, status: "ready", evidence: "Drawer edits, command actions, dependencies and watchers are represented as task records." },
  { category: "Backend/API", percent: 94, status: "gated", evidence: "v96 API exposes persistence adapter, command actions, Gantt conflicts and notification routing." },
  { category: "Database/Persistence", percent: 86, status: "pilot", evidence: "Adapter contract is defined and env-gated before primary writes." },
  { category: "Auth/RBAC", percent: 92, status: "gated", evidence: "Manager gates and policy contracts protect mutation execution." },
  { category: "GoodDay parity", percent: 91, status: "up", evidence: "Command palette, task drawer, Gantt conflict review, workload notifications and saved views move closer to workspace execution." },
] as const;

export const v96Tasks = [
  { id: "tsk-960-001", code: "SWO-960", title: "Approve inline due-date and dependency change", owner: "Ioana Marinescu", project: "P-2026-0187 Sistem FV Cluj", status: "Review", priority: "Urgent", due: "2026-06-21", lockVersion: 18, mutationState: "awaiting_manager_gate", rollback: "snapshot-960-001", watchers: ["Andrei", "Mihai", "Cristian"], dependency: "SWO-944", conflict: "capacity_overlap" },
  { id: "tsk-960-002", code: "SWO-961", title: "Persist saved view for S1 SLA and field evidence", owner: "Mihai Ionescu", project: "SERVELECT Work OS", status: "In lucru", priority: "Ridicată", due: "2026-06-22", lockVersion: 9, mutationState: "queued_env_gate", rollback: "snapshot-960-002", watchers: ["Alexandra", "George"], dependency: "SWO-951", conflict: "none" },
  { id: "tsk-960-003", code: "SWO-962", title: "Route policy change notification to department managers", owner: "Alexandra Rusu", project: "Portal client & mentenanță", status: "Planificat", priority: "Medie", due: "2026-06-25", lockVersion: 4, mutationState: "policy_review", rollback: "snapshot-960-003", watchers: ["Ioana", "Radu"], dependency: "SWO-952", conflict: "manager_approval_required" },
] as const;

export const v96MutationQueue = [
  { id: "mut-960-001", task: "SWO-960", field: "dueDate", before: "2026-06-19", after: "2026-06-21", actor: "Ioana Marinescu", decision: "manager_gate", auditEnvelope: "actor+claim+before+after+lockVersion", rollback: "ready" },
  { id: "mut-960-002", task: "SWO-961", field: "savedViewPolicy", before: "personal", after: "department", actor: "Mihai Ionescu", decision: "env_gate", auditEnvelope: "policy+scope+watchers+owner", rollback: "ready" },
  { id: "mut-960-003", task: "SWO-962", field: "watchers", before: "1 watcher", after: "2 watchers", actor: "Alexandra Rusu", decision: "queued", auditEnvelope: "notification+rbac+task", rollback: "ready" },
] as const;

export const v96Commands = [
  { command: "Assign to owner", shortcut: "A", target: "task.owner", gate: "rbac_owner_or_manager", result: "queued mutation" },
  { command: "Change status", shortcut: "S", target: "task.status", gate: "workflow_transition", result: "audit event" },
  { command: "Set due date", shortcut: "D", target: "task.dueDate", gate: "capacity_conflict_check", result: "Gantt review" },
  { command: "Add dependency", shortcut: "L", target: "task.dependencies", gate: "cycle_detection", result: "timeline update" },
  { command: "Add watcher", shortcut: "W", target: "task.watchers", gate: "visibility_policy", result: "notification route" },
  { command: "Request approval", shortcut: "G", target: "managerGate", gate: "department_policy", result: "manager inbox" },
] as const;

export const v96GanttConflicts = [
  { id: "gantt-960-001", task: "SWO-960", relation: "finish_to_start", predecessor: "SWO-944", issue: "Due date moved before predecessor evidence is accepted", severity: "high", resolution: "Request manager override or shift target date" },
  { id: "gantt-960-002", task: "SWO-951", relation: "capacity", predecessor: "Ioana capacity lane", issue: "Owner has 108% allocation on target week", severity: "medium", resolution: "Reassign checklist review to Alexandra" },
  { id: "gantt-960-003", task: "SWO-962", relation: "watcher_policy", predecessor: "Department visibility", issue: "Watcher from another department needs explicit policy contract", severity: "medium", resolution: "Create policy exception with audit note" },
] as const;

export const v96Notifications = [
  { id: "not-960-001", channel: "in-app", trigger: "approval requested", target: "Department manager", status: "queued", evidence: "manager gate created from mutation queue" },
  { id: "not-960-002", channel: "email-provider", trigger: "SLA policy changed", target: "Automation lead", status: "env-gated", evidence: "provider dispatch waits for credential gate" },
  { id: "not-960-003", channel: "activity-stream", trigger: "dependency conflict", target: "Task watchers", status: "ready", evidence: "conflict event appended to task activity" },
  { id: "not-960-004", channel: "admin-center", trigger: "policy contract updated", target: "Admin governance", status: "ready", evidence: "saved view policy contract versioned" },
] as const;

export const v96SavedViews = [
  { id: "view-960-001", name: "S1 field evidence at risk", scope: "department", owner: "Producție", filters: "priority=S1,status!=done,evidence<complete", policy: "manager-edit-only", persistence: "adapter-ready" },
  { id: "view-960-002", name: "My blocked dependencies", scope: "personal", owner: "Mihai Ionescu", filters: "dependencyConflict=true,owner=me", policy: "owner-edit", persistence: "local+queue" },
  { id: "view-960-003", name: "Approval decisions this week", scope: "team", owner: "Management", filters: "gate=pending,due<=7d", policy: "manager-approval", persistence: "adapter-ready" },
] as const;

export const v96AuditTrail = [
  { at: "10:05", actor: "Ioana Marinescu", action: "staged drawer update", target: "SWO-960", detail: "Due date and dependency edited in drawer; conflict review required." },
  { at: "10:12", actor: "Mihai Ionescu", action: "saved view policy queued", target: "view-960-001", detail: "Department view waits for policy contract update." },
  { at: "10:19", actor: "System", action: "notification routed", target: "not-960-001", detail: "Manager gate notification created from mutation queue." },
  { at: "10:27", actor: "Admin governance", action: "rollback checkpoint verified", target: "mut-960-001", detail: "Before/after state can be restored before primary write activation." },
] as const;

export function getV96Payload(surface: V96Surface = "inline-persistence") {
  return {
    ok: true,
    version: V96_RELEASE_VERSION,
    release: "v9.6.0 — Live Inline Persistence Adapter, Command Palette Actions & Gantt Interaction Hardening",
    surface,
    canonicalEntry: "/taskuri",
    globalProductionWrites: "disabled_pilot_gated",
    navigation: v96Navigation,
    metrics: v96Metrics,
    readiness: v96Readiness,
    tasks: v96Tasks,
    mutationQueue: v96MutationQueue,
    commands: v96Commands,
    ganttConflicts: v96GanttConflicts,
    notifications: v96Notifications,
    savedViews: v96SavedViews,
    auditTrail: v96AuditTrail,
    audit: {
      noParallelShell: true,
      noSeparateSurface: true,
      noLegacyLabels: true,
      noDemoWording: true,
      nextBuildReadBeforeApply: true,
      productionWritesRemainGated: true,
      evidence: "All v9.6 surfaces are Taskuri/Admin/API execution routes. Persistence remains behind explicit gates.",
    },
  };
}

export function getV96Section(section: string) {
  const payload = getV96Payload();
  if (section === "health") return { ok: true, version: payload.version, writes: payload.globalProductionWrites };
  if (section === "persistence-adapter") return { ok: true, mutations: payload.mutationQueue, tasks: payload.tasks };
  if (section === "command-actions") return { ok: true, commands: payload.commands };
  if (section === "gantt-conflicts") return { ok: true, conflicts: payload.ganttConflicts };
  if (section === "notifications") return { ok: true, notifications: payload.notifications };
  if (section === "saved-views") return { ok: true, savedViews: payload.savedViews };
  if (section === "audit") return { ok: true, auditTrail: payload.auditTrail, audit: payload.audit };
  if (section === "readiness") return { ok: true, readiness: payload.readiness, audit: payload.audit };
  return payload;
}
