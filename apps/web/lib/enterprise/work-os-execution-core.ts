export type WorkOsExecutionStatus =
  | "ready"
  | "active"
  | "watch"
  | "blocked"
  | "draft"
  | "queued"
  | "pending"
  | "approved"
  | "shadow"
  | "staging";

export type WorkOsPriority = "low" | "medium" | "high" | "critical";
export type WorkOsDomain =
  | "tasks"
  | "projects"
  | "stock"
  | "pontaj"
  | "crm"
  | "offers"
  | "audit"
  | "fieldOps"
  | "admin"
  | "automation";

export type CompletionMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export type WorkOsProject = {
  id: string;
  code: string;
  name: string;
  client: string;
  owner: string;
  stage: string;
  status: WorkOsExecutionStatus;
  priority: WorkOsPriority;
  budgetEuro: number;
  progress: number;
  start: string;
  due: string;
  location: string;
  linkedStockReservations: string[];
  linkedTasks: string[];
  risks: string[];
};

export type WorkOsTask = {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  team: string;
  status: "Backlog" | "De făcut" | "În lucru" | "Review / QA" | "Blocat" | "Finalizat" | "Anulat";
  priority: WorkOsPriority;
  due: string;
  estimateHours: number;
  loggedHours: number;
  source: WorkOsDomain;
  blockers: string[];
  auditRequired: boolean;
};

export type KanbanColumn = {
  id: string;
  label: WorkOsTask["status"];
  limit: number;
  tasks: WorkOsTask[];
};

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  projectId: string;
  owner: string;
  type: "milestone" | "field" | "approval" | "delivery" | "meeting";
  status: WorkOsExecutionStatus;
};

export type GanttPhase = {
  id: string;
  projectId: string;
  phase: string;
  start: string;
  end: string;
  progress: number;
  dependency: string;
  status: WorkOsExecutionStatus;
};

export type WorkloadRow = {
  id: string;
  person: string;
  role: string;
  department: string;
  capacityHours: number;
  assignedHours: number;
  pontajHours: number;
  overtimeRisk: WorkOsExecutionStatus;
  nextAction: string;
};

export type ApprovalItem = {
  id: string;
  title: string;
  requester: string;
  approver: string;
  domain: WorkOsDomain;
  status: "pending" | "approved" | "rejected" | "needs-info";
  amountEuro?: number;
  evidence: string[];
  createdAt: string;
};

export type DraftRecord = {
  id: string;
  domain: WorkOsDomain;
  title: string;
  owner: string;
  lastSavedAt: string;
  completion: number;
  validation: WorkOsExecutionStatus;
  missingFields: string[];
};

export type MaterialPlan = {
  id: string;
  projectId: string;
  product: string;
  requiredQty: number;
  reservedQty: number;
  inStockQty: number;
  orderedQty: number;
  status: WorkOsExecutionStatus;
  supplier: string;
  eta: string;
};

export type OfferPipelineItem = {
  id: string;
  client: string;
  title: string;
  stage: "lead" | "analysis" | "draft" | "review" | "sent" | "won" | "lost";
  valueEuro: number;
  probability: number;
  owner: string;
  linkedProjectId?: string;
  nextStep: string;
};

export type FieldOpsTicket = {
  id: string;
  projectId: string;
  technician: string;
  site: string;
  checklist: string[];
  status: WorkOsExecutionStatus;
  startedAt: string;
  gpsRequired: boolean;
  photosRequired: boolean;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  domain: WorkOsDomain;
  entityId: string;
  severity: WorkOsPriority;
  beforeHash: string;
  afterHash: string;
  createdAt: string;
  rollbackAvailable: boolean;
};

export type RbacRule = {
  role: "Admin" | "Manager" | "Inginer" | "Tehnician" | "Viewer" | "Warehouse" | "HR";
  domain: WorkOsDomain;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canApprove: boolean;
  canDelete: boolean;
  notes: string;
};

export type AutomationLane = {
  id: string;
  title: string;
  trigger: string;
  domains: WorkOsDomain[];
  status: WorkOsExecutionStatus;
  nextRun: string;
  output: string;
};

export type AdminCommand = {
  id: string;
  label: string;
  command: string;
  safety: "safe" | "guarded" | "danger";
  requiresApproval: boolean;
  effect: string;
};

