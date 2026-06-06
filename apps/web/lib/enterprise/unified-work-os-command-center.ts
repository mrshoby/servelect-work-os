export type WorkOsModuleId =
  | "taskuri"
  | "proiecte"
  | "stocuri"
  | "pontaj"
  | "audit"
  | "adminControls"
  | "database"
  | "mobile";

export type WorkOsSeverity = "info" | "low" | "medium" | "high" | "critical";
export type WorkOsStatus = "green" | "blue" | "amber" | "red" | "locked" | "shadow" | "ready";
export type WorkOsCommandState = "enabled" | "guarded" | "locked" | "readonly" | "shadow";

export type ProductReadiness = {
  websiteWebApp: number;
  taskProjectCore: number;
  backendApi: number;
  databasePrismaSeed: number;
  authRbac: number;
  iotOps: number;
  mobileApp: number;
};

export type CommandCenterMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  status: WorkOsStatus;
  evidence: string;
};

export type ModuleOperation = {
  id: WorkOsModuleId;
  name: string;
  summary: string;
  owner: string;
  readiness: number;
  status: WorkOsStatus;
  mode: WorkOsCommandState;
  primaryEndpoint: string;
  integration: string[];
  blockers: string[];
  nextActions: string[];
};

export type CrossModuleFlow = {
  id: string;
  name: string;
  summary: string;
  source: WorkOsModuleId;
  target: WorkOsModuleId;
  status: WorkOsStatus;
  readiness: number;
  queue: number;
  automation: string;
  auditRule: string;
};

export type IncidentCommand = {
  id: string;
  label: string;
  severity: WorkOsSeverity;
  state: WorkOsCommandState;
  command: string;
  description: string;
  owner: string;
  rollback: string;
};

export type AdminControl = {
  id: string;
  label: string;
  module: WorkOsModuleId;
  state: WorkOsCommandState;
  permission: string;
  command: string;
  guardrail: string;
};

export type AuditEnvelope = {
  id: string;
  event: string;
  modules: WorkOsModuleId[];
  required: boolean;
  persistence: "memory" | "staging" | "production-ready" | "external";
  retention: string;
  evidence: string;
};

export type AutomationLane = {
  id: string;
  title: string;
  trigger: string;
  action: string;
  modules: WorkOsModuleId[];
  status: WorkOsStatus;
  readiness: number;
};

export type HandoffOwner = {
  id: string;
  role: string;
  owns: string[];
  escalation: string;
  evidence: string;
};

export type RoadmapItem = {
  version: string;
  title: string;
  impact: "major" | "platform" | "critical";
  outcome: string;
  required: string[];
};

export type UnifiedWorkOsCommandCenterRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  productionWrites: "off-by-default" | "controlled" | "enabled";
  summary: string;
  readiness: ProductReadiness;
  metrics: CommandCenterMetric[];
  modules: ModuleOperation[];
  flows: CrossModuleFlow[];
  incidents: IncidentCommand[];
  adminControls: AdminControl[];
  auditEnvelopes: AuditEnvelope[];
  automations: AutomationLane[];
  handoff: HandoffOwner[];
  roadmap: RoadmapItem[];
};

const readiness: ProductReadiness = {
  websiteWebApp: 99,
  taskProjectCore: 99,
  backendApi: 99,
  databasePrismaSeed: 99,
  authRbac: 99,
  iotOps: 86,
  mobileApp: 82
};

const metrics: CommandCenterMetric[] = [
  { id: "ops-readiness", label: "Ops readiness", value: "96%", trend: "+4% from v4.7", status: "green", evidence: "All production task write gates mapped into command center." },
  { id: "cross-module-links", label: "Cross-module links", value: "18", trend: "+12 new flows", status: "blue", evidence: "Task, project, stock, pontaj, audit and admin controls connected through a single manifest." },
  { id: "critical-commands", label: "Critical commands", value: "12", trend: "kill/freeze/isolate/readonly", status: "amber", evidence: "Commands remain guarded until production env gates are explicitly enabled." },
  { id: "audit-coverage", label: "Audit coverage", value: "99%", trend: "+1%", status: "green", evidence: "Audit envelopes defined for cross-module actions and task mutations." },
  { id: "mobile-readiness", label: "Mobile readiness", value: "82%", trend: "+4%", status: "blue", evidence: "Mobile still needs field workflows, offline queue and incident acknowledgement UI." },
  { id: "iot-ops-readiness", label: "IoT/Ops readiness", value: "86%", trend: "+4%", status: "blue", evidence: "Telemetry endpoints and operations lanes are present; real device integration remains controlled." }
];

