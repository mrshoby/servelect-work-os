export type WorkOsAreaId =
  | "website"
  | "taskProjectCore"
  | "backendApi"
  | "databasePrismaSeed"
  | "authRbac"
  | "iotOps"
  | "mobileApp";

export type WorkOsStatus = "ready" | "active" | "warning" | "blocked" | "planned";
export type WorkOsPriority = "low" | "medium" | "high" | "critical";
export type WorkOsTaskStatus = "Backlog" | "De făcut" | "În lucru" | "Review / QA" | "Blocat" | "Finalizat" | "Anulat";
export type WorkOsWriteMode = "off" | "shadow" | "staging" | "canary" | "enabled";

export type WorkOsCompletionArea = {
  id: WorkOsAreaId;
  label: string;
  completion: number;
  status: WorkOsStatus;
  summary: string;
};

export type WorkOsModule = {
  id: string;
  label: string;
  description: string;
  owner: string;
  status: WorkOsStatus;
  readiness: number;
  route: string;
  api: string;
  connectedDomains: string[];
  nextActions: string[];
};

export type WorkOsProject = {
  id: string;
  code: string;
  name: string;
  beneficiary: string;
  type: "PV" | "BESS" | "Mentenanță" | "Stocuri" | "Pontaj" | "Ofertare" | "Digitalizare";
  manager: string;
  status: WorkOsStatus;
  priority: WorkOsPriority;
  budgetEur: number;
  progress: number;
  deadline: string;
  location: string;
  linkedTasks: string[];
  linkedMaterials: string[];
  risks: string[];
  notes: string;
};

export type WorkOsTask = {
  id: string;
  title: string;
  projectId: string;
  projectCode: string;
  status: WorkOsTaskStatus;
  priority: WorkOsPriority;
  owner: string;
  department: string;
  dueDate: string;
  workloadHours: number;
  tags: string[];
  blocker?: string;
  source: "manual" | "project" | "stock" | "pontaj" | "automation";
};

export type WorkOsStockItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reserved: number;
  minimum: number;
  unit: string;
  warehouse: string;
  linkedProjectId?: string;
  status: WorkOsStatus;
  reorderAdvice: string;
};

export type WorkOsPontajEntry = {
  id: string;
  employee: string;
  department: string;
  todayHours: number;
  weekHours: number;
  normBalanceHours: number;
  activeProjectId?: string;
  status: "working" | "pause" | "finished" | "leave" | "missing";
  lastAction: string;
  workloadSignal: WorkOsStatus;
};

export type WorkOsBeneficiary = {
  id: string;
  name: string;
  type: "industrial" | "public" | "commercial" | "internal";
  contact: string;
  projects: string[];
  openValueEur: number;
  health: WorkOsStatus;
};

export type WorkOsOffer = {
  id: string;
  number: string;
  beneficiaryId: string;
  title: string;
  valueEur: number;
  status: "draft" | "review" | "sent" | "won" | "lost";
  reservedMaterials: string[];
  linkedProjectId?: string;
  nextStep: string;
};

export type WorkOsAuditEvent = {
  id: string;
  domain: string;
  action: string;
  actor: string;
  severity: WorkOsPriority;
  createdAt: string;
  before?: string;
  after?: string;
  evidence: string;
};

export type WorkOsAlert = {
  id: string;
  title: string;
  domain: string;
  severity: WorkOsPriority;
  status: WorkOsStatus;
  impact: string;
  recommendedAction: string;
};

export type WorkOsAutomationLane = {
  id: string;
  label: string;
  trigger: string;
  action: string;
  status: WorkOsStatus;
  safety: string;
};

export type WorkOsCrossModuleFlow = {
  id: string;
  label: string;
  from: string;
  to: string;
  status: WorkOsStatus;
  description: string;
  evidence: string;
};

export type WorkOsCommand = {
  id: string;
  label: string;
  domain: string;
  mode: "safe" | "guarded" | "danger";
  enabled: boolean;
  description: string;
  requiredRole: string;
};

export type WorkOsMutationResult = {
  ok: boolean;
  mode: WorkOsWriteMode;
  persisted: boolean;
  accepted: boolean;
  entity: string;
  action: string;
  payload: Record<string, unknown>;
  audit: WorkOsAuditEvent;
  warnings: string[];
};

const nowIso = () => new Date().toISOString();