export type IncidentSignal = {
  id: string;
  title: string;
  domain: WorkOsDomain;
  severity: WorkOsPriority;
  status: WorkOsExecutionStatus;
  detection: string;
  runbook: string;
};

export type WorkOsExecutionCore = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  writeMode: string;
  summary: string;
  readiness: Record<"website" | "taskProject" | "backend" | "database" | "auth" | "iot" | "mobile", number>;
  metrics: CompletionMetric[];
  navigation: Array<{ label: string; href: string; group: string }>;
  projects: WorkOsProject[];
  tasks: WorkOsTask[];
  kanban: KanbanColumn[];
  calendar: CalendarEvent[];
  gantt: GanttPhase[];
  workload: WorkloadRow[];
  approvals: ApprovalItem[];
  drafts: DraftRecord[];
  materialPlan: MaterialPlan[];
  offers: OfferPipelineItem[];
  fieldOps: FieldOpsTicket[];
  audit: AuditEvent[];
  rbac: RbacRule[];
  automations: AutomationLane[];
  commands: AdminCommand[];
  incidents: IncidentSignal[];
  capabilities: string[];
};

const version = "5.4.0";
const name = "Full Interactive Work OS Execution Pack";

export const readiness: WorkOsExecutionCore["readiness"] = {
  website: 99,
  taskProject: 99,
  backend: 99,
  database: 99,
  auth: 99,
  iot: 95,
  mobile: 94
};

export const metrics: CompletionMetric[] = [
  { id: "website", label: "Website/Web App", value: readiness.website, description: "Unified pages, real CRUD workflow screens, dashboards, kanban, calendar and admin operations." },
  { id: "taskProject", label: "Task & Project Core", value: readiness.taskProject, description: "Project/task execution core with status columns, workload and approval flows." },
  { id: "backend", label: "Backend/API", value: readiness.backend, description: "API read models, workflow endpoints and command-center contracts." },
  { id: "database", label: "Database/Prisma/Seed", value: readiness.database, description: "Source-of-truth contracts remain gated, Prisma writes controlled by environment." },
  { id: "auth", label: "Auth/RBAC", value: readiness.auth, description: "RBAC matrix, approval controls and audit requirements per domain." },
  { id: "iot", label: "IoT/Ops", value: readiness.iot, description: "Field operations, site activity and incident signals connected to operations views." },
  { id: "mobile", label: "Mobile App", value: readiness.mobile, description: "Mobile/field workflows represented through technician, checklist, photos and GPS requirements." }
];

export const projects: WorkOsProject[] = [
  { id: "prj-uta-buzau", code: "UTA-BZ-2026", name: "UTA Buzău - stații fotovoltaice și operațiuni", client: "UTA Buzău", owner: "Manager Proiect PV", stage: "Execuție", status: "active", priority: "critical", budgetEuro: 426000, progress: 68, start: "2026-06-01", due: "2026-08-12", location: "Buzău", linkedStockReservations: ["mat-001", "mat-003"], linkedTasks: ["tsk-001", "tsk-002", "tsk-003"], risks: ["materiale invertor în comandă", "echipă teren la capacitate 92%"] },
  { id: "prj-raja", code: "RAJA-OPS-2026", name: "RAJA - mentenanță și integrare operațională", client: "RAJA S.A. Constanța", owner: "Operations Lead", stage: "Mentenanță", status: "watch", priority: "high", budgetEuro: 188000, progress: 44, start: "2026-05-21", due: "2026-07-25", location: "Constanța", linkedStockReservations: ["mat-002"], linkedTasks: ["tsk-004", "tsk-005"], risks: ["program teren dependent de pontaj", "verificare documente"] },
  { id: "prj-digitalizare", code: "SERV-WOS-2026", name: "Servelect Work OS - digitalizare internă", client: "Servelect", owner: "Platform Owner", stage: "Platform build", status: "active", priority: "critical", budgetEuro: 95000, progress: 76, start: "2026-06-03", due: "2026-09-01", location: "Cluj-Napoca", linkedStockReservations: [], linkedTasks: ["tsk-006", "tsk-007", "tsk-008"], risks: ["cutover adapters", "training utilizatori"] },
  { id: "prj-prosumer", code: "PV-PROS-2026", name: "Pachet prosumatori - ofertare și execuție", client: "Beneficiari rezidențiali", owner: "Sales Engineer", stage: "Ofertare", status: "queued", priority: "medium", budgetEuro: 62000, progress: 28, start: "2026-06-15", due: "2026-08-30", location: "Transilvania", linkedStockReservations: ["mat-004"], linkedTasks: ["tsk-009", "tsk-010"], risks: ["prețuri materiale volatile"] }
];

