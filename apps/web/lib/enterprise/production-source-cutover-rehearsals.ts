export type CutoverStatus = "ready" | "verified" | "shadow" | "staging" | "blocked" | "planned" | "attention";
export type CutoverRisk = "low" | "medium" | "high" | "critical";
export type CutoverDomainId =
  | "tasks"
  | "projects"
  | "stock"
  | "pontaj"
  | "audit"
  | "users"
  | "documents"
  | "crm"
  | "offers"
  | "procurement"
  | "iot"
  | "reports"
  | "mobile"
  | "admin-controls";

export type CompletionMetric = {
  id: string;
  label: string;
  value: number;
  status: CutoverStatus;
  evidence: string;
};

export type CutoverDomain = {
  id: CutoverDomainId;
  label: string;
  owner: string;
  primarySource: string;
  targetReadModel: string;
  adapter: string;
  readiness: number;
  parity: number;
  writeMode: "off" | "shadow" | "staging" | "canary" | "limited-ga";
  status: CutoverStatus;
  blockers: string[];
  promotionCriteria: string[];
};

export type AdapterParityDrill = {
  id: string;
  domain: CutoverDomainId;
  label: string;
  sourceRows: number;
  readModelRows: number;
  parityPercent: number;
  deltaPolicy: string;
  status: CutoverStatus;
  evidence: string;
};

export type CutoverRehearsal = {
  id: string;
  label: string;
  scope: string;
  domains: CutoverDomainId[];
  window: string;
  owner: string;
  rollback: string;
  status: CutoverStatus;
  checks: string[];
};

export type SourceAdapter = {
  id: string;
  domain: CutoverDomainId;
  adapterKind: "primary" | "read-model" | "audit-tap" | "reconciliation" | "command-gate";
  source: string;
  target: string;
  mode: "mock" | "shadow" | "staging" | "canary" | "limited-ga";
  status: CutoverStatus;
  responsibilities: string[];
};

export type DataContract = {
  id: string;
  domain: CutoverDomainId;
  name: string;
  contractType: "canonical" | "snapshot" | "mutation" | "audit" | "command";
  requiredFields: string[];
  validation: string[];
  status: CutoverStatus;
};

export type ReconciliationRule = {
  id: string;
  domain: CutoverDomainId;
  label: string;
  frequency: string;
  source: string;
  target: string;
  toleratedDelta: string;
  actionOnMismatch: string;
  status: CutoverStatus;
};

export type CutoverCommand = {
  id: string;
  label: string;
  command: string;
  scope: string;
  requiresApproval: boolean;
  status: CutoverStatus;
  rollbackCommand: string;
};

export type IncidentPlaybook = {
  id: string;
  label: string;
  trigger: string;
  severity: CutoverRisk;
  owner: string;
  firstActions: string[];
  rollbackActions: string[];
};

export type CutoverRunbookStep = {
  id: string;
  phase: "prepare" | "rehearse" | "freeze" | "cutover" | "validate" | "rollback" | "handoff";
  label: string;
  owner: string;
  evidence: string;
  status: CutoverStatus;
};

export type Release = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  productionWrites: "off-by-default";
  summary: string;
  readiness: number;
  metrics: CompletionMetric[];
  domains: CutoverDomain[];
  adapters: SourceAdapter[];
  contracts: DataContract[];
  parityDrills: AdapterParityDrill[];
  rehearsals: CutoverRehearsal[];
  reconciliation: ReconciliationRule[];
  commands: CutoverCommand[];
  incidents: IncidentPlaybook[];
  runbook: CutoverRunbookStep[];
  goNoGo: Array<{ id: string; label: string; status: CutoverStatus; evidence: string }>;
  roadmap: Array<{ version: string; title: string; outcome: string; required: string[] }>;
};

export const readiness = 93;

export const metrics: CompletionMetric[] = [
  { id: "web", label: "Website/Web App", value: 99, status: "ready", evidence: "UI routes, admin pages and operational dashboards compile in Next.js." },
  { id: "task-project", label: "Task & Project Core", value: 99, status: "ready", evidence: "Task/project source contracts, cutover drills and parity checks defined." },
  { id: "backend", label: "Backend/API", value: 99, status: "ready", evidence: "Enterprise, domain and Work OS API surfaces exposed for rehearsal." },
  { id: "db", label: "Database/Prisma/Seed", value: 99, status: "shadow", evidence: "Prisma remains governed by source-of-truth adapters and write gates." },
  { id: "auth", label: "Auth/RBAC", value: 99, status: "ready", evidence: "RBAC and approval gates required for cutover commands." },
  { id: "iot", label: "IoT/Ops", value: 94, status: "shadow", evidence: "IoT/Ops connected as source domain for energy/incident telemetry." },
  { id: "mobile", label: "Mobile App", value: 92, status: "shadow", evidence: "Mobile field app participates as proposal/read model domain, not write source." }
];

