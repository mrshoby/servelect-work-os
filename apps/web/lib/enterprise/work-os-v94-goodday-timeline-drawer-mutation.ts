export type V94Mode =
  | "timeline"
  | "calendar"
  | "mutation-queue"
  | "approvals"
  | "templates"
  | "policies"
  | "gantt"
  | "admin";

export type V94DependencyKind = "blocks" | "blocked_by" | "relates_to" | "parent_child";
export type V94MutationState = "queued" | "needs_manager" | "ready_for_pilot" | "rolled_back" | "applied_shadow";

export type V94TaskNode = {
  id: string;
  code: string;
  title: string;
  project: string;
  folder: string;
  department: string;
  owner: string;
  status: "Planificat" | "În lucru" | "Review" | "Blocat" | "Finalizat";
  priority: "urgent" | "high" | "medium" | "low";
  start: string;
  due: string;
  estimateHours: number;
  capacityHours: number;
  progress: number;
  dependencyCount: number;
  updateCount: number;
};

export type V94Dependency = {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  kind: V94DependencyKind;
  lagDays: number;
  status: "valid" | "warning" | "blocked";
  evidence: string;
};

export type V94Mutation = {
  id: string;
  taskId: string;
  field: string;
  before: string;
  after: string;
  actor: string;
  state: V94MutationState;
  approvalGate: string;
  rollbackCheckpoint: string;
  auditEnvelope: string;
};

const tasks: V94TaskNode[] = [
  {
    id: "tsk-940-001",
    code: "SWO-940",
    title: "Leagă dependențele proiectelor FV de Taskuri execution",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Timeline",
    department: "Automatizări",
    owner: "Mihai Ionescu",
    status: "În lucru",
    priority: "urgent",
    start: "2026-06-15",
    due: "2026-06-20",
    estimateHours: 34,
    capacityHours: 28,
    progress: 72,
    dependencyCount: 4,
    updateCount: 9,
  },
  {
    id: "tsk-940-002",
    code: "SWO-941",
    title: "Mutation queue pentru drawer status / owner / due date",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Drawer",
    department: "Audit energetic",
    owner: "Alexandra Rusu",
    status: "Review",
    priority: "high",
    start: "2026-06-16",
    due: "2026-06-21",
    estimateHours: 26,
    capacityHours: 20,
    progress: 64,
    dependencyCount: 3,
    updateCount: 7,
  },
  {
    id: "tsk-940-003",
    code: "SWO-942",
    title: "Calendar capacity sync pentru manageri și echipe",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Workload",
    department: "Producție",
    owner: "Andrei Popescu",
    status: "Planificat",
    priority: "medium",
    start: "2026-06-18",
    due: "2026-06-24",
    estimateHours: 18,
    capacityHours: 22,
    progress: 38,
    dependencyCount: 2,
    updateCount: 4,
  },
  {
    id: "tsk-940-004",
    code: "SWO-943",
    title: "Recurring rules și task templates pentru lucrări recurente",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Templates",
    department: "Comercial",
    owner: "Ioana Marinescu",
    status: "Blocat",
    priority: "high",
    start: "2026-06-17",
    due: "2026-06-25",
    estimateHours: 20,
    capacityHours: 16,
    progress: 46,
    dependencyCount: 5,
    updateCount: 6,
  },
];

const dependencies: V94Dependency[] = [
  { id: "dep-001", fromTaskId: "tsk-940-001", toTaskId: "tsk-940-002", kind: "blocks", lagDays: 1, status: "valid", evidence: "Timeline relation created with rollback checkpoint." },
  { id: "dep-002", fromTaskId: "tsk-940-002", toTaskId: "tsk-940-003", kind: "blocked_by", lagDays: 0, status: "warning", evidence: "Owner capacity must be checked before date shift." },
  { id: "dep-003", fromTaskId: "tsk-940-003", toTaskId: "tsk-940-004", kind: "relates_to", lagDays: 2, status: "valid", evidence: "Calendar sync sees downstream recurring task." },
  { id: "dep-004", fromTaskId: "tsk-940-004", toTaskId: "tsk-940-001", kind: "parent_child", lagDays: 0, status: "blocked", evidence: "Template approval missing for recurring rule." },
];

const mutations: V94Mutation[] = [
  { id: "mut-940-001", taskId: "tsk-940-001", field: "dueDate", before: "2026-06-19", after: "2026-06-20", actor: "Mihai Ionescu", state: "ready_for_pilot", approvalGate: "manager_approved", rollbackCheckpoint: "rb-940-001", auditEnvelope: "actor + lockVersion + before/after + dependency impact" },
  { id: "mut-940-002", taskId: "tsk-940-002", field: "owner", before: "Alexandra Rusu", after: "Andrei Popescu", actor: "Alexandra Rusu", state: "needs_manager", approvalGate: "department_manager_required", rollbackCheckpoint: "rb-940-002", auditEnvelope: "owner change with workload delta" },
  { id: "mut-940-003", taskId: "tsk-940-003", field: "status", before: "Planificat", after: "În lucru", actor: "Andrei Popescu", state: "queued", approvalGate: "capacity_check_pending", rollbackCheckpoint: "rb-940-003", auditEnvelope: "status transition + calendar capacity check" },
  { id: "mut-940-004", taskId: "tsk-940-004", field: "recurrence", before: "none", after: "monthly", actor: "Ioana Marinescu", state: "applied_shadow", approvalGate: "template_owner_approved", rollbackCheckpoint: "rb-940-004", auditEnvelope: "recurrence rule + generated task preview" },
];