export const tasks: WorkOsTask[] = [
  { id: "tsk-001", projectId: "prj-uta-buzau", title: "Confirmare rezervare panouri și accesorii DC", assignee: "Warehouse Owner", team: "Stocuri", status: "În lucru", priority: "critical", due: "2026-06-10", estimateHours: 6, loggedHours: 3.5, source: "stock", blockers: ["verificare furnizor"], auditRequired: true },
  { id: "tsk-002", projectId: "prj-uta-buzau", title: "Planificare echipă teren săptămâna 24", assignee: "Field Ops Lead", team: "Teren", status: "De făcut", priority: "high", due: "2026-06-11", estimateHours: 4, loggedHours: 0.5, source: "pontaj", blockers: [], auditRequired: true },
  { id: "tsk-003", projectId: "prj-uta-buzau", title: "Revizie documentație tehnică UTA", assignee: "Inginer Proiect", team: "Engineering", status: "Review / QA", priority: "high", due: "2026-06-14", estimateHours: 9, loggedHours: 8, source: "projects", blockers: [], auditRequired: false },
  { id: "tsk-004", projectId: "prj-raja", title: "Inspecție site RAJA - checklist mentenanță", assignee: "Tehnician teren", team: "Teren", status: "În lucru", priority: "high", due: "2026-06-12", estimateHours: 8, loggedHours: 2, source: "fieldOps", blockers: ["confirmare acces site"], auditRequired: true },
  { id: "tsk-005", projectId: "prj-raja", title: "Raport operațional RAJA după vizită", assignee: "Operations Lead", team: "Operațiuni", status: "Backlog", priority: "medium", due: "2026-06-15", estimateHours: 3, loggedHours: 0, source: "audit", blockers: [], auditRequired: true },
  { id: "tsk-006", projectId: "prj-digitalizare", title: "Implementare CRUD proiecte și taskuri", assignee: "Platform Owner", team: "Digitalizare", status: "În lucru", priority: "critical", due: "2026-06-18", estimateHours: 16, loggedHours: 9, source: "tasks", blockers: [], auditRequired: true },
  { id: "tsk-007", projectId: "prj-digitalizare", title: "RBAC matrix pentru admin și manageri", assignee: "Security/RBAC Owner", team: "Admin", status: "De făcut", priority: "high", due: "2026-06-20", estimateHours: 10, loggedHours: 1, source: "admin", blockers: [], auditRequired: true },
  { id: "tsk-008", projectId: "prj-digitalizare", title: "Design dashboard Work OS ca GoodDay/ClickUp", assignee: "UI/UX Lead", team: "Product", status: "Review / QA", priority: "high", due: "2026-06-13", estimateHours: 12, loggedHours: 11, source: "projects", blockers: [], auditRequired: false },
  { id: "tsk-009", projectId: "prj-prosumer", title: "Generare ofertă prosumator standard", assignee: "Sales Engineer", team: "Ofertare", status: "De făcut", priority: "medium", due: "2026-06-22", estimateHours: 5, loggedHours: 0, source: "offers", blockers: [], auditRequired: true },
  { id: "tsk-010", projectId: "prj-prosumer", title: "Verificare disponibilitate invertere 6kW", assignee: "Warehouse Owner", team: "Stocuri", status: "Blocat", priority: "high", due: "2026-06-19", estimateHours: 2, loggedHours: 1.5, source: "stock", blockers: ["stoc insuficient"], auditRequired: true }
];

const statuses: WorkOsTask["status"][] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat"];
export const kanban: KanbanColumn[] = statuses.map((status) => ({ id: status.toLowerCase().replace(/\s+/g, "-"), label: status, limit: status === "În lucru" ? 5 : 10, tasks: tasks.filter((task) => task.status === status) }));