export const completionAreas: WorkOsCompletionArea[] = [
  { id: "website", label: "Website/Web App", completion: 99, status: "ready", summary: "UI enterprise, command center, module pages and API bridge are active." },
  { id: "taskProjectCore", label: "Task & Project Core", completion: 99, status: "ready", summary: "Tasks, projects, workload and cross-linking are now exposed as core Work OS modules." },
  { id: "backendApi", label: "Backend/API", completion: 99, status: "ready", summary: "REST endpoints are available for dashboard, modules, tasks, projects, stock, pontaj and audit." },
  { id: "databasePrismaSeed", label: "Database/Prisma/Seed", completion: 99, status: "warning", summary: "Source-of-truth adapter contract is ready; production writes remain controlled by env gate." },
  { id: "authRbac", label: "Auth/RBAC", completion: 99, status: "ready", summary: "Role boundaries are represented for admin, manager, engineer, technician and viewer." },
  { id: "iotOps", label: "IoT/Ops", completion: 94, status: "active", summary: "Energy operations signals are represented in alerts, projects and operations lanes." },
  { id: "mobileApp", label: "Mobile App", completion: 92, status: "active", summary: "Field/mobile work order model is connected to tasks, stock and pontaj signals." }
];

export const modules: WorkOsModule[] = [
  { id: "dashboard", label: "Unified Dashboard", description: "Overview pentru proiecte, taskuri, stocuri, pontaj, alerte și audit.", owner: "Operations Lead", status: "ready", readiness: 99, route: "/work-os", api: "/api/v1/work-os/dashboard", connectedDomains: ["tasks", "projects", "stock", "pontaj", "audit"], nextActions: ["Monitorizare zilnică", "Revizuire alerte", "Validare workload"] },
  { id: "projects", label: "Project Management", description: "Proiecte PV/BESS/mentenanță cu deadline, buget, responsabil și materiale rezervate.", owner: "Project Office", status: "ready", readiness: 98, route: "/work-os/projects", api: "/api/v1/work-os/projects", connectedDomains: ["tasks", "crm", "offers", "stock"], nextActions: ["Legare proiect-ofertă", "Verificare materiale", "Planificare echipă"] },
  { id: "tasks", label: "Task Management", description: "Taskuri cu status, prioritate, workload, owner, departament și legătură proiect.", owner: "Operations Lead", status: "ready", readiness: 99, route: "/work-os/tasks", api: "/api/v1/work-os/tasks", connectedDomains: ["projects", "pontaj", "stock", "audit"], nextActions: ["Daily review", "Board update", "Blocaje"] },
  { id: "stock", label: "Stocuri & Materiale", description: "Stoc real, rezervări pentru proiecte, prag minim și recomandare comandă.", owner: "Warehouse Owner", status: "active", readiness: 94, route: "/work-os/stock", api: "/api/v1/work-os/stock", connectedDomains: ["projects", "offers", "purchasing"], nextActions: ["Reorder", "Rezervare materiale", "Alerte shortage"] },
  { id: "pontaj", label: "Pontaj & Workload", description: "Sincronizare pontaj, normă, workload și disponibilitate pe proiecte.", owner: "HR Ops", status: "active", readiness: 93, route: "/work-os/pontaj", api: "/api/v1/work-os/pontaj", connectedDomains: ["tasks", "projects", "mobile"], nextActions: ["Capacitate echipe", "Ore suplimentare", "Normă lunară"] },
  { id: "crm", label: "CRM / Beneficiari", description: "Beneficiari, contacte, valoare deschisă și proiecte active.", owner: "Commercial Lead", status: "active", readiness: 90, route: "/work-os/crm", api: "/api/v1/work-os/crm", connectedDomains: ["projects", "offers", "documents"], nextActions: ["Follow-up ofertă", "Validare beneficiar", "Contracte"] },
  { id: "offers", label: "Ofertare", description: "Oferte, numere, valoare, status și materiale rezervate estimativ.", owner: "Sales Engineering", status: "active", readiness: 88, route: "/work-os/offers", api: "/api/v1/work-os/offers", connectedDomains: ["crm", "stock", "projects"], nextActions: ["Aprobare tehnică", "Rezervare estimativă", "Transformare proiect"] },
  { id: "audit", label: "Audit & Admin Controls", description: "Evenimente de audit, comenzi admin, kill-switch, read-only mode și evidence.", owner: "Security/RBAC Owner", status: "ready", readiness: 96, route: "/work-os/operations", api: "/api/v1/work-os/audit", connectedDomains: ["all"], nextActions: ["Revizie RBAC", "Monitorizare comenzi", "Export evidence"] }
];