const capacity = [
  { team: "Automatizări", plannedHours: 126, availableHours: 132, risk: "green", note: "Dependency changes fit current week capacity." },
  { team: "Audit energetic", plannedHours: 118, availableHours: 104, risk: "amber", note: "Owner transfer requires manager approval." },
  { team: "Producție", plannedHours: 144, availableHours: 138, risk: "amber", note: "Calendar sync must avoid weekend drift." },
  { team: "Comercial", plannedHours: 92, availableHours: 100, risk: "green", note: "Template work can be scheduled after governance approval." },
];

const approvalWorkflows = [
  { id: "wf-940-001", name: "Due date shift with dependency impact", department: "Toate", steps: ["Owner request", "Dependency impact", "Manager approval", "Shadow write", "Rollback checkpoint"], readiness: 94 },
  { id: "wf-940-002", name: "Owner reassignment with workload proof", department: "Audit energetic", steps: ["Workload delta", "Department manager gate", "Notification", "Audit event"], readiness: 91 },
  { id: "wf-940-003", name: "Recurring task template approval", department: "Comercial", steps: ["Template owner", "Recurrence preview", "Policy contract", "Task generation queue"], readiness: 89 },
];

const templates = [
  { id: "tpl-940-001", name: "Revizie lunară sistem FV", recurrence: "monthly", defaultOwner: "Producție", requiredFields: ["site", "inverter", "checklist", "client signature"], policy: "manager_approved" },
  { id: "tpl-940-002", name: "Escaladare SLA ticket mentenanță", recurrence: "on_sla_risk", defaultOwner: "Automatizări", requiredFields: ["severity", "provider", "asset", "rollback"], policy: "dispatcher_approved" },
  { id: "tpl-940-003", name: "Task ofertare cu rezervare materiale", recurrence: "manual", defaultOwner: "Comercial", requiredFields: ["client", "BOM", "margin", "approval"], policy: "department_policy" },
];

const policyContracts = [
  { id: "pol-940-001", scope: "team", name: "Saved view: My Work + blocked dependencies", enforcement: "read + mutation preview", status: "ready" },
  { id: "pol-940-002", scope: "department", name: "Bulk date shift requires capacity proof", enforcement: "approval + rollback", status: "ready" },
  { id: "pol-940-003", scope: "admin", name: "Recurring template generation is queued", enforcement: "shadow first", status: "pilot" },
];

const activity = [
  { at: "09:12", actor: "System", text: "Dependency graph recalculated for four Taskuri execution nodes." },
  { at: "09:18", actor: "Mihai Ionescu", text: "Queued due-date update with rollback checkpoint rb-940-001." },
  { at: "09:24", actor: "Alexandra Rusu", text: "Requested owner reassignment; manager gate is pending." },
  { at: "09:31", actor: "Ioana Marinescu", text: "Template recurrence preview generated in shadow mode." },
];

export function getV94GoodDayTimelineDrawerMutation() {
  return {
    ok: true,
    version: "9.4.0",
    release: "v9.4.0 — Timeline, Gantt Dependencies, Calendar Capacity Sync & Drawer Mutation Queue",
    productionWrites: "OFF_GLOBAL_PILOT_GATED",
    canonicalNavigation: "Taskuri is the single execution entry; no second visible app shell.",
    metrics: [
      { label: "Timeline dependencies", value: `${dependencies.length}`, note: "Relations ready for Gantt/timeline rendering." },
      { label: "Drawer mutations", value: `${mutations.length}`, note: "Queued with audit and rollback envelopes." },
      { label: "Approval workflows", value: `${approvalWorkflows.length}`, note: "Manager gates by department and policy." },
      { label: "Task templates", value: `${templates.length}`, note: "Recurring task rules stay queued/gated." },
    ],
    readiness: [
      { category: "GoodDay-like workspace UX", previous: 91, current: 93, next: "Live inline persistence and command palette actions." },
      { category: "Task & Project Core", previous: 94, current: 95, next: "Gantt editor and dependency drag interactions." },
      { category: "Backend/API", previous: 93, current: 94, next: "Persist queue adapter behind env gate." },
      { category: "Production readiness", previous: 91, current: 92, next: "Manager pilot with real audit storage." },
    ],
    tasks,
    dependencies,
    mutations,
    capacity,
    approvalWorkflows,
    templates,
    policyContracts,
    activity,
  };
}

export function getV94Slice(slice: string) {
  const payload = getV94GoodDayTimelineDrawerMutation();
  switch (slice) {
    case "timeline":
      return { ok: true, version: payload.version, tasks: payload.tasks, dependencies: payload.dependencies };
    case "calendar":
      return { ok: true, version: payload.version, capacity: payload.capacity, tasks: payload.tasks };
    case "mutation-queue":
      return { ok: true, version: payload.version, mutations: payload.mutations, productionWrites: payload.productionWrites };
    case "approvals":
      return { ok: true, version: payload.version, approvalWorkflows: payload.approvalWorkflows };
    case "templates":
      return { ok: true, version: payload.version, templates: payload.templates };
    case "policies":
      return { ok: true, version: payload.version, policyContracts: payload.policyContracts };
    case "readiness":
      return { ok: true, version: payload.version, readiness: payload.readiness, canonicalNavigation: payload.canonicalNavigation };
    default:
      return payload;
  }
}