export const calendar: CalendarEvent[] = [
  { id: "cal-001", date: "2026-06-10", title: "Rezervare materiale UTA", projectId: "prj-uta-buzau", owner: "Warehouse Owner", type: "delivery", status: "active" },
  { id: "cal-002", date: "2026-06-12", title: "RAJA site inspection", projectId: "prj-raja", owner: "Tehnician teren", type: "field", status: "watch" },
  { id: "cal-003", date: "2026-06-14", title: "QA documentație UTA", projectId: "prj-uta-buzau", owner: "Inginer Proiect", type: "approval", status: "pending" },
  { id: "cal-004", date: "2026-06-18", title: "CRUD Work OS review", projectId: "prj-digitalizare", owner: "Platform Owner", type: "milestone", status: "active" },
  { id: "cal-005", date: "2026-06-22", title: "Ofertă prosumator standard", projectId: "prj-prosumer", owner: "Sales Engineer", type: "meeting", status: "queued" }
];

export const gantt: GanttPhase[] = [
  { id: "gnt-001", projectId: "prj-uta-buzau", phase: "Engineering", start: "2026-06-01", end: "2026-06-18", progress: 82, dependency: "contract semnat", status: "active" },
  { id: "gnt-002", projectId: "prj-uta-buzau", phase: "Achiziție materiale", start: "2026-06-05", end: "2026-06-27", progress: 54, dependency: "aprobări tehnice", status: "watch" },
  { id: "gnt-003", projectId: "prj-raja", phase: "Mentenanță teren", start: "2026-06-08", end: "2026-06-19", progress: 35, dependency: "acces site", status: "watch" },
  { id: "gnt-004", projectId: "prj-digitalizare", phase: "Core modules", start: "2026-06-03", end: "2026-07-05", progress: 76, dependency: "schema contracts", status: "active" },
  { id: "gnt-005", projectId: "prj-prosumer", phase: "Ofertare", start: "2026-06-15", end: "2026-06-30", progress: 28, dependency: "prețuri materiale", status: "queued" }
];

export const workload: WorkloadRow[] = [
  { id: "wrk-001", person: "Catalin Bustan", role: "Tehnician", department: "Teren", capacityHours: 40, assignedHours: 44, pontajHours: 39.5, overtimeRisk: "watch", nextAction: "redistribuie task RAJA dacă depășește norma" },
  { id: "wrk-002", person: "Manager Proiect PV", role: "Manager", department: "Engineering", capacityHours: 40, assignedHours: 36, pontajHours: 37, overtimeRisk: "ready", nextAction: "poate prelua review documentație" },
  { id: "wrk-003", person: "Warehouse Owner", role: "Warehouse", department: "Stocuri", capacityHours: 40, assignedHours: 46, pontajHours: 42, overtimeRisk: "watch", nextAction: "prioritizează UTA și prosumatori" },
  { id: "wrk-004", person: "Sales Engineer", role: "Inginer vânzări", department: "Ofertare", capacityHours: 40, assignedHours: 28, pontajHours: 26, overtimeRisk: "ready", nextAction: "poate procesa oferte prosumatori" }
];

export const approvals: ApprovalItem[] = [
  { id: "apr-001", title: "Rezervare invertere UTA", requester: "Warehouse Owner", approver: "Manager Proiect PV", domain: "stock", status: "pending", amountEuro: 26500, evidence: ["stoc curent", "necesar proiect", "ETA furnizor"], createdAt: "2026-06-06T09:30:00Z" },
  { id: "apr-002", title: "Ofertă prosumator standard > 10k EUR", requester: "Sales Engineer", approver: "Manager Comercial", domain: "offers", status: "needs-info", amountEuro: 14800, evidence: ["deviz materiale", "marjă estimată"], createdAt: "2026-06-06T12:15:00Z" },
  { id: "apr-003", title: "Pontaj workload adjustment teren", requester: "Operations Lead", approver: "HR Ops", domain: "pontaj", status: "approved", evidence: ["ore pontaj", "taskuri active", "normă săptămânală"], createdAt: "2026-06-05T15:20:00Z" }
];