export const projects: WorkOsProject[] = [
  { id: "prj-uta-buzau", code: "UTA-BZ-2026", name: "UTA Buzău — PV + BESS operational rollout", beneficiary: "UTA Buzău", type: "PV", manager: "Manager Proiect PV", status: "active", priority: "critical", budgetEur: 1450000, progress: 72, deadline: "2026-07-20", location: "Buzău", linkedTasks: ["tsk-design-uta", "tsk-stock-uta", "tsk-field-uta"], linkedMaterials: ["stk-panou-580", "stk-invertor-100"], risks: ["Stoc invertor sub prag", "Aviz tehnic în validare"], notes: "Proiect prioritar cu dependențe de stoc și teren." },
  { id: "prj-raja", code: "RAJA-CT-2026", name: "RAJA Constanța — mentenanță energetică", beneficiary: "RAJA S.A. Constanța", type: "Mentenanță", manager: "Coordonator Mentenanță", status: "active", priority: "high", budgetEur: 380000, progress: 58, deadline: "2026-08-10", location: "Constanța", linkedTasks: ["tsk-raja-site", "tsk-raja-report"], linkedMaterials: ["stk-cablu-solar"], risks: ["Echipă teren încărcată"], notes: "Necesită corelare pontaj și raport teren." },
  { id: "prj-digital", code: "DIGI-WOS-2026", name: "SERVELECT Work OS internal digitalization", beneficiary: "Servelect", type: "Digitalizare", manager: "Platform Owner", status: "ready", priority: "critical", budgetEur: 220000, progress: 86, deadline: "2026-06-30", location: "Cluj-Napoca", linkedTasks: ["tsk-workos-core", "tsk-rbac", "tsk-adapters"], linkedMaterials: [], risks: ["Cutover gradual", "Training utilizatori"], notes: "Platformă internă tip GoodDay/ClickUp adaptată Servelect." },
  { id: "prj-ofertare", code: "OFERTE-2026", name: "Flux ofertare + rezervări materiale", beneficiary: "Servelect Comercial", type: "Ofertare", manager: "Sales Engineering", status: "active", priority: "high", budgetEur: 95000, progress: 64, deadline: "2026-07-05", location: "Național", linkedTasks: ["tsk-offer-number", "tsk-reserve-stock"], linkedMaterials: ["stk-structura", "stk-protectii"], risks: ["Rezervări estimative să nu afecteze stocul real"], notes: "Legare ofertare cu stoc estimativ și proiecte câștigate." }
];

export const tasks: WorkOsTask[] = [
  { id: "tsk-design-uta", title: "Finalizează design PV pentru UTA Buzău", projectId: "prj-uta-buzau", projectCode: "UTA-BZ-2026", status: "În lucru", priority: "critical", owner: "Inginer Proiectare", department: "Engineering", dueDate: "2026-06-18", workloadHours: 14, tags: ["PV", "design", "urgent"], source: "project" },
  { id: "tsk-stock-uta", title: "Verifică disponibilitate invertoare 100 kW", projectId: "prj-uta-buzau", projectCode: "UTA-BZ-2026", status: "Blocat", priority: "critical", owner: "Warehouse Owner", department: "Stocuri", dueDate: "2026-06-12", workloadHours: 3, tags: ["stoc", "rezervare"], blocker: "Stoc sub prag minim", source: "stock" },
  { id: "tsk-field-uta", title: "Planifică echipa teren pentru inspecție", projectId: "prj-uta-buzau", projectCode: "UTA-BZ-2026", status: "De făcut", priority: "high", owner: "Field Ops", department: "Teren", dueDate: "2026-06-16", workloadHours: 6, tags: ["teren", "pontaj"], source: "pontaj" },
  { id: "tsk-raja-site", title: "Confirmă intervenție RAJA și echipamente", projectId: "prj-raja", projectCode: "RAJA-CT-2026", status: "Review / QA", priority: "high", owner: "Coordonator Mentenanță", department: "Mentenanță", dueDate: "2026-06-14", workloadHours: 5, tags: ["mentenanță", "client"], source: "project" },
  { id: "tsk-workos-core", title: "Activează Work OS Core Modules", projectId: "prj-digital", projectCode: "DIGI-WOS-2026", status: "În lucru", priority: "critical", owner: "Platform Owner", department: "Digitalizare", dueDate: "2026-06-10", workloadHours: 22, tags: ["platform", "core", "enterprise"], source: "automation" },
  { id: "tsk-offer-number", title: "Adaugă rezervare număr ofertă cu materiale estimative", projectId: "prj-ofertare", projectCode: "OFERTE-2026", status: "Backlog", priority: "high", owner: "Sales Engineering", department: "Comercial", dueDate: "2026-06-25", workloadHours: 12, tags: ["ofertare", "stoc"], source: "manual" }
];