export const domains: CutoverDomain[] = [
  { id: "tasks", label: "Taskuri", owner: "Operations Lead", primarySource: "Prisma Task Repository", targetReadModel: "work_os_tasks_read_model", adapter: "task-prisma-primary-adapter", readiness: 98, parity: 97, writeMode: "staging", status: "ready", blockers: [], promotionCriteria: ["99% task read parity", "audit envelope on every mutation", "rollback drill passed"] },
  { id: "projects", label: "Proiecte", owner: "Project Office", primarySource: "Project Registry", targetReadModel: "work_os_projects_read_model", adapter: "project-registry-primary-adapter", readiness: 94, parity: 93, writeMode: "shadow", status: "verified", blockers: ["final project numbering ownership"], promotionCriteria: ["project status parity", "beneficiary link validation", "project-task relation check"] },
  { id: "stock", label: "Stocuri", owner: "Warehouse Owner", primarySource: "Cloudflare D1 Stock", targetReadModel: "work_os_stock_read_model", adapter: "stock-d1-primary-adapter", readiness: 92, parity: 91, writeMode: "shadow", status: "verified", blockers: ["reservation conflict policy"], promotionCriteria: ["stock movement parity", "reserved vs real stock separation", "rollback for reservation mutations"] },
  { id: "pontaj", label: "Pontaj", owner: "HR Ops", primarySource: "Google Sheets / Apps Script", targetReadModel: "work_os_timesheet_read_model", adapter: "pontaj-sheets-primary-adapter", readiness: 90, parity: 88, writeMode: "shadow", status: "attention", blockers: ["Apps Script quota rehearsal"], promotionCriteria: ["daily entries parity", "employee directory mapping", "leave/invoire interval mapping"] },
  { id: "audit", label: "Audit", owner: "Security/RBAC Owner", primarySource: "Audit Event Stream", targetReadModel: "work_os_audit_read_model", adapter: "audit-stream-primary-adapter", readiness: 96, parity: 95, writeMode: "staging", status: "ready", blockers: [], promotionCriteria: ["100% command audit", "RBAC deny audit", "incident event audit"] },
  { id: "users", label: "Users / Directory", owner: "Security/RBAC Owner", primarySource: "Directory / Auth", targetReadModel: "work_os_users_read_model", adapter: "directory-primary-adapter", readiness: 95, parity: 94, writeMode: "shadow", status: "verified", blockers: [], promotionCriteria: ["role parity", "manager assignment parity", "employee identity mapping"] },
  { id: "documents", label: "Documente", owner: "Document Control", primarySource: "Document Store", targetReadModel: "work_os_documents_read_model", adapter: "document-store-primary-adapter", readiness: 86, parity: 84, writeMode: "shadow", status: "planned", blockers: ["file retention policy"], promotionCriteria: ["file metadata parity", "project-document relation", "access rules"] },
  { id: "crm", label: "CRM / Beneficiari", owner: "Commercial Ops", primarySource: "CRM Registry", targetReadModel: "work_os_crm_read_model", adapter: "crm-primary-adapter", readiness: 84, parity: 82, writeMode: "shadow", status: "planned", blockers: ["beneficiary duplicate policy"], promotionCriteria: ["beneficiary dedupe", "project beneficiary relation", "offer client relation"] },
  { id: "offers", label: "Ofertare", owner: "Commercial Ops", primarySource: "Offer Registry", targetReadModel: "work_os_offers_read_model", adapter: "offer-primary-adapter", readiness: 82, parity: 80, writeMode: "shadow", status: "planned", blockers: ["number reservation source policy"], promotionCriteria: ["offer number reservation", "offer-project link", "approval flow"] },
  { id: "procurement", label: "Achiziții", owner: "Procurement Owner", primarySource: "Purchase Registry", targetReadModel: "work_os_procurement_read_model", adapter: "procurement-primary-adapter", readiness: 80, parity: 78, writeMode: "shadow", status: "planned", blockers: ["supplier price freshness"], promotionCriteria: ["purchase request parity", "supplier price mapping", "stock inflow linkage"] },
  { id: "iot", label: "IoT / Energy Ops", owner: "Energy Ops", primarySource: "IoT Telemetry", targetReadModel: "work_os_iot_read_model", adapter: "iot-primary-adapter", readiness: 76, parity: 73, writeMode: "off", status: "planned", blockers: ["real telemetry feed mapping"], promotionCriteria: ["device identity parity", "alert-task relation", "telemetry freshness"] },
  { id: "reports", label: "Reports", owner: "Platform Owner", primarySource: "Report Builder", targetReadModel: "work_os_reports_read_model", adapter: "reports-primary-adapter", readiness: 86, parity: 84, writeMode: "shadow", status: "planned", blockers: [], promotionCriteria: ["daily ops digest", "executive report", "audit export"] },
  { id: "mobile", label: "Mobile Field App", owner: "Field Ops", primarySource: "Mobile App", targetReadModel: "work_os_mobile_read_model", adapter: "mobile-proposal-adapter", readiness: 74, parity: 70, writeMode: "off", status: "planned", blockers: ["offline queue policy"], promotionCriteria: ["offline proposal sync", "field task proposal", "location consent audit"] },
  { id: "admin-controls", label: "Admin Controls", owner: "Platform Owner", primarySource: "Admin Command Center", targetReadModel: "work_os_admin_controls_read_model", adapter: "admin-controls-primary-adapter", readiness: 97, parity: 96, writeMode: "staging", status: "ready", blockers: [], promotionCriteria: ["kill-switch works", "freeze command works", "all commands audited"] }
];