export const drafts: DraftRecord[] = [
  { id: "drf-001", domain: "projects", title: "Proiect nou prosumator 20kWp", owner: "Sales Engineer", lastSavedAt: "2026-06-06T17:10:00Z", completion: 68, validation: "watch", missingFields: ["adresa completă", "putere instalată finală"] },
  { id: "drf-002", domain: "tasks", title: "Task verificare PRAM", owner: "Inginer Proiect", lastSavedAt: "2026-06-06T16:45:00Z", completion: 90, validation: "ready", missingFields: [] },
  { id: "drf-003", domain: "stock", title: "Rezervare cablu solar 6mm", owner: "Warehouse Owner", lastSavedAt: "2026-06-06T14:05:00Z", completion: 75, validation: "watch", missingFields: ["furnizor alternativ"] }
];

export const materialPlan: MaterialPlan[] = [
  { id: "mat-001", projectId: "prj-uta-buzau", product: "Panou fotovoltaic 550W", requiredQty: 420, reservedQty: 320, inStockQty: 360, orderedQty: 120, status: "watch", supplier: "Distribuitor PV RO", eta: "2026-06-18" },
  { id: "mat-002", projectId: "prj-raja", product: "Siguranțe DC 1000V", requiredQty: 36, reservedQty: 36, inStockQty: 52, orderedQty: 0, status: "ready", supplier: "Depozit intern", eta: "în stoc" },
  { id: "mat-003", projectId: "prj-uta-buzau", product: "Invertor trifazat 100kW", requiredQty: 4, reservedQty: 2, inStockQty: 2, orderedQty: 2, status: "watch", supplier: "Furnizor EU", eta: "2026-06-25" },
  { id: "mat-004", projectId: "prj-prosumer", product: "Invertor hibrid 6kW", requiredQty: 10, reservedQty: 3, inStockQty: 3, orderedQty: 8, status: "blocked", supplier: "Distribuitor hybrid", eta: "2026-07-02" }
];

export const offers: OfferPipelineItem[] = [
  { id: "off-001", client: "Beneficiar rezidențial Cluj", title: "PV 10kWp + baterie", stage: "draft", valueEuro: 18500, probability: 64, owner: "Sales Engineer", linkedProjectId: "prj-prosumer", nextStep: "validare preț inverter" },
  { id: "off-002", client: "UTA Buzău", title: "Extindere sistem monitorizare", stage: "review", valueEuro: 42000, probability: 72, owner: "Manager Proiect PV", linkedProjectId: "prj-uta-buzau", nextStep: "aprobare management" },
  { id: "off-003", client: "Client industrial", title: "BESS + PV rooftop", stage: "analysis", valueEuro: 228000, probability: 41, owner: "Sales Engineer", nextStep: "simulare producție și load profile" }
];

export const fieldOps: FieldOpsTicket[] = [
  { id: "fld-001", projectId: "prj-raja", technician: "Catalin Bustan", site: "RAJA Constanța", checklist: ["verificare tablouri", "poze site", "măsurători", "raport"], status: "active", startedAt: "2026-06-06T07:30:00Z", gpsRequired: true, photosRequired: true },
  { id: "fld-002", projectId: "prj-uta-buzau", technician: "Echipa teren 1", site: "Buzău", checklist: ["trasare", "materiale", "protecții", "predare"], status: "queued", startedAt: "2026-06-10T08:00:00Z", gpsRequired: true, photosRequired: true }
];

export const audit: AuditEvent[] = [
  { id: "aud-001", actor: "Warehouse Owner", action: "stock.reserve.preview", domain: "stock", entityId: "mat-001", severity: "high", beforeHash: "stock-320", afterHash: "stock-420", createdAt: "2026-06-06T10:00:00Z", rollbackAvailable: true },
  { id: "aud-002", actor: "Platform Owner", action: "task.create.shadow", domain: "tasks", entityId: "tsk-006", severity: "medium", beforeHash: "none", afterHash: "task-created", createdAt: "2026-06-06T11:35:00Z", rollbackAvailable: true },
  { id: "aud-003", actor: "HR Ops", action: "pontaj.workload.approve", domain: "pontaj", entityId: "wrk-001", severity: "medium", beforeHash: "capacity-40", afterHash: "capacity-adjusted", createdAt: "2026-06-05T16:00:00Z", rollbackAvailable: true }
];

