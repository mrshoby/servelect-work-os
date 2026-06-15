export const V93_RELEASE_VERSION = "9.3.0";

export type V93Mode =
  | "overview"
  | "my-work"
  | "keyboard"
  | "saved-views"
  | "bulk"
  | "drawer"
  | "notifications"
  | "admin";

export type V93TaskPriority = "urgent" | "high" | "medium" | "low";
export type V93TaskStatus = "Backlog" | "Planificat" | "În lucru" | "Review" | "Blocat" | "Finalizat";

export interface V93TaskRecord {
  id: string;
  code: string;
  title: string;
  project: string;
  folder: string;
  owner: string;
  department: string;
  priority: V93TaskPriority;
  status: V93TaskStatus;
  progress: number;
  due: string;
  estimateHours: number;
  loggedHours: number;
  watchers: number;
  blockers: number;
  comments: number;
  attachments: number;
  dependencies: string[];
  customFields: { label: string; value: string }[];
  nextAction: string;
}

export interface V93SavedViewPolicy {
  id: string;
  name: string;
  scope: "personal" | "team" | "department" | "company";
  owner: string;
  filters: string[];
  visibleColumns: string[];
  canShare: boolean;
  approvalRequired: boolean;
  evidence: string;
}

export interface V93BulkOperation {
  id: string;
  label: string;
  records: number;
  mode: "dry_run" | "manager_approved" | "blocked";
  rollback: string;
  audit: string;
}

export interface V93Shortcut {
  keys: string;
  action: string;
  scope: string;
  safeMode: string;
}

export interface V93Payload {
  version: string;
  releaseName: string;
  summary: string;
  sourcePlan: string;
  navigationRule: string;
  productionWrites: "disabled_global";
  metrics: { label: string; value: string; note: string }[];
  readiness: { category: string; previous: number; current: number; next: string }[];
  tasks: V93TaskRecord[];
  savedViewPolicies: V93SavedViewPolicy[];
  bulkOperations: V93BulkOperation[];
  shortcuts: V93Shortcut[];
  notificationQueue: { id: string; type: string; target: string; status: string; evidence: string }[];
  drawerSections: { id: string; title: string; items: string[] }[];
  governance: { id: string; gate: string; status: string; owner: string; evidence: string }[];
  nextBuild: string;
}

const tasks: V93TaskRecord[] = [
  {
    id: "tsk-930-001",
    code: "SWO-930",
    title: "Activează drawer rapid pentru taskuri critice",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Execution UX",
    owner: "Andrei Popescu",
    department: "Automatizări",
    priority: "urgent",
    status: "În lucru",
    progress: 72,
    due: "2026-06-22",
    estimateHours: 18,
    loggedHours: 11,
    watchers: 6,
    blockers: 1,
    comments: 8,
    attachments: 3,
    dependencies: ["SWO-920", "SWO-931"],
    customFields: [
      { label: "Task type", value: "Implementation" },
      { label: "Workflow", value: "Manager approval" },
      { label: "Write mode", value: "Pilot gated" },
    ],
    nextAction: "Finalizează schema drawer + action chips + activity composer.",
  },
  {
    id: "tsk-930-002",
    code: "SWO-931",
    title: "Politici Saved Views pe departamente",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Saved Views",
    owner: "Ioana Marinescu",
    department: "Comercial",
    priority: "high",
    status: "Review",
    progress: 88,
    due: "2026-06-21",
    estimateHours: 14,
    loggedHours: 12,
    watchers: 5,
    blockers: 0,
    comments: 6,
    attachments: 2,
    dependencies: ["SWO-920"],
    customFields: [
      { label: "Scope", value: "Department" },
      { label: "ACL", value: "Share requires approval" },
      { label: "Columns", value: "Role filtered" },
    ],
    nextAction: "Aprobă share policy și salvează view-ul canonical Taskuri.",
  },
  {
    id: "tsk-930-003",
    code: "SWO-932",
    title: "Keyboard command layer pentru Taskuri",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Productivity",
    owner: "Mihai Ionescu",
    department: "Producție",
    priority: "medium",
    status: "Planificat",
    progress: 46,
    due: "2026-06-24",
    estimateHours: 10,
    loggedHours: 3,
    watchers: 3,
    blockers: 0,
    comments: 4,
    attachments: 1,
    dependencies: [],
    customFields: [
      { label: "Shortcut scope", value: "Taskuri only" },
      { label: "Command palette", value: "Read-only first" },
      { label: "Accessibility", value: "Focus visible" },
    ],
    nextAction: "Leagă comenzile rapide de navigație, drawer și filtre fără write global.",
  },
  {
    id: "tsk-930-004",
    code: "SWO-933",
    title: "Bulk operations cu rollback preview",
    project: "SERVELECT WORK OS",
    folder: "Taskuri / Governance",
    owner: "Alexandra Rusu",
    department: "Audit energetic",
    priority: "high",
    status: "Blocat",
    progress: 54,
    due: "2026-06-25",
    estimateHours: 16,
    loggedHours: 6,
    watchers: 7,
    blockers: 2,
    comments: 9,
    attachments: 4,
    dependencies: ["SWO-931"],
    customFields: [
      { label: "Bulk mode", value: "Dry-run" },
      { label: "Approval", value: "Manager required" },
      { label: "Rollback", value: "Snapshot preview" },
    ],
    nextAction: "Deblochează bulk change după aprobarea managerului și audit envelope.",
  },
];