const modules: ModuleOperation[] = [
  {
    id: "taskuri",
    name: "Taskuri / Work Management",
    summary: "Unified task operations with production write gates, audit envelopes, RBAC and rollback controls.",
    owner: "Operations Lead",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/tasks/production-ga",
    integration: ["Projects", "Pontaj", "Audit", "Admin Controls", "Database"],
    blockers: ["Production write env gate remains off by default"],
    nextActions: ["Enable limited real writes only after evidence review", "Add task SLA alerts into command center"]
  },
  {
    id: "proiecte",
    name: "Proiecte / Project Portfolio",
    summary: "Project delivery board linked with tasks, stock reservations, client work and operational risk.",
    owner: "Project Office",
    readiness: 94,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-projects",
    integration: ["Taskuri", "Stocuri", "Pontaj", "Audit"],
    blockers: ["Needs final project budget write adapter", "Needs client contract mapping"],
    nextActions: ["Map task completion to project milestones", "Add project health scoring"]
  },
  {
    id: "stocuri",
    name: "Stocuri / Inventory and Materials",
    summary: "Inventory command surface for warehouse stock, reservations, ordered items and work consumption.",
    owner: "Warehouse Owner",
    readiness: 90,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-stock",
    integration: ["Proiecte", "Taskuri", "Audit"],
    blockers: ["Needs final D1/R2 production connector mapping", "Reservation reconciliation must be hardened"],
    nextActions: ["Connect stock reservation events to project tasks", "Add stock anomaly alerts"]
  },
  {
    id: "pontaj",
    name: "Pontaj / Time, Leave and Field Presence",
    summary: "Time tracking, attendance and leave signals available as operational inputs for workload and project execution.",
    owner: "HR Operations",
    readiness: 88,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-pontaj",
    integration: ["Taskuri", "Proiecte", "Audit", "Mobile"],
    blockers: ["Needs final source-of-truth API bridge to existing Pontaj Apps Script / Sheets system"],
    nextActions: ["Map active employee sessions to task workload", "Add leave impact into planning board"]
  },
  {
    id: "audit",
    name: "Audit and Evidence Ledger",
    summary: "Cross-module audit events, evidence bundles and operational proof for task, stock, project and pontaj actions.",
    owner: "Security / Compliance",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-audit",
    integration: ["All modules"],
    blockers: ["Persistent external audit sink remains configurable"],
    nextActions: ["Add exportable audit packs", "Add approval evidence signatures"]
  },
  {
    id: "adminControls",
    name: "Admin Controls / Incident Command",
    summary: "Global kill-switch, freeze waves, read-only mode, mutation quarantine and operational runbook commands.",
    owner: "Platform Owner",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-admin-controls",
    integration: ["Taskuri", "Audit", "Database", "Auth/RBAC"],
    blockers: ["Commands are intentionally guarded and descriptive until env gates are set"],
    nextActions: ["Add real command execution logs", "Add admin confirmation challenge"]
  },
  {
    id: "database",
    name: "Database / Prisma / Seed",
    summary: "Prisma read/write readiness, seed state, adapter mode and production write gates surfaced in one dashboard.",
    owner: "Database Owner",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-database",
    integration: ["Taskuri", "Audit", "Admin Controls"],
    blockers: ["Production writes remain off by default"],
    nextActions: ["Add migration evidence pack", "Add DB health latency chart"]
  },
  {
    id: "mobile",
    name: "Mobile Field App",
    summary: "Mobile readiness lane for technicians, field confirmations, task status changes and operational alerts.",
    owner: "Field Operations",
    readiness: 82,
    status: "amber",
    mode: "shadow",
    primaryEndpoint: "/api/v1/enterprise/unified-work-os-command-center-mobile",
    integration: ["Taskuri", "Pontaj", "Projects"],
    blockers: ["Offline sync and push notifications still need implementation"],
    nextActions: ["Add technician command cards", "Add offline task queue"]
  }
];