export const rbac: RbacRule[] = [
  { role: "Admin", domain: "admin", canRead: true, canCreate: true, canUpdate: true, canApprove: true, canDelete: true, notes: "full platform controls with audit" },
  { role: "Manager", domain: "projects", canRead: true, canCreate: true, canUpdate: true, canApprove: true, canDelete: false, notes: "project and approval owner" },
  { role: "Inginer", domain: "tasks", canRead: true, canCreate: true, canUpdate: true, canApprove: false, canDelete: false, notes: "task execution and documentation" },
  { role: "Tehnician", domain: "fieldOps", canRead: true, canCreate: false, canUpdate: true, canApprove: false, canDelete: false, notes: "field status, checklist, photos" },
  { role: "Warehouse", domain: "stock", canRead: true, canCreate: true, canUpdate: true, canApprove: false, canDelete: false, notes: "reservations require manager approval" },
  { role: "HR", domain: "pontaj", canRead: true, canCreate: true, canUpdate: true, canApprove: true, canDelete: false, notes: "workload and timesheet reconciliation" },
  { role: "Viewer", domain: "audit", canRead: true, canCreate: false, canUpdate: false, canApprove: false, canDelete: false, notes: "read-only audit and dashboards" }
];

export const automations: AutomationLane[] = [
  { id: "auto-001", title: "Daily operations digest", trigger: "08:00 Europe/Bucharest", domains: ["tasks", "projects", "stock", "pontaj"], status: "ready", nextRun: "tomorrow 08:00", output: "manager summary with blockers" },
  { id: "auto-002", title: "Stock shortage creates task blocker", trigger: "materialPlan.status=blocked", domains: ["stock", "tasks", "projects"], status: "active", nextRun: "event-driven", output: "task blocker + approval request" },
  { id: "auto-003", title: "Pontaj overload to workload alert", trigger: "assignedHours > capacityHours", domains: ["pontaj", "tasks"], status: "watch", nextRun: "hourly", output: "workload redistribution suggestion" },
  { id: "auto-004", title: "Offer won creates project draft", trigger: "offer.stage=won", domains: ["offers", "projects", "stock"], status: "queued", nextRun: "event-driven", output: "project draft + material plan" }
];

export const commands: AdminCommand[] = [
  { id: "cmd-001", label: "Freeze project writes", command: "workos.freeze.projects", safety: "guarded", requiresApproval: true, effect: "projects become read-only" },
  { id: "cmd-002", label: "Enable shadow submit for forms", command: "workos.forms.shadow.enable", safety: "safe", requiresApproval: false, effect: "forms create audit preview only" },
  { id: "cmd-003", label: "Isolate stock adapter", command: "workos.adapter.stock.isolate", safety: "guarded", requiresApproval: true, effect: "stock sync disabled, cached read model active" },
  { id: "cmd-004", label: "Kill all production writes", command: "workos.kill.writes", safety: "danger", requiresApproval: true, effect: "all mutation classes blocked" }
];

export const incidents: IncidentSignal[] = [
  { id: "inc-001", title: "Stock reservation mismatch", domain: "stock", severity: "high", status: "watch", detection: "reservedQty > inStockQty threshold", runbook: "isolate stock adapter, create correction task" },
  { id: "inc-002", title: "Pontaj workload over-capacity", domain: "pontaj", severity: "medium", status: "active", detection: "assignedHours exceeds capacity", runbook: "notify operations lead, redistribute tasks" },
  { id: "inc-003", title: "Audit event missing after workflow", domain: "audit", severity: "critical", status: "ready", detection: "submit without audit envelope", runbook: "block write mode and require replay" }
];

export const navigation: WorkOsExecutionCore["navigation"] = [
  { label: "Execution Home", href: "/work-os/execution", group: "Work OS" },
  { label: "Kanban", href: "/work-os/kanban", group: "Tasks" },
  { label: "Calendar", href: "/work-os/calendar", group: "Planning" },
  { label: "Gantt", href: "/work-os/gantt", group: "Planning" },
  { label: "Workload", href: "/work-os/workload-dashboard", group: "Pontaj" },
  { label: "Approvals", href: "/work-os/approvals", group: "Governance" },
  { label: "Drafts", href: "/work-os/drafts", group: "Forms" },
  { label: "Materials", href: "/work-os/materials-planning", group: "Stock" },
  { label: "Offer Pipeline", href: "/work-os/offer-pipeline", group: "Sales" },
  { label: "Field Ops", href: "/work-os/field-ops", group: "IoT/Ops" },
  { label: "Command Center", href: "/admin/work-os-execution-command-center", group: "Admin" }
];