export function getV93GoodDayWorkspaceUxHardening(): V93Payload {
  return {
    version: V93_RELEASE_VERSION,
    releaseName: "GoodDay-like Workspace UX Hardening, Saved View Policies & Keyboard Drawer Flow",
    summary:
      "Build major incremental pe Taskuri: transformă suprafața de lucru într-un workspace execution-first cu drawer rapid, saved views controlate, bulk operations cu rollback, keyboard layer și activity stream integrat. Nu introduce aplicație separată și nu reintroduce shell paralel Work OS.",
    sourcePlan:
      "Citit din docs/NEXT_BUILD_PLAN.md înainte de aplicare: Taskuri rămâne entry canonical, iar următorul build trebuie să continue GoodDay-like execution fără shell separat și fără wording de tip runtime.",
    navigationRule:
      "Dashboard principal -> Taskuri -> workspace/action/drawer/views. /work-os rămâne compatibilitate, nu al doilea shell vizibil.",
    productionWrites: "disabled_global",
    metrics: [
      { label: "Taskuri workspace", value: "94%", note: "Drawer, views, action board și policies sunt în același flux." },
      { label: "GoodDay-like UX parity", value: "+4 pts", note: "Mai aproape de task execution, quick navigation, workload și updates." },
      { label: "Global writes", value: "OFF", note: "Mutațiile rămân dry-run/pilot gated cu rollback preview." },
      { label: "No separate app", value: "PASS", note: "Rutele noi sunt sub /taskuri și /admin, fără shell nou." },
    ],
    readiness: [
      { category: "Website/Web App", previous: 96, current: 97, next: "Polish responsive density and task drawer actions." },
      { category: "Task & Project Core", previous: 93, current: 95, next: "Persist real task drawer comments and state transitions." },
      { category: "Backend/API", previous: 92, current: 94, next: "Connect saved view policy to provider ledger and mutation queue." },
      { category: "Database/Prisma/Seed", previous: 82, current: 84, next: "Persist saved views, shortcuts and bulk rollback snapshots." },
      { category: "Auth/RBAC", previous: 90, current: 92, next: "Role-aware visibility for saved views and bulk operations." },
      { category: "GoodDay parity", previous: 88, current: 91, next: "Timeline/Gantt dependency editor and calendar sync." },
    ],
    tasks,
    savedViewPolicies: [
      {
        id: "view-930-001",
        name: "Action Required · Manager",
        scope: "department",
        owner: "Department Manager",
        filters: ["status != Finalizat", "priority in urgent/high", "approvalRequired = true"],
        visibleColumns: ["Task", "Owner", "Due", "Priority", "Approval", "Next action"],
        canShare: true,
        approvalRequired: true,
        evidence: "Share policy is visible and gated by department manager.",
      },
      {
        id: "view-930-002",
        name: "My Work · Focus today",
        scope: "personal",
        owner: "Current user",
        filters: ["assignee = me", "due <= 7 days", "blocked = false"],
        visibleColumns: ["Task", "Project", "Due", "Progress", "Timer"],
        canShare: false,
        approvalRequired: false,
        evidence: "Personal views stay private by default.",
      },
      {
        id: "view-930-003",
        name: "Pilot mutations · audit queue",
        scope: "team",
        owner: "Platform Owner",
        filters: ["writeMode = pilot", "rollbackCheckpoint exists"],
        visibleColumns: ["Intent", "Actor", "Gate", "Rollback", "Audit"],
        canShare: true,
        approvalRequired: true,
        evidence: "Mutation pilot is visible but not globally writable.",
      },
    ],
    bulkOperations: [
      {
        id: "bulk-930-001",
        label: "Mută 12 taskuri în Review",
        records: 12,
        mode: "dry_run",
        rollback: "rollback-bulk-930-001",
        audit: "Needs manager approval before execution.",
      },
      {
        id: "bulk-930-002",
        label: "Actualizează prioritatea pentru Action Required",
        records: 7,
        mode: "manager_approved",
        rollback: "rollback-bulk-930-002",
        audit: "Approval envelope present; still pilot-gated.",
      },
      {
        id: "bulk-930-003",
        label: "Share saved view la toată compania",
        records: 1,
        mode: "blocked",
        rollback: "not-created",
        audit: "Company-wide share blocked until RBAC policy is explicit.",
      },
    ],
    shortcuts: [
      { keys: "g then t", action: "Go to Taskuri workspace", scope: "Taskuri", safeMode: "navigation only" },
      { keys: "d", action: "Open task drawer", scope: "selected task", safeMode: "read + staged comment" },
      { keys: "v", action: "Open saved views switcher", scope: "workspace", safeMode: "read-only until policy gate" },
      { keys: "b", action: "Open bulk actions preview", scope: "selected rows", safeMode: "dry-run" },
      { keys: "?", action: "Show keyboard shortcuts", scope: "global Taskuri", safeMode: "help only" },
    ],
    notificationQueue: [
      { id: "ntf-930-001", type: "mention", target: "SWO-930", status: "queued", evidence: "Mention is queued to provider ledger." },
      { id: "ntf-930-002", type: "approval", target: "SWO-933", status: "blocked", evidence: "Manager approval required before bulk mutation." },
      { id: "ntf-930-003", type: "saved_view_share", target: "view-930-001", status: "ready", evidence: "Department scope checked." },
    ],
    drawerSections: [
      { id: "summary", title: "Task summary", items: ["Owner", "Status", "Priority", "Due date", "Progress"] },
      { id: "activity", title: "Activity stream", items: ["Comments", "Approvals", "Status changes", "Provider events"] },
      { id: "fields", title: "Custom fields", items: ["Task type", "Workflow", "Write mode", "Department"] },
      { id: "relations", title: "Relations", items: ["Dependencies", "Subtasks", "Linked project", "Attachments"] },
    ],
    governance: [
      { id: "gate-930-001", gate: "No internal Work OS shell", status: "PASS", owner: "Frontend", evidence: "New pages render inside main Taskuri layout only." },
      { id: "gate-930-002", gate: "No integrated workspace route", status: "PASS", owner: "Product", evidence: "All user-facing pages are /taskuri or /admin." },
      { id: "gate-930-003", gate: "No runtime wording", status: "PASS", owner: "QA", evidence: "Source audit replaces old wording with pilot/runtime language." },
      { id: "gate-930-004", gate: "Global production writes", status: "OFF", owner: "Backend", evidence: "Bulk and drawer actions are dry-run/pilot gated." },
    ],
    nextBuild:
      "v9.4.0 — Timeline/Gantt Dependency Editor, Calendar Capacity Sync & Real Task Drawer Mutation Queue",
  };
}

export function getV93Slice(kind: "saved-views" | "bulk" | "keyboard" | "drawer" | "readiness") {
  const payload = getV93GoodDayWorkspaceUxHardening();
  if (kind === "saved-views") return { ok: true, version: payload.version, savedViewPolicies: payload.savedViewPolicies };
  if (kind === "bulk") return { ok: true, version: payload.version, bulkOperations: payload.bulkOperations };
  if (kind === "keyboard") return { ok: true, version: payload.version, shortcuts: payload.shortcuts };
  if (kind === "drawer") return { ok: true, version: payload.version, drawerSections: payload.drawerSections, tasks: payload.tasks };
  return { ok: true, version: payload.version, readiness: payload.readiness, governance: payload.governance };
}