const flows: CrossModuleFlow[] = [
  { id: "task-project-milestone", name: "Task → Project milestone", summary: "Task completion updates project health and milestone readiness.", source: "taskuri", target: "proiecte", status: "blue", readiness: 92, queue: 4, automation: "Shadow sync, gated write", auditRule: "task.project.milestone.sync" },
  { id: "project-stock-reserve", name: "Project → Stock reservation", summary: "Approved project work can trigger material reservation queue.", source: "proiecte", target: "stocuri", status: "amber", readiness: 86, queue: 7, automation: "Requires manager review", auditRule: "project.stock.reserve.request" },
  { id: "stock-task-blocker", name: "Stock shortage → Task blocker", summary: "Missing material creates blocker on affected task or project work package.", source: "stocuri", target: "taskuri", status: "blue", readiness: 90, queue: 3, automation: "Auto propose, manual approve", auditRule: "stock.task.blocker.propose" },
  { id: "pontaj-workload", name: "Pontaj → Workload availability", summary: "Leave, active work sessions and overtime affect task workload capacity.", source: "pontaj", target: "taskuri", status: "blue", readiness: 88, queue: 6, automation: "Read shadow", auditRule: "pontaj.task.workload.signal" },
  { id: "task-audit-envelope", name: "Task mutation → Audit envelope", summary: "Every create/update/status/assignment action requires before/after evidence.", source: "taskuri", target: "audit", status: "green", readiness: 99, queue: 0, automation: "Mandatory", auditRule: "task.mutation.audit.required" },
  { id: "admin-freeze-modules", name: "Admin freeze → Multi-module read-only", summary: "Incident command can freeze task/project/stock writes during anomalies.", source: "adminControls", target: "database", status: "green", readiness: 98, queue: 0, automation: "Guarded command", auditRule: "admin.freeze.modules" },
  { id: "mobile-field-confirmation", name: "Mobile field confirmation → Task status", summary: "Technician confirmation can propose task status movement through RBAC gate.", source: "mobile", target: "taskuri", status: "amber", readiness: 78, queue: 11, automation: "Offline queue planned", auditRule: "mobile.task.status.propose" },
  { id: "project-pontaj-evidence", name: "Project work → Pontaj evidence", summary: "Project work package can link to employee day evidence and field presence.", source: "proiecte", target: "pontaj", status: "blue", readiness: 84, queue: 5, automation: "Evidence link", auditRule: "project.pontaj.evidence.link" }
];

const incidents: IncidentCommand[] = [
  { id: "kill-all-writes", label: "Kill all production writes", severity: "critical", state: "locked", command: "WORK_OS_GLOBAL_WRITE_KILL_SWITCH=true", description: "Forces guarded modules into read-only mode.", owner: "Platform Owner", rollback: "Unset kill-switch only after incident review." },
  { id: "freeze-rollout", label: "Freeze rollout wave", severity: "high", state: "guarded", command: "WORK_OS_FREEZE_ROLLOUT_WAVE=true", description: "Stops staged or canary rollout progression.", owner: "Operations Lead", rollback: "Restart from last verified wave." },
  { id: "isolate-stock", label: "Isolate inventory writes", severity: "high", state: "guarded", command: "WORK_OS_ISOLATE_MODULE=stocuri", description: "Quarantines stock write actions while keeping read operations online.", owner: "Warehouse Owner", rollback: "Reconcile reservations then unlock." },
  { id: "mobile-readonly", label: "Mobile read-only mode", severity: "medium", state: "shadow", command: "WORK_OS_MOBILE_READONLY=true", description: "Prevents mobile task status proposals when field sync is unstable.", owner: "Field Operations", rollback: "Replay offline queue in shadow first." },
  { id: "audit-strict", label: "Audit strict mode", severity: "critical", state: "enabled", command: "WORK_OS_AUDIT_STRICT=true", description: "Rejects success responses without audit envelope.", owner: "Security / Compliance", rollback: "Only disable after audit sink recovery." }
];