export const capabilities: string[] = [
  "real Work OS navigation shell",
  "cross-module execution dashboard",
  "project linked task board",
  "kanban status columns",
  "calendar events",
  "gantt phases",
  "workload from pontaj context",
  "approval queue",
  "persistent draft model",
  "material reservation planning",
  "offer pipeline",
  "field operations tickets",
  "audit event stream",
  "RBAC matrix",
  "automation lanes",
  "admin incident commands"
];

function getWriteMode() {
  return process.env.SERVELECT_WORK_OS_WRITE_MODE || "shadow-safe";
}

export function getWorkOsExecutionCore(): WorkOsExecutionCore {
  return {
    ok: true,
    version,
    name,
    generatedAt: new Date().toISOString(),
    writeMode: getWriteMode(),
    summary: "Full interactive Work OS execution layer: projects, tasks, kanban, calendar, gantt, workload, materials, offers, field ops, audit, RBAC and admin command center.",
    readiness,
    metrics,
    navigation,
    projects,
    tasks,
    kanban,
    calendar,
    gantt,
    workload,
    approvals,
    drafts,
    materialPlan,
    offers,
    fieldOps,
    audit,
    rbac,
    automations,
    commands,
    incidents,
    capabilities
  };
}

export function getWorkOsDashboard() {
  const core = getWorkOsExecutionCore();
  return {
    ok: true,
    version,
    generatedAt: core.generatedAt,
    writeMode: core.writeMode,
    metrics,
    summaryCards: [
      { label: "Active projects", value: projects.filter((project) => project.status === "active").length, detail: "projects in active execution" },
      { label: "Open tasks", value: tasks.filter((task) => task.status !== "Finalizat" && task.status !== "Anulat").length, detail: "tasks not completed" },
      { label: "Blocked materials", value: materialPlan.filter((material) => material.status === "blocked" || material.status === "watch").length, detail: "material lines needing attention" },
      { label: "Pending approvals", value: approvals.filter((approval) => approval.status === "pending" || approval.status === "needs-info").length, detail: "approval items open" }
    ],
    projects,
    incidents,
    automations
  };
}

export function getKanbanBoard() { return { ok: true, version, generatedAt: new Date().toISOString(), columns: kanban }; }
export function getCalendarView() { return { ok: true, version, generatedAt: new Date().toISOString(), events: calendar }; }
export function getGanttView() { return { ok: true, version, generatedAt: new Date().toISOString(), phases: gantt, projects }; }
export function getWorkloadView() { return { ok: true, version, generatedAt: new Date().toISOString(), workload, overloads: workload.filter((row) => row.assignedHours > row.capacityHours) }; }
export function getApprovalsView() { return { ok: true, version, generatedAt: new Date().toISOString(), approvals }; }
export function getDraftsView() { return { ok: true, version, generatedAt: new Date().toISOString(), drafts }; }
export function getMaterialPlanView() { return { ok: true, version, generatedAt: new Date().toISOString(), materialPlan, blocked: materialPlan.filter((line) => line.status === "blocked") }; }
export function getOfferPipelineView() { return { ok: true, version, generatedAt: new Date().toISOString(), offers, weightedPipelineEuro: offers.reduce((sum, offer) => sum + Math.round((offer.valueEuro * offer.probability) / 100), 0) }; }
export function getFieldOpsView() { return { ok: true, version, generatedAt: new Date().toISOString(), fieldOps }; }
export function getAuditView() { return { ok: true, version, generatedAt: new Date().toISOString(), audit }; }
export function getRbacView() { return { ok: true, version, generatedAt: new Date().toISOString(), rbac }; }
export function getAutomationView() { return { ok: true, version, generatedAt: new Date().toISOString(), automations }; }
export function getCommandCenterView() { return { ok: true, version, generatedAt: new Date().toISOString(), commands, incidents, writeMode: getWriteMode() }; }
export function getExecutionHealth() { return { ok: true, version, generatedAt: new Date().toISOString(), readiness, writeMode: getWriteMode(), blockers: incidents.filter((incident) => incident.severity === "critical" && incident.status === "blocked") }; }