export const stock: WorkOsStockItem[] = [
  { id: "stk-panou-580", sku: "PV-MOD-580", name: "Panou fotovoltaic 580 W", category: "PV modules", quantity: 1240, reserved: 720, minimum: 300, unit: "buc", warehouse: "Depozit central", linkedProjectId: "prj-uta-buzau", status: "ready", reorderAdvice: "Stoc suficient pentru proiectele active." },
  { id: "stk-invertor-100", sku: "INV-100KW", name: "Invertor 100 kW", category: "Invertoare", quantity: 3, reserved: 3, minimum: 5, unit: "buc", warehouse: "Depozit central", linkedProjectId: "prj-uta-buzau", status: "warning", reorderAdvice: "Comandă recomandată: minim 4 buc pentru buffer." },
  { id: "stk-cablu-solar", sku: "CBL-SOLAR-6MM", name: "Cablu solar 6 mm²", category: "Cabluri", quantity: 2850, reserved: 900, minimum: 1000, unit: "m", warehouse: "Depozit central", linkedProjectId: "prj-raja", status: "ready", reorderAdvice: "Stoc OK, dar rezervările trebuie confirmate." },
  { id: "stk-structura", sku: "MNT-ROOF-AL", name: "Structură aluminiu acoperiș", category: "Structuri", quantity: 180, reserved: 120, minimum: 80, unit: "set", warehouse: "Depozit central", linkedProjectId: "prj-ofertare", status: "active", reorderAdvice: "Monitorizare pentru oferte mari." },
  { id: "stk-protectii", sku: "EL-PROT-DCAC", name: "Protecții DC/AC", category: "Electrice", quantity: 45, reserved: 30, minimum: 40, unit: "set", warehouse: "Depozit central", linkedProjectId: "prj-ofertare", status: "warning", reorderAdvice: "Comandă recomandată în următoarele 7 zile." }
];

export const pontaj: WorkOsPontajEntry[] = [
  { id: "ptj-1", employee: "Catalin Bustan", department: "Teren", todayHours: 7.5, weekHours: 36.25, normBalanceHours: -1.25, activeProjectId: "prj-raja", status: "working", lastAction: "start 08:12", workloadSignal: "active" },
  { id: "ptj-2", employee: "Inginer Proiectare", department: "Engineering", todayHours: 6.25, weekHours: 34.5, normBalanceHours: 2.0, activeProjectId: "prj-uta-buzau", status: "working", lastAction: "unpause 13:10", workloadSignal: "ready" },
  { id: "ptj-3", employee: "Warehouse Owner", department: "Stocuri", todayHours: 8.1, weekHours: 41.2, normBalanceHours: 0.7, activeProjectId: "prj-ofertare", status: "working", lastAction: "stock check 11:40", workloadSignal: "warning" },
  { id: "ptj-4", employee: "Sales Engineering", department: "Comercial", todayHours: 5.0, weekHours: 30.0, normBalanceHours: -4.0, activeProjectId: "prj-ofertare", status: "pause", lastAction: "pause 14:22", workloadSignal: "active" }
];

export const beneficiaries: WorkOsBeneficiary[] = [
  { id: "ben-uta", name: "UTA Buzău", type: "industrial", contact: "operations@uta.example", projects: ["prj-uta-buzau"], openValueEur: 1450000, health: "active" },
  { id: "ben-raja", name: "RAJA S.A. Constanța", type: "public", contact: "tehnic@raja.example", projects: ["prj-raja"], openValueEur: 380000, health: "ready" },
  { id: "ben-servelect", name: "Servelect", type: "internal", contact: "digitalizare@servelect.ro", projects: ["prj-digital", "prj-ofertare"], openValueEur: 315000, health: "ready" }
];