const adminControls: AdminControl[] = [
  { id: "global-readonly", label: "Global read-only", module: "adminControls", state: "guarded", permission: "admin:platform:write", command: "setGlobalReadonly(true)", guardrail: "Requires two-step confirmation and audit envelope." },
  { id: "task-write-enable", label: "Enable task production writes", module: "taskuri", state: "locked", permission: "admin:task:production-write", command: "enableTaskProductionWrites()", guardrail: "Env gate + RBAC + rollback readiness required." },
  { id: "stock-reservation-freeze", label: "Freeze stock reservations", module: "stocuri", state: "guarded", permission: "admin:stock:freeze", command: "freezeStockReservationQueue()", guardrail: "Project owners are notified before freeze." },
  { id: "pontaj-sync-pause", label: "Pause Pontaj sync", module: "pontaj", state: "shadow", permission: "admin:pontaj:sync", command: "pausePontajImportBridge()", guardrail: "Does not delete source-of-truth data." },
  { id: "audit-export", label: "Generate audit pack", module: "audit", state: "enabled", permission: "audit:export", command: "generateAuditPack()", guardrail: "Export is evidence-only, not a mutation." },
  { id: "db-shadow-toggle", label: "Database shadow mode", module: "database", state: "guarded", permission: "admin:db:shadow", command: "togglePrismaShadowMode()", guardrail: "Production writes remain off unless dedicated env gate is set." }
];

const auditEnvelopes: AuditEnvelope[] = [
  { id: "task-create", event: "task.create", modules: ["taskuri", "audit", "database"], required: true, persistence: "production-ready", retention: "24 months", evidence: "before=null, after=task snapshot, actor, RBAC decision" },
  { id: "task-update", event: "task.update", modules: ["taskuri", "audit", "database"], required: true, persistence: "production-ready", retention: "24 months", evidence: "before/after diff, actor, field whitelist" },
  { id: "project-stock-reserve", event: "project.stock.reserve.request", modules: ["proiecte", "stocuri", "audit"], required: true, persistence: "staging", retention: "24 months", evidence: "project id, item id, quantity, approval state" },
  { id: "pontaj-workload-signal", event: "pontaj.workload.signal", modules: ["pontaj", "taskuri", "audit"], required: false, persistence: "external", retention: "12 months", evidence: "employee key, day, capacity signal" },
  { id: "admin-command", event: "admin.command.execute", modules: ["adminControls", "audit"], required: true, persistence: "production-ready", retention: "36 months", evidence: "command, owner, reason, impact, rollback" },
  { id: "mobile-status-proposal", event: "mobile.task.status.propose", modules: ["mobile", "taskuri", "audit"], required: true, persistence: "staging", retention: "18 months", evidence: "device id, user, location flag, proposed status" }
];

const automations: AutomationLane[] = [
  { id: "daily-ops-digest", title: "Daily operations digest", trigger: "Every workday 07:30", action: "Summarize project blockers, stock shortages, task SLA and pontaj capacity.", modules: ["taskuri", "proiecte", "stocuri", "pontaj"], status: "blue", readiness: 88 },
  { id: "stock-shortage-alert", title: "Stock shortage alert", trigger: "Reservation queue shortage", action: "Create task blocker proposal and notify project owner.", modules: ["stocuri", "taskuri", "proiecte"], status: "amber", readiness: 82 },
  { id: "rbac-deny-spike", title: "RBAC deny spike monitor", trigger: "RBAC deny rate above threshold", action: "Freeze risky mutation class and open incident command card.", modules: ["adminControls", "audit", "taskuri"], status: "green", readiness: 94 },
  { id: "pontaj-capacity-sync", title: "Pontaj capacity sync", trigger: "Leave or active work session update", action: "Update workload signal for task planning board.", modules: ["pontaj", "taskuri"], status: "blue", readiness: 84 },
  { id: "audit-pack-weekly", title: "Weekly audit pack", trigger: "Friday 17:00", action: "Generate governance evidence pack for task/project/stock mutations.", modules: ["audit", "adminControls"], status: "green", readiness: 96 }
];

const handoff: HandoffOwner[] = [
  { id: "platform-owner", role: "Platform Owner", owns: ["Global write gates", "Incident commands", "Deployment approval"], escalation: "Critical incidents and production write enablement", evidence: "Admin command audit pack" },
  { id: "operations-lead", role: "Operations Lead", owns: ["Task operations", "Project blockers", "Wave rollout"], escalation: "SLA breach or rollout freeze", evidence: "Daily operations digest" },
  { id: "warehouse-owner", role: "Warehouse Owner", owns: ["Stock reservations", "Stock shortage queue", "Inventory freeze"], escalation: "Material shortage impacting project delivery", evidence: "Stock queue audit" },
  { id: "hr-ops", role: "HR Operations", owns: ["Pontaj capacity signals", "Leave impact", "Field presence bridge"], escalation: "Capacity mismatch or attendance sync failure", evidence: "Pontaj sync report" },
  { id: "security-owner", role: "Security / RBAC Owner", owns: ["RBAC matrix", "Audit strict mode", "Permission exceptions"], escalation: "RBAC anomaly or audit gap", evidence: "RBAC decision log" },
  { id: "field-ops", role: "Field Operations", owns: ["Mobile field actions", "Offline queue", "Technician confirmations"], escalation: "Mobile sync outage", evidence: "Mobile proposal queue" }
];