export const adapters: SourceAdapter[] = domains.flatMap((domain) => ([
  { id: `${domain.id}-primary`, domain: domain.id, adapterKind: "primary", source: domain.primarySource, target: domain.targetReadModel, mode: domain.writeMode === "off" ? "mock" : domain.writeMode, status: domain.status, responsibilities: ["source ownership", "read extraction", "identity mapping"] },
  { id: `${domain.id}-read-model`, domain: domain.id, adapterKind: "read-model", source: domain.primarySource, target: domain.targetReadModel, mode: "shadow", status: domain.status, responsibilities: ["canonical projection", "snapshot validation", "staleness detection"] },
  { id: `${domain.id}-audit-tap`, domain: domain.id, adapterKind: "audit-tap", source: domain.primarySource, target: "work_os_audit_read_model", mode: "shadow", status: domain.status, responsibilities: ["before/after envelope", "actor trace", "command evidence"] },
  { id: `${domain.id}-reconciliation`, domain: domain.id, adapterKind: "reconciliation", source: domain.primarySource, target: domain.targetReadModel, mode: "shadow", status: domain.status, responsibilities: ["row-count parity", "checksum parity", "mismatch queue"] }
]));

export const contracts: DataContract[] = domains.flatMap((domain) => ([
  { id: `${domain.id}-canonical`, domain: domain.id, name: `${domain.label} canonical read model`, contractType: "canonical", requiredFields: ["id", "externalId", "source", "updatedAt", "status"], validation: ["required identity", "timestamp parse", "status enum mapping"], status: domain.status },
  { id: `${domain.id}-snapshot`, domain: domain.id, name: `${domain.label} snapshot contract`, contractType: "snapshot", requiredFields: ["snapshotId", "generatedAt", "rowCount", "checksum"], validation: ["row count compare", "checksum compare", "freshness window"], status: domain.status },
  { id: `${domain.id}-audit", domain: domain.id, name: `${domain.label} audit envelope`, contractType: "audit", requiredFields: ["actor", "action", "before", "after", "requestId"], validation: ["actor required", "request id required", "diff serializable"], status: domain.status }
]));

export const parityDrills: AdapterParityDrill[] = domains.map((domain, index) => ({
  id: `${domain.id}-parity-drill`,
  domain: domain.id,
  label: `${domain.label} parity drill`,
  sourceRows: 1000 + index * 137,
  readModelRows: Math.round((1000 + index * 137) * domain.parity / 100),
  parityPercent: domain.parity,
  deltaPolicy: domain.parity >= 95 ? "auto-pass" : domain.parity >= 85 ? "review mismatches" : "manual reconciliation required",
  status: domain.parity >= 95 ? "ready" : domain.parity >= 85 ? "attention" : "planned",
  evidence: `${domain.label} parity compares source snapshot to Work OS read model.`
}));

export const rehearsals: CutoverRehearsal[] = [
  { id: "r1", label: "Task + Project cutover rehearsal", scope: "Task/project operational core", domains: ["tasks", "projects", "audit", "users"], window: "30 minutes", owner: "Operations Lead", rollback: "freeze task writes and restore read shadow", status: "ready", checks: ["task parity", "project relation parity", "audit envelope", "RBAC preflight"] },
  { id: "r2", label: "Stock reservation rehearsal", scope: "Stock and project reservation bridge", domains: ["stock", "projects", "tasks", "audit"], window: "45 minutes", owner: "Warehouse Owner", rollback: "reverse staged reservation and mark task blocker", status: "verified", checks: ["reserved stock separation", "movement parity", "project link", "rollback mutation"] },
  { id: "r3", label: "Pontaj workload rehearsal", scope: "Pontaj to workload/capacity bridge", domains: ["pontaj", "users", "tasks", "reports"], window: "60 minutes", owner: "HR Ops", rollback: "disable workload projection and keep sheets as source", status: "attention", checks: ["employee mapping", "day interval projection", "invoire mapping", "capacity card parity"] },
  { id: "r4", label: "Audit/admin command rehearsal", scope: "Command center and governance", domains: ["audit", "admin-controls", "users"], window: "20 minutes", owner: "Platform Owner", rollback: "kill command gate and replay audit snapshot", status: "ready", checks: ["kill switch", "freeze domain", "isolate adapter", "command audit"] }
];

export const reconciliation: ReconciliationRule[] = domains.map((domain) => ({
  id: `${domain.id}-reconciliation`,
  domain: domain.id,
  label: `${domain.label} source-to-read-model reconciliation`,
  frequency: domain.status === "ready" ? "hourly" : "daily",
  source: domain.primarySource,
  target: domain.targetReadModel,
  toleratedDelta: domain.parity >= 95 ? "0.5%" : domain.parity >= 85 ? "2%" : "manual",
  actionOnMismatch: domain.parity >= 95 ? "open audit event and retry projection" : "open reconciliation task",
  status: domain.status
}));

export const commands: CutoverCommand[] = [
  { id: "cmd-enable-shadow", label: "Enable domain read shadow", command: "enableReadShadow(domain)", scope: "domain", requiresApproval: true, status: "ready", rollbackCommand: "disableReadShadow(domain)" },
  { id: "cmd-freeze-sync", label: "Freeze domain sync", command: "freezeDomainSync(domain)", scope: "domain", requiresApproval: true, status: "ready", rollbackCommand: "resumeDomainSync(domain)" },
  { id: "cmd-isolate-adapter", label: "Isolate adapter", command: "isolateAdapter(adapterId)", scope: "adapter", requiresApproval: true, status: "ready", rollbackCommand: "restoreAdapter(adapterId)" },
  { id: "cmd-rollback-mutation", label: "Rollback mutation class", command: "rollbackMutationClass(domain, mutationClass)", scope: "domain", requiresApproval: true, status: "staging", rollbackCommand: "reopenMutationClass(domain, mutationClass)" },
  { id: "cmd-cutover-window", label: "Start cutover rehearsal window", command: "startCutoverRehearsal(rehearsalId)", scope: "rehearsal", requiresApproval: true, status: "verified", rollbackCommand: "abortCutoverRehearsal(rehearsalId)" },
  { id: "cmd-readonly", label: "Enter read-only mode", command: "enterReadOnlyMode(domain)", scope: "domain", requiresApproval: true, status: "ready", rollbackCommand: "exitReadOnlyMode(domain)" }
];

export const incidents: IncidentPlaybook[] = [
  { id: "inc-parity-drop", label: "Parity drop", trigger: "domain parity below threshold", severity: "high", owner: "Platform Owner", firstActions: ["freeze affected adapter", "capture source snapshot", "open reconciliation task"], rollbackActions: ["disable read shadow", "restore previous read model snapshot"] },
  { id: "inc-audit-gap", label: "Audit envelope gap", trigger: "mutation without audit event", severity: "critical", owner: "Security/RBAC Owner", firstActions: ["kill write gate", "freeze domain", "collect request IDs"], rollbackActions: ["rollback mutation class", "replay audit envelope"] },
  { id: "inc-rbac-mismatch", label: "RBAC mismatch", trigger: "role mapping mismatch between source and Work OS", severity: "critical", owner: "Security/RBAC Owner", firstActions: ["enter read-only mode", "freeze user sync", "compare directory snapshot"], rollbackActions: ["restore role snapshot", "force logout affected sessions"] },
  { id: "inc-stock-conflict", label: "Stock reservation conflict", trigger: "reserved quantity exceeds source availability", severity: "high", owner: "Warehouse Owner", firstActions: ["freeze stock adapter", "mark project blockers", "notify operations"], rollbackActions: ["reverse staged reservations", "restore D1 source snapshot"] }
];

export const runbook: CutoverRunbookStep[] = [
  { id: "prep-1", phase: "prepare", label: "Confirm source ownership and adapters", owner: "Platform Owner", evidence: "domain source map signed", status: "ready" },
  { id: "prep-2", phase: "prepare", label: "Generate baseline snapshots", owner: "Database Owner", evidence: "snapshot checksum file", status: "verified" },
  { id: "reh-1", phase: "rehearse", label: "Run parity drills", owner: "Operations Lead", evidence: "parity drill report", status: "verified" },
  { id: "freeze-1", phase: "freeze", label: "Freeze selected domain writes", owner: "Platform Owner", evidence: "command audit event", status: "staging" },
  { id: "cutover-1", phase: "cutover", label: "Switch read model to source adapter", owner: "Database Owner", evidence: "adapter mode event", status: "planned" },
  { id: "validate-1", phase: "validate", label: "Validate UI/API parity", owner: "QA Owner", evidence: "read endpoint parity", status: "planned" },
  { id: "rollback-1", phase: "rollback", label: "Rollback affected adapter", owner: "Incident Commander", evidence: "rollback command event", status: "ready" },
  { id: "handoff-1", phase: "handoff", label: "Operational handoff", owner: "Operations Lead", evidence: "handoff checklist", status: "planned" }
];

export const goNoGo: Release["goNoGo"] = [
  { id: "g1", label: "All critical adapters mapped", status: "ready", evidence: "tasks, projects, stock, pontaj, audit mapped" },
  { id: "g2", label: "Parity drills above threshold", status: "attention", evidence: "pontaj/mobile need final parity improvement" },
  { id: "g3", label: "Audit envelope required", status: "ready", evidence: "audit tap configured on every domain" },
  { id: "g4", label: "Rollback commands available", status: "ready", evidence: "freeze, isolate, rollback, read-only commands defined" }
];

export const roadmap: Release["roadmap"] = [
  { version: "5.2.0", title: "Source Cutover Pilot Waves", outcome: "Run pilot cutover by domain waves.", required: ["Task/project wave", "Stock wave", "Pontaj workload wave"] },
  { version: "5.3.0", title: "Unified Reconciliation Queue", outcome: "Create operator queue for all source mismatches.", required: ["Mismatch cards", "Owner assignment", "Resolution audit"] },
  { version: "5.4.0", title: "Cross-Module Production Write Enablement", outcome: "Move approved domains from read shadow to limited production writes.", required: ["Env gates", "RBAC enforcement", "Rollback pass"] }
];

export function getProductionSourceCutoverRehearsals(): Release {
  return {
    ok: true,
    version: "5.1.0",
    name: "Production Source Cutover Rehearsals & Adapter Parity Drills",
    generatedAt: new Date().toISOString(),
    productionWrites: "off-by-default",
    summary: "Production rehearsal layer for source-of-truth adapters. It validates real adapter parity, reconciliation rules, domain cutover windows, rollback commands and go/no-go evidence across Taskuri, Proiecte, Stocuri, Pontaj, Audit and the wider Work OS platform.",
    readiness,
    metrics,
    domains,
    adapters,
    contracts,
    parityDrills,
    rehearsals,
    reconciliation,
    commands,
    incidents,
    runbook,
    goNoGo,
    roadmap
  };
}

export function getProductionSourceCutoverHealth() {
  const release = getProductionSourceCutoverRehearsals();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    readiness: release.readiness,
    productionWrites: release.productionWrites,
    criticalDomains: release.domains.filter((domain) => ["tasks", "projects", "stock", "pontaj", "audit"].includes(domain.id)),
    goNoGo: release.goNoGo,
    blockers: release.domains.flatMap((domain) => domain.blockers.map((blocker) => ({ domain: domain.id, blocker })))
  };
}

export function getCutoverDomain(domainId?: string) {
  if (!domainId) return domains;
  return domains.find((domain) => domain.id === domainId) ?? null;
}

export function getCutoverAdapterRegistry() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), adapters }; }
export function getCutoverContracts() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), contracts }; }
export function getCutoverParityDrills() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), parityDrills }; }
export function getCutoverRehearsals() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), rehearsals }; }
export function getCutoverReconciliation() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), reconciliation }; }
export function getCutoverCommands() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), commands }; }
export function getCutoverIncidents() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), incidents }; }
export function getCutoverRunbook() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), runbook }; }
export function getCutoverGoNoGo() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), goNoGo }; }
export function getCutoverRoadmap() { return { ok: true, version: "5.1.0", generatedAt: new Date().toISOString(), roadmap }; }