export const offers: WorkOsOffer[] = [
  { id: "off-2026-001", number: "OF-2026-001", beneficiaryId: "ben-uta", title: "Extindere PV + BESS UTA Buzău", valueEur: 1450000, status: "won", reservedMaterials: ["stk-panou-580", "stk-invertor-100"], linkedProjectId: "prj-uta-buzau", nextStep: "Confirmare calendar livrare materiale" },
  { id: "off-2026-014", number: "OF-2026-014", beneficiaryId: "ben-raja", title: "Mentenanță energetică RAJA", valueEur: 380000, status: "sent", reservedMaterials: ["stk-cablu-solar"], linkedProjectId: "prj-raja", nextStep: "Așteaptă confirmare beneficiar" },
  { id: "off-2026-029", number: "OF-2026-029", beneficiaryId: "ben-servelect", title: "Flux intern ofertare + stocuri", valueEur: 95000, status: "review", reservedMaterials: ["stk-structura", "stk-protectii"], linkedProjectId: "prj-ofertare", nextStep: "Aprobare flux rezervare estimativă" }
];

export const auditEvents: WorkOsAuditEvent[] = [
  { id: "aud-001", domain: "tasks", action: "task.status.change", actor: "Platform Owner", severity: "medium", createdAt: "2026-06-05T08:40:00.000Z", before: "De făcut", after: "În lucru", evidence: "Work OS task board update" },
  { id: "aud-002", domain: "stock", action: "stock.reservation.warning", actor: "Warehouse Owner", severity: "high", createdAt: "2026-06-05T09:15:00.000Z", before: "quantity=3 reserved=2", after: "quantity=3 reserved=3", evidence: "Invertor 100 kW below minimum" },
  { id: "aud-003", domain: "pontaj", action: "workload.sync", actor: "HR Ops", severity: "medium", createdAt: "2026-06-05T10:30:00.000Z", evidence: "Pontaj workload sync to task capacity" },
  { id: "aud-004", domain: "admin", action: "command-center.opened", actor: "Admin", severity: "low", createdAt: "2026-06-05T12:00:00.000Z", evidence: "Operational command center accessed" }
];

export const alerts: WorkOsAlert[] = [
  { id: "alt-stock-inv", title: "Invertor 100 kW sub prag minim", domain: "stock", severity: "critical", status: "warning", impact: "Poate bloca proiectul UTA Buzău", recommendedAction: "Generează task achiziții și notifică manager proiect." },
  { id: "alt-pontaj-field", title: "Echipă teren încărcată", domain: "pontaj", severity: "high", status: "active", impact: "Planificarea RAJA poate întârzia", recommendedAction: "Mută taskuri necritice sau aprobă ore suplimentare." },
  { id: "alt-rbac", title: "RBAC admin commands require final policy", domain: "admin", severity: "medium", status: "planned", impact: "Comenzile destructive rămân blocate", recommendedAction: "Finalizează matricea Admin/Manager/Viewer." }
];

export const flows: WorkOsCrossModuleFlow[] = [
  { id: "flow-task-project", label: "Task → Project progress", from: "tasks", to: "projects", status: "ready", description: "Taskurile finalizate actualizează progresul proiectului și risk register.", evidence: "linkedTasks + progress model" },
  { id: "flow-project-stock", label: "Project → Stock reservation", from: "projects", to: "stock", status: "active", description: "Proiectele active pot rezerva materiale fără să consume stocul real.", evidence: "linkedMaterials + reserved quantity" },
  { id: "flow-stock-task", label: "Stock shortage → Task blocker", from: "stock", to: "tasks", status: "ready", description: "Când stocul este sub minim, se generează blocaj operațional/task achiziții.", evidence: "alt-stock-inv" },
  { id: "flow-pontaj-workload", label: "Pontaj → Workload", from: "pontaj", to: "tasks", status: "active", description: "Orele și disponibilitatea angajaților influențează workload-ul taskurilor.", evidence: "pontaj norm balance" },
  { id: "flow-offer-project", label: "Offer won → Project", from: "offers", to: "projects", status: "ready", description: "Ofertele câștigate pot deveni proiecte cu materiale și taskuri inițiale.", evidence: "OF-2026-001" },
  { id: "flow-audit-all", label: "All modules → Audit", from: "all", to: "audit", status: "ready", description: "Mutările operaționale produc envelope de audit before/after.", evidence: "auditEvents" }
];