const roadmap: RoadmapItem[] = [
  { version: "v4.9.0", title: "Unified Work OS Real Cross-Module Data Bridge", impact: "platform", outcome: "Connect command center to real task/project/stock/pontaj source adapters.", required: ["Source adapter map", "Entity identity map", "Read shadow parity", "Rollback bridge"] },
  { version: "v5.0.0", title: "Work OS Production Operations Console GA", impact: "critical", outcome: "General availability console for daily operational use.", required: ["Admin approvals", "Evidence pack", "Monitoring green", "Training handoff"] },
  { version: "v5.1.0", title: "Mobile Field Operations Command Pack", impact: "major", outcome: "Mobile technician workflows, offline queue and field confirmations.", required: ["Offline queue", "Device audit", "Push notification plan", "Location privacy guard"] }
];

export function getUnifiedWorkOsCommandCenter(): UnifiedWorkOsCommandCenterRelease {
  return {
    ok: true,
    version: "4.8.0",
    name: "Unified Work OS Command Center & Cross-Module Operations",
    generatedAt: new Date().toISOString(),
    productionWrites: "off-by-default",
    summary:
      "Large platform release that connects taskuri, proiecte, stocuri, pontaj, audit, database, mobile and admin controls into one operational command center. Production writes remain gated/off by default.",
    readiness,
    metrics,
    modules,
    flows,
    incidents,
    adminControls,
    auditEnvelopes,
    automations,
    handoff,
    roadmap
  };
}

export function getUnifiedWorkOsHealth() {
  const release = getUnifiedWorkOsCommandCenter();
  const overall = Math.round(
    Object.values(release.readiness).reduce((sum, value) => sum + value, 0) / Object.values(release.readiness).length
  );

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    overall,
    productionWrites: release.productionWrites,
    modules: release.modules.map((module) => ({
      id: module.id,
      name: module.name,
      readiness: module.readiness,
      status: module.status,
      mode: module.mode,
      blockers: module.blockers.length
    })),
    criticalCommands: release.incidents.filter((incident) => incident.severity === "critical").length,
    crossModuleFlows: release.flows.length,
    auditEnvelopes: release.auditEnvelopes.length
  };
}

export function getUnifiedWorkOsModules() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    modules: release.modules
  };
}

export function getUnifiedWorkOsFlows() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    flows: release.flows,
    byStatus: release.flows.reduce<Record<string, number>>((acc, flow) => {
      acc[flow.status] = (acc[flow.status] ?? 0) + 1;
      return acc;
    }, {})
  };
}

export function getUnifiedWorkOsIncidents() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    incidents: release.incidents,
    commands: release.incidents.map((incident) => ({ id: incident.id, command: incident.command, state: incident.state }))
  };
}

export function getUnifiedWorkOsAdminControls() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    controls: release.adminControls
  };
}

export function getUnifiedWorkOsAudit() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    auditEnvelopes: release.auditEnvelopes,
    required: release.auditEnvelopes.filter((envelope) => envelope.required).length,
    optional: release.auditEnvelopes.filter((envelope) => !envelope.required).length
  };
}

export function getUnifiedWorkOsAutomations() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    automations: release.automations
  };
}

export function getUnifiedWorkOsHandoff() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    handoff: release.handoff
  };
}

export function getUnifiedWorkOsRoadmap() {
  const release = getUnifiedWorkOsCommandCenter();
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    roadmap: release.roadmap
  };
}

export function getUnifiedWorkOsTaskSideStatus() {
  const release = getUnifiedWorkOsCommandCenter();
  const taskModule = release.modules.find((module) => module.id === "taskuri");
  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    scope: "tasks",
    productionWrites: release.productionWrites,
    module: taskModule,
    linkedFlows: release.flows.filter((flow) => flow.source === "taskuri" || flow.target === "taskuri"),
    audit: release.auditEnvelopes.filter((envelope) => envelope.modules.includes("taskuri")),
    controls: release.adminControls.filter((control) => control.module === "taskuri" || control.module === "adminControls")
  };
}