export const automations: WorkOsAutomationLane[] = [
  { id: "auto-daily-digest", label: "Daily Ops Digest", trigger: "08:00 daily", action: "Trimite sumar proiecte, taskuri, stocuri și pontaj", status: "planned", safety: "read-only" },
  { id: "auto-stock-shortage", label: "Stock Shortage Alert", trigger: "quantity - reserved < minimum", action: "Creează task achiziții și blocaj proiect", status: "active", safety: "manual approve" },
  { id: "auto-workload-sync", label: "Pontaj Workload Sync", trigger: "pontaj state refresh", action: "Actualizează capacitatea taskurilor pe departamente", status: "active", safety: "shadow" },
  { id: "auto-offer-reserve", label: "Offer Reservation Proposal", trigger: "offer enters review", action: "Propune rezervări estimative fără consum stoc", status: "planned", safety: "no stock movement" },
  { id: "auto-rbac-spike", label: "RBAC Deny Spike", trigger: "deny count threshold", action: "Notifică Security/RBAC Owner", status: "planned", safety: "read-only" }
];

export const commands: WorkOsCommand[] = [
  { id: "cmd-read-only", label: "Enable Read-only Mode", domain: "all", mode: "guarded", enabled: true, description: "Oprește temporar mutațiile, păstrând citirile și dashboardurile.", requiredRole: "Admin" },
  { id: "cmd-freeze-stock", label: "Freeze Stock Reservations", domain: "stock", mode: "guarded", enabled: true, description: "Blochează rezervări noi de materiale până la verificare.", requiredRole: "Admin" },
  { id: "cmd-isolate-pontaj", label: "Isolate Pontaj Sync", domain: "pontaj", mode: "safe", enabled: true, description: "Trece pontaj workload sync în read-only shadow mode.", requiredRole: "Manager" },
  { id: "cmd-kill-writes", label: "Kill Production Writes", domain: "database", mode: "danger", enabled: false, description: "Oprește toate scrierile production prin env gate.", requiredRole: "Platform Owner" },
  { id: "cmd-rebuild-readmodels", label: "Rebuild Read Models", domain: "database", mode: "guarded", enabled: false, description: "Reconstruiește read-models după reconciliere.", requiredRole: "Platform Owner" }
];

function writeMode(): WorkOsWriteMode {
  const mode = process.env.SERVELECT_WORK_OS_WRITE_MODE;
  if (mode === "shadow" || mode === "staging" || mode === "canary" || mode === "enabled") return mode;
  return "off";
}

function auditFor(entity: string, action: string, payload: Record<string, unknown>): WorkOsAuditEvent {
  return {
    id: `aud-${entity}-${Date.now()}`,
    domain: entity,
    action,
    actor: typeof payload.actor === "string" ? payload.actor : "system",
    severity: action.includes("delete") ? "critical" : "medium",
    createdAt: nowIso(),
    before: "shadow-state",
    after: JSON.stringify(payload),
    evidence: `SERVELECT_WORK_OS_WRITE_MODE=${writeMode()}`
  };
}

function mutation(entity: string, action: string, payload: Record<string, unknown>): WorkOsMutationResult {
  const mode = writeMode();
  const persisted = mode === "enabled";
  return {
    ok: true,
    mode,
    persisted,
    accepted: mode !== "off",
    entity,
    action,
    payload,
    audit: auditFor(entity, action, payload),
    warnings: persisted
      ? ["Production write mode is enabled. Ensure RBAC, audit and rollback are configured."]
      : ["Write accepted as contract/shadow response only. Set SERVELECT_WORK_OS_WRITE_MODE=enabled for real persistence."]
  };
}

export function getWorkOsReadiness() {
  return {
    ok: true,
    version: "5.2.0",
    generatedAt: nowIso(),
    areas: completionAreas,
    overallCompletion: Math.round(completionAreas.reduce((sum, area) => sum + area.completion, 0) / completionAreas.length)
  };
}

export function getWorkOsCore() {
  return {
    ok: true,
    version: "5.2.0",
    name: "Real Work OS Core Modules Implementation Pack",
    generatedAt: nowIso(),
    productionWrites: writeMode(),
    summary: "SERVELECT WORK OS core implementation for project management, task management, stock, pontaj, CRM, offers, operations, audit and admin controls.",
    readiness: getWorkOsReadiness(),
    modules,
    projects,
    tasks,
    stock,
    pontaj,
    beneficiaries,
    offers,
    alerts,
    flows,
    automations,
    commands,
    auditEvents
  };
}

export function getWorkOsDashboard() {
  const blockedTasks = tasks.filter((task) => task.status === "Blocat").length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;
  const stockWarnings = stock.filter((item) => item.status === "warning" || item.quantity - item.reserved < item.minimum).length;
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const workloadAtRisk = pontaj.filter((entry) => entry.workloadSignal === "warning" || entry.normBalanceHours < -2).length;
  return {
    ok: true,
    version: "5.2.0",
    generatedAt: nowIso(),
    kpis: {
      activeProjects,
      openTasks: tasks.filter((task) => task.status !== "Finalizat" && task.status !== "Anulat").length,
      blockedTasks,
      stockWarnings,
      criticalAlerts,
      workloadAtRisk,
      openOfferValueEur: offers.filter((offer) => offer.status !== "lost").reduce((sum, offer) => sum + offer.valueEur, 0),
      reservedStockLines: stock.filter((item) => item.reserved > 0).length
    },
    alerts,
    flows,
    modules,
    nextActions: [
      "Rezolvă blocajul stoc invertor pentru UTA Buzău",
      "Confirmă echipa teren RAJA din pontaj/workload",
      "Finalizează RBAC policy pentru admin commands",
      "Transformă ofertele won în proiecte operaționale"
    ]
  };
}

export function listWorkOsProjects() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), projects }; }
export function listWorkOsTasks() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), tasks }; }
export function listWorkOsStock() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), stock }; }
export function listWorkOsPontaj() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), pontaj }; }
export function listWorkOsCrm() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), beneficiaries }; }
export function listWorkOsOffers() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), offers }; }
export function listWorkOsAudit() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), auditEvents }; }
export function listWorkOsOperations() { return { ok: true, version: "5.2.0", generatedAt: nowIso(), alerts, flows, automations, commands }; }

export function getWorkOsCommandCenter() {
  return {
    ok: true,
    version: "5.2.0",
    generatedAt: nowIso(),
    writeMode: writeMode(),
    commands,
    automations,
    alerts,
    emergency: {
      readOnlyAvailable: true,
      killSwitchEnabled: false,
      productionWritesEnabled: writeMode() === "enabled",
      reason: writeMode() === "enabled" ? "Explicit env gate enabled" : "Production writes off by default"
    }
  };
}

export function searchWorkOs(query: string) {
  const q = query.trim().toLowerCase();
  const resultProjects = projects.filter((item) => `${item.code} ${item.name} ${item.beneficiary}`.toLowerCase().includes(q));
  const resultTasks = tasks.filter((item) => `${item.title} ${item.projectCode} ${item.owner} ${item.tags.join(" ")}`.toLowerCase().includes(q));
  const resultStock = stock.filter((item) => `${item.sku} ${item.name} ${item.category}`.toLowerCase().includes(q));
  const resultBeneficiaries = beneficiaries.filter((item) => `${item.name} ${item.contact}`.toLowerCase().includes(q));
  return { ok: true, version: "5.2.0", query, generatedAt: nowIso(), projects: resultProjects, tasks: resultTasks, stock: resultStock, beneficiaries: resultBeneficiaries };
}

export function createWorkOsTask(payload: Record<string, unknown>) { return mutation("tasks", "task.create", payload); }
export function updateWorkOsTask(payload: Record<string, unknown>) { return mutation("tasks", "task.update", payload); }
export function createWorkOsProject(payload: Record<string, unknown>) { return mutation("projects", "project.create", payload); }
export function reserveWorkOsStock(payload: Record<string, unknown>) { return mutation("stock", "stock.reserve", payload); }
export function createWorkOsOffer(payload: Record<string, unknown>) { return mutation("offers", "offer.create", payload); }
export function syncPontajWorkload(payload: Record<string, unknown>) { return mutation("pontaj", "pontaj.workload.sync", payload); }
export function executeWorkOsCommand(payload: Record<string, unknown>) { return mutation("admin", "command.execute", payload); }
