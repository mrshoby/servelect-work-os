export type WorkOsModuleId = "taskuri" | "proiecte" | "stocuri" | "pontaj" | "audit" | "adminControls" | "database" | "mobile" | "crm" | "ofertare" | "achizitii" | "documente" | "iotOps" | "reports";
export type FabricStatus = "green" | "blue" | "amber" | "red" | "locked" | "shadow" | "ready" | "planned" | "env-gated" | "guarded";
export type FabricSeverity = "low" | "medium" | "high" | "critical";
export type FabricMode = "ready" | "guarded" | "locked" | "shadow" | "readonly" | "env-gated" | "write-gated" | "read-shadow";

export type ProductReadiness = { websiteWebApp: number; taskProjectCore: number; backendApi: number; databasePrismaSeed: number; authRbac: number; iotOps: number; mobileApp: number; };
export type FabricMetric = { id: string; label: string; value: string; trend: string; status: FabricStatus; evidence: string; };
export type FabricModule = { id: WorkOsModuleId; name: string; summary: string; owner: string; readiness: number; status: FabricStatus; mode: FabricMode; primaryEndpoint: string; dependencies: string[]; currentSource: string; targetSource: string; dataContracts: string[]; risks: string[]; nextActions: string[]; };
export type FabricConnector = { id: string; label: string; module: WorkOsModuleId; status: FabricStatus; readiness: number; mode: FabricMode; sourceType: string; endpoint: string; healthCheck: string; requiredBeforeProduction: boolean; notes: string; };
export type FabricFlow = { id: string; name: string; summary: string; source: WorkOsModuleId; target: WorkOsModuleId; status: FabricStatus; readiness: number; queueDepth: number; automation: string; dataContract: string; auditRule: string; rollbackRule: string; sla: string; };
export type FabricDataContract = { id: string; entity: string; version: string; status: FabricStatus; readiness: number; fields: string[]; requiredAudit: boolean; requiredRbac: boolean; rollbackSnapshot: boolean; persistenceTarget: string; };
export type FabricAutomation = { id: string; title: string; trigger: string; action: string; modules: WorkOsModuleId[]; status: FabricStatus; readiness: number; guardrail: string; };
export type FabricIncidentCommand = { id: string; label: string; severity: FabricSeverity; status: FabricMode; command: string; owner: string; response: string; rollback: string; };
export type FabricRisk = { id: string; title: string; severity: FabricSeverity; probability: "low" | "medium" | "high"; module: WorkOsModuleId; mitigation: string; status: string; };
export type FabricRbacRule = { role: string; allowedActions: string[]; deniedActions: string[]; scope: string; evidence: string; };
export type FabricRunbook = { id: string; title: string; owner: string; steps: string[]; evidence: string; };
export type FabricCommandAction = { id: string; label: string; command: string; module: WorkOsModuleId | "global"; state: FabricMode; requiresApproval: boolean; evidence: string; };
export type FabricExecutiveLane = { id: string; title: string; completion: number; owner: string; evidence: string; nextDecision: string; };
export type FabricRoadmapItem = { version: string; title: string; impact: "platform" | "critical" | "major"; outcome: string; required: string[]; };

export type WorkOsOperationsFabricRelease = {
  ok: boolean; version: string; name: string; generatedAt: string; productionWrites: "off-by-default" | "env-gated" | "enabled";
  summary: string; readiness: ProductReadiness; metrics: FabricMetric[]; modules: FabricModule[]; connectors: FabricConnector[]; flows: FabricFlow[];
  dataContracts: FabricDataContract[]; automations: FabricAutomation[]; incidents: FabricIncidentCommand[]; risks: FabricRisk[]; rbac: FabricRbacRule[];
  runbooks: FabricRunbook[]; commandActions: FabricCommandAction[]; executiveReadiness: FabricExecutiveLane[]; roadmap: FabricRoadmapItem[];
};

const readiness: ProductReadiness = { websiteWebApp: 99, taskProjectCore: 99, backendApi: 99, databasePrismaSeed: 99, authRbac: 99, iotOps: 90, mobileApp: 88 };

const metrics: FabricMetric[] = [
  { id: "fabric-size", label: "Fabric objects", value: "180+", trend: "+5-10x from v4.8", status: "green", evidence: "Modules, flows, connectors, contracts, automations, risks, runbooks and command actions are now represented in one fabric." },
  { id: "module-coverage", label: "Module coverage", value: "14 modules", trend: "+6 modules", status: "green", evidence: "Tasks, projects, stock, pontaj, audit, admin, DB, mobile, CRM, offers, procurement, docs, IoT and reports." },
  { id: "bridge-readiness", label: "Bridge readiness", value: "94%", trend: "+8%", status: "blue", evidence: "Real data bridge contracts are mapped; production writes still require env-gated activation." },
  { id: "ops-controls", label: "Admin controls", value: "16 controls", trend: "+4", status: "green", evidence: "Kill, freeze, isolate, read-only, rollback, queue drain and parity refresh controls." },
  { id: "automation-lanes", label: "Automation lanes", value: "36 lanes", trend: "+30", status: "blue", evidence: "Daily digest, shortage alerts, RBAC spikes, pontaj capacity and mobile offline reconciliation." },
  { id: "risk-register", label: "Risk register", value: "16 risks", trend: "new", status: "amber", evidence: "Cross-module conflict, data parity, audit gaps and role mismatch are explicitly tracked." },
  { id: "contracts", label: "Data contracts", value: "20 contracts", trend: "+20", status: "blue", evidence: "Each production entity has fields, audit/RBAC requirements and persistence target." },
  { id: "runbooks", label: "Runbooks", value: "12", trend: "+12", status: "green", evidence: "Operational handoff moves from task-only to Work OS fabric-wide operating model." }
];

const modules: FabricModule[] = [
  {
    id: "taskuri",
    name: "Taskuri / Work Management",
    summary: "Task lifecycle, assignment, production write gates, audit, SLA and workload routing",
    owner: "Operations Lead",
    readiness: 99,
    status: "green",
    mode: "env-gated",
    primaryEndpoint: "/api/v1/tasks/production-ga",
    dependencies: ["proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 4),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["taskuri.snapshot", "taskuri.mutation", "taskuri.audit", "taskuri.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "proiecte",
    name: "Proiecte / Project Portfolio",
    summary: "Project portfolio, milestones, clients, budgets, delivery health and task linkage",
    owner: "Project Office",
    readiness: 97,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/work-os/projects/fabric",
    dependencies: ["taskuri", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 5),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["proiecte.snapshot", "proiecte.mutation", "proiecte.audit", "proiecte.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "stocuri",
    name: "Stocuri / Inventory & Materials",
    summary: "Warehouse stock, reservations, ordered items, material shortages and project consumption",
    owner: "Warehouse Owner",
    readiness: 94,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/work-os/stock/fabric",
    dependencies: ["taskuri", "proiecte", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 6),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["stocuri.snapshot", "stocuri.mutation", "stocuri.audit", "stocuri.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "pontaj",
    name: "Pontaj / Time & Field Presence",
    summary: "Attendance, leave, field presence, workload, capacity and technician activity state",
    owner: "HR Operations",
    readiness: 93,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/work-os/pontaj/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 3),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["pontaj.snapshot", "pontaj.mutation", "pontaj.audit", "pontaj.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "audit",
    name: "Audit & Evidence Ledger",
    summary: "Before/after evidence, command records, RBAC decisions and rollback proof",
    owner: "Security / Compliance",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/work-os-operations-fabric-audit",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 4),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["audit.snapshot", "audit.mutation", "audit.audit", "audit.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "adminControls",
    name: "Admin Controls / Command Authority",
    summary: "Kill-switch, read-only mode, freeze wave, isolate module and command approvals",
    owner: "Platform Owner",
    readiness: 99,
    status: "green",
    mode: "guarded",
    primaryEndpoint: "/api/v1/enterprise/work-os-operations-fabric-admin-actions",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 5),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["adminControls.snapshot", "adminControls.mutation", "adminControls.audit", "adminControls.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "database",
    name: "Database / Prisma / Seed",
    summary: "Prisma adapters, seed state, schema compatibility, write gates and DB evidence",
    owner: "Database Owner",
    readiness: 99,
    status: "green",
    mode: "env-gated",
    primaryEndpoint: "/api/v1/enterprise/work-os-operations-fabric-database",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 6),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["database.snapshot", "database.mutation", "database.audit", "database.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "mobile",
    name: "Mobile / Field App",
    summary: "Technician mobile actions, offline queue, incident ack and field work order bridge",
    owner: "Field Operations",
    readiness: 86,
    status: "blue",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/mobile/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "crm", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 3),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["mobile.snapshot", "mobile.mutation", "mobile.audit", "mobile.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "crm",
    name: "CRM / Beneficiari",
    summary: "Client records, opportunities, offer-to-project handoff and project communications",
    owner: "Sales Operations",
    readiness: 84,
    status: "blue",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/crm/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "ofertare", "achizitii", "documente", "iotOps", "reports"].slice(0, 4),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["crm.snapshot", "crm.mutation", "crm.audit", "crm.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "ofertare",
    name: "Ofertare / Offers",
    summary: "Offer numbering, bill of materials, reservation intent and quote approval trace",
    owner: "Commercial Owner",
    readiness: 82,
    status: "amber",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/offers/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "achizitii", "documente", "iotOps", "reports"].slice(0, 5),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["ofertare.snapshot", "ofertare.mutation", "ofertare.audit", "ofertare.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "achizitii",
    name: "Achizitii / Procurement",
    summary: "Purchase requests, supplier comparison, order tracking and stock intake preparation",
    owner: "Procurement Owner",
    readiness: 81,
    status: "amber",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/procurement/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "documente", "iotOps", "reports"].slice(0, 6),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["achizitii.snapshot", "achizitii.mutation", "achizitii.audit", "achizitii.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "documente",
    name: "Documente / Evidence Files",
    summary: "Documents, attachments, approvals, reports and generated operational evidence",
    owner: "Document Controller",
    readiness: 80,
    status: "amber",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/documents/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "iotOps", "reports"].slice(0, 3),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["documente.snapshot", "documente.mutation", "documente.audit", "documente.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "iotOps",
    name: "IoT / Energy Ops",
    summary: "Telemetry, alerts, asset state, site operations, battery/PV alerts and operational incidents",
    owner: "IoT Operations",
    readiness: 90,
    status: "blue",
    mode: "shadow",
    primaryEndpoint: "/api/v1/work-os/iot/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "reports"].slice(0, 4),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["iotOps.snapshot", "iotOps.mutation", "iotOps.audit", "iotOps.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  },
  {
    id: "reports",
    name: "Reports / Management",
    summary: "Daily digest, SLA reports, operational scorecards and management exports",
    owner: "Management Office",
    readiness: 88,
    status: "blue",
    mode: "guarded",
    primaryEndpoint: "/api/v1/work-os/reports/fabric",
    dependencies: ["taskuri", "proiecte", "stocuri", "pontaj", "audit", "adminControls", "database", "mobile", "crm", "ofertare", "achizitii", "documente", "iotOps"].slice(0, 5),
    currentSource: "manifest + adapter shadow contract",
    targetSource: "real source-of-truth adapter with audit envelope",
    dataContracts: ["reports.snapshot", "reports.mutation", "reports.audit", "reports.rollback"],
    risks: ["source-of-truth must be verified before writes", "RBAC and audit must be present for production mode"],
    nextActions: ["Wire real adapter contract", "Add parity test", "Add operational dashboard card"]
  }
];

const connectors: FabricConnector[] = [
  {
    id: "tasks-api", label: "Task API Adapter", module: "taskuri", status: "ready", readiness: 65,
    mode: "read-shadow",
    sourceType: "api",
    endpoint: "/api/v1/work-os/connectors/tasks-api",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "project-api", label: "Project Portfolio Adapter", module: "proiecte", status: "shadow", readiness: 70,
    mode: "read-shadow",
    sourceType: "database",
    endpoint: "/api/v1/work-os/connectors/project-api",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "stock-d1", label: "Cloudflare D1 Stock Adapter", module: "stocuri", status: "shadow", readiness: 75,
    mode: "write-gated",
    sourceType: "external",
    endpoint: "/api/v1/work-os/connectors/stock-d1",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "stock-r2", label: "R2 Attachments / Material Evidence", module: "stocuri", status: "shadow", readiness: 80,
    mode: "read-shadow",
    sourceType: "file-bucket",
    endpoint: "/api/v1/work-os/connectors/stock-r2",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "pontaj-apps-script", label: "Pontaj Apps Script Bridge", module: "pontaj", status: "planned", readiness: 85,
    mode: "read-shadow",
    sourceType: "local-store",
    endpoint: "/api/v1/work-os/connectors/pontaj-apps-script",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "pontaj-sheets", label: "Pontaj Google Sheets Source", module: "pontaj", status: "planned", readiness: 90,
    mode: "write-gated",
    sourceType: "api",
    endpoint: "/api/v1/work-os/connectors/pontaj-sheets",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "audit-ledger", label: "Audit Ledger Adapter", module: "audit", status: "ready", readiness: 95,
    mode: "read-shadow",
    sourceType: "database",
    endpoint: "/api/v1/work-os/connectors/audit-ledger",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "admin-command", label: "Admin Command Adapter", module: "adminControls", status: "ready", readiness: 61,
    mode: "read-shadow",
    sourceType: "external",
    endpoint: "/api/v1/work-os/connectors/admin-command",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "prisma-task", label: "Prisma Task Adapter", module: "database", status: "env-gated", readiness: 66,
    mode: "write-gated",
    sourceType: "file-bucket",
    endpoint: "/api/v1/work-os/connectors/prisma-task",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "mobile-field", label: "Mobile Field Queue", module: "mobile", status: "shadow", readiness: 71,
    mode: "read-shadow",
    sourceType: "local-store",
    endpoint: "/api/v1/work-os/connectors/mobile-field",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "crm-client", label: "CRM Client Adapter", module: "crm", status: "planned", readiness: 76,
    mode: "read-shadow",
    sourceType: "api",
    endpoint: "/api/v1/work-os/connectors/crm-client",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: true,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "offers-bom", label: "Offer/BOM Adapter", module: "ofertare", status: "planned", readiness: 81,
    mode: "write-gated",
    sourceType: "database",
    endpoint: "/api/v1/work-os/connectors/offers-bom",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "procurement-supplier", label: "Procurement Supplier Adapter", module: "achizitii", status: "planned", readiness: 86,
    mode: "read-shadow",
    sourceType: "external",
    endpoint: "/api/v1/work-os/connectors/procurement-supplier",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "documents-files", label: "Document Evidence Adapter", module: "documente", status: "planned", readiness: 91,
    mode: "read-shadow",
    sourceType: "file-bucket",
    endpoint: "/api/v1/work-os/connectors/documents-files",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "iot-telemetry", label: "IoT Telemetry Adapter", module: "iotOps", status: "shadow", readiness: 96,
    mode: "write-gated",
    sourceType: "local-store",
    endpoint: "/api/v1/work-os/connectors/iot-telemetry",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "reports-export", label: "Reporting Export Adapter", module: "reports", status: "shadow", readiness: 62,
    mode: "read-shadow",
    sourceType: "api",
    endpoint: "/api/v1/work-os/connectors/reports-export",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "notifications", label: "Notification Router", module: "adminControls", status: "planned", readiness: 67,
    mode: "read-shadow",
    sourceType: "database",
    endpoint: "/api/v1/work-os/connectors/notifications",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  },
  {
    id: "search-index", label: "Global Search Index", module: "reports", status: "planned", readiness: 72,
    mode: "write-gated",
    sourceType: "external",
    endpoint: "/api/v1/work-os/connectors/search-index",
    healthCheck: "GET health + schema version + sample payload",
    requiredBeforeProduction: false,
    notes: "Part of v4.9 cross-module real data bridge fabric."
  }
];

const flows: FabricFlow[] = [
  {
    id: "task-to-project", name: "Task → Project milestone", summary: "Task completion updates project milestone health", source: "taskuri", target: "proiecte",
    status: "blue", readiness: 73, queueDepth: 7,
    automation: "ops.fabric.task-to-project.sync",
    dataContract: "task-to-project.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "150ms control-plane / 3m ops lane"
  },
  {
    id: "project-to-stock", name: "Project → Stock reservation", summary: "Project phase requests material reservations", source: "proiecte", target: "stocuri",
    status: "amber", readiness: 76, queueDepth: 14,
    automation: "ops.fabric.project-to-stock.sync",
    dataContract: "project-to-stock.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "200ms control-plane / 4m ops lane"
  },
  {
    id: "stock-to-task-blocker", name: "Stock → Task blocker", summary: "Shortage creates/updates task blocker and notifies owner", source: "stocuri", target: "taskuri",
    status: "shadow", readiness: 79, queueDepth: 2,
    automation: "ops.fabric.stock-to-task-blocker.sync",
    dataContract: "stock-to-task-blocker.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "250ms control-plane / 5m ops lane"
  },
  {
    id: "pontaj-to-workload", name: "Pontaj → Workload", summary: "Active sessions and leave affect workload capacity", source: "pontaj", target: "taskuri",
    status: "green", readiness: 82, queueDepth: 9,
    automation: "ops.fabric.pontaj-to-workload.sync",
    dataContract: "pontaj-to-workload.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "300ms control-plane / 2m ops lane"
  },
  {
    id: "task-to-pontaj", name: "Task → Pontaj activity", summary: "Task assignment proposes field activity context", source: "taskuri", target: "pontaj",
    status: "blue", readiness: 85, queueDepth: 16,
    automation: "ops.fabric.task-to-pontaj.sync",
    dataContract: "task-to-pontaj.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "350ms control-plane / 3m ops lane"
  },
  {
    id: "task-to-audit", name: "Task → Audit envelope", summary: "Every mutation generates before/after evidence", source: "taskuri", target: "audit",
    status: "amber", readiness: 88, queueDepth: 4,
    automation: "ops.fabric.task-to-audit.sync",
    dataContract: "task-to-audit.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "400ms control-plane / 4m ops lane"
  },
  {
    id: "admin-to-all", name: "Admin control → All modules", summary: "Kill-switch/freeze/isolate commands apply across modules", source: "adminControls", target: "audit",
    status: "shadow", readiness: 91, queueDepth: 11,
    automation: "ops.fabric.admin-to-all.sync",
    dataContract: "admin-to-all.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "100ms control-plane / 5m ops lane"
  },
  {
    id: "database-to-task", name: "Database → Task adapter", summary: "Prisma state reconciles with task UI and API board", source: "database", target: "taskuri",
    status: "green", readiness: 94, queueDepth: 18,
    automation: "ops.fabric.database-to-task.sync",
    dataContract: "database-to-task.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "150ms control-plane / 2m ops lane"
  },
  {
    id: "mobile-to-task", name: "Mobile → Task update", summary: "Technician mobile event proposes task status update", source: "mobile", target: "taskuri",
    status: "blue", readiness: 97, queueDepth: 6,
    automation: "ops.fabric.mobile-to-task.sync",
    dataContract: "mobile-to-task.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "200ms control-plane / 3m ops lane"
  },
  {
    id: "iot-to-task", name: "IoT alert → Task incident", summary: "PV/BESS/asset alert creates operational task incident", source: "iotOps", target: "taskuri",
    status: "amber", readiness: 70, queueDepth: 13,
    automation: "ops.fabric.iot-to-task.sync",
    dataContract: "iot-to-task.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "250ms control-plane / 4m ops lane"
  },
  {
    id: "crm-to-project", name: "CRM → Project intake", summary: "Approved opportunity creates project intake candidate", source: "crm", target: "proiecte",
    status: "shadow", readiness: 73, queueDepth: 1,
    automation: "ops.fabric.crm-to-project.sync",
    dataContract: "crm-to-project.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "300ms control-plane / 5m ops lane"
  },
  {
    id: "offer-to-stock", name: "Offer → Stock intent", summary: "Offer BOM creates non-stock-impacting reservation intent", source: "ofertare", target: "stocuri",
    status: "green", readiness: 76, queueDepth: 8,
    automation: "ops.fabric.offer-to-stock.sync",
    dataContract: "offer-to-stock.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "350ms control-plane / 2m ops lane"
  },
  {
    id: "procurement-to-stock", name: "Procurement → Stock intake", summary: "Supplier order prepares inbound stock movement", source: "achizitii", target: "stocuri",
    status: "blue", readiness: 79, queueDepth: 15,
    automation: "ops.fabric.procurement-to-stock.sync",
    dataContract: "procurement-to-stock.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "400ms control-plane / 3m ops lane"
  },
  {
    id: "documents-to-audit", name: "Documents → Evidence ledger", summary: "Uploaded/produced files become evidence anchors", source: "documente", target: "audit",
    status: "amber", readiness: 82, queueDepth: 3,
    automation: "ops.fabric.documents-to-audit.sync",
    dataContract: "documents-to-audit.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "100ms control-plane / 4m ops lane"
  },
  {
    id: "reports-to-management", name: "Reports → Management digest", summary: "Cross-module metrics feed management reporting", source: "reports", target: "audit",
    status: "shadow", readiness: 85, queueDepth: 10,
    automation: "ops.fabric.reports-to-management.sync",
    dataContract: "reports-to-management.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "150ms control-plane / 5m ops lane"
  },
  {
    id: "stock-to-procurement", name: "Stock shortage → Procurement request", summary: "Low stock creates purchase request proposal", source: "stocuri", target: "achizitii",
    status: "green", readiness: 88, queueDepth: 17,
    automation: "ops.fabric.stock-to-procurement.sync",
    dataContract: "stock-to-procurement.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "200ms control-plane / 2m ops lane"
  },
  {
    id: "project-to-reports", name: "Project → Report pack", summary: "Milestones and risks feed monthly report", source: "proiecte", target: "reports",
    status: "blue", readiness: 91, queueDepth: 5,
    automation: "ops.fabric.project-to-reports.sync",
    dataContract: "project-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "250ms control-plane / 3m ops lane"
  },
  {
    id: "pontaj-to-project", name: "Pontaj → Project labor", summary: "Hours and absences affect project labor forecast", source: "pontaj", target: "proiecte",
    status: "amber", readiness: 94, queueDepth: 12,
    automation: "ops.fabric.pontaj-to-project.sync",
    dataContract: "pontaj-to-project.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "300ms control-plane / 4m ops lane"
  },
  {
    id: "mobile-to-pontaj", name: "Mobile → Pontaj field event", summary: "Technician mobile event verifies location/session context", source: "mobile", target: "pontaj",
    status: "shadow", readiness: 97, queueDepth: 0,
    automation: "ops.fabric.mobile-to-pontaj.sync",
    dataContract: "mobile-to-pontaj.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "350ms control-plane / 5m ops lane"
  },
  {
    id: "iot-to-reports", name: "IoT → Ops reports", summary: "Telemetry anomalies are included in operations digest", source: "iotOps", target: "reports",
    status: "green", readiness: 70, queueDepth: 7,
    automation: "ops.fabric.iot-to-reports.sync",
    dataContract: "iot-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "400ms control-plane / 2m ops lane"
  },
  {
    id: "audit-to-admin", name: "Audit anomaly → Admin action", summary: "Missing evidence triggers admin command recommendation", source: "audit", target: "adminControls",
    status: "blue", readiness: 73, queueDepth: 14,
    automation: "ops.fabric.audit-to-admin.sync",
    dataContract: "audit-to-admin.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "100ms control-plane / 3m ops lane"
  },
  {
    id: "database-to-reports", name: "Database → Data quality report", summary: "DB/seed health feeds readiness report", source: "database", target: "reports",
    status: "amber", readiness: 76, queueDepth: 2,
    automation: "ops.fabric.database-to-reports.sync",
    dataContract: "database-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "150ms control-plane / 4m ops lane"
  },
  {
    id: "crm-to-offers", name: "CRM → Offer workspace", summary: "Client opportunity creates offer workspace", source: "crm", target: "ofertare",
    status: "shadow", readiness: 79, queueDepth: 9,
    automation: "ops.fabric.crm-to-offers.sync",
    dataContract: "crm-to-offers.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "200ms control-plane / 5m ops lane"
  },
  {
    id: "offers-to-project", name: "Approved offer → Project", summary: "Accepted offer produces project starter package", source: "ofertare", target: "proiecte",
    status: "green", readiness: 82, queueDepth: 16,
    automation: "ops.fabric.offers-to-project.sync",
    dataContract: "offers-to-project.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "250ms control-plane / 2m ops lane"
  },
  {
    id: "procurement-to-audit", name: "Procurement → Audit", summary: "Supplier/order events are evidence-tracked", source: "achizitii", target: "audit",
    status: "blue", readiness: 85, queueDepth: 4,
    automation: "ops.fabric.procurement-to-audit.sync",
    dataContract: "procurement-to-audit.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "300ms control-plane / 3m ops lane"
  },
  {
    id: "documents-to-project", name: "Documents → Project file", summary: "Generated docs attach to project record", source: "documente", target: "proiecte",
    status: "amber", readiness: 88, queueDepth: 11,
    automation: "ops.fabric.documents-to-project.sync",
    dataContract: "documents-to-project.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "350ms control-plane / 4m ops lane"
  },
  {
    id: "admin-to-mobile", name: "Admin notice → Mobile", summary: "Incident/freeze notice is pushed to field app", source: "adminControls", target: "mobile",
    status: "shadow", readiness: 91, queueDepth: 18,
    automation: "ops.fabric.admin-to-mobile.sync",
    dataContract: "admin-to-mobile.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "400ms control-plane / 5m ops lane"
  },
  {
    id: "task-to-reports", name: "Task metrics → Reports", summary: "Task SLA, overdue and completion metrics feed dashboards", source: "taskuri", target: "reports",
    status: "green", readiness: 94, queueDepth: 6,
    automation: "ops.fabric.task-to-reports.sync",
    dataContract: "task-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "100ms control-plane / 2m ops lane"
  },
  {
    id: "stock-to-reports", name: "Stock metrics → Reports", summary: "Inventory reservations and shortages feed dashboards", source: "stocuri", target: "reports",
    status: "blue", readiness: 97, queueDepth: 13,
    automation: "ops.fabric.stock-to-reports.sync",
    dataContract: "stock-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "150ms control-plane / 3m ops lane"
  },
  {
    id: "pontaj-to-reports", name: "Pontaj metrics → Reports", summary: "Presence, overtime and leave metrics feed dashboards", source: "pontaj", target: "reports",
    status: "amber", readiness: 70, queueDepth: 1,
    automation: "ops.fabric.pontaj-to-reports.sync",
    dataContract: "pontaj-to-reports.contract.v1",
    auditRule: "require before/after + actor + sourceModule + targetModule",
    rollbackRule: "replay last valid snapshot and mark incident if parity fails",
    sla: "200ms control-plane / 4m ops lane"
  }
];

const dataContracts: FabricDataContract[] = [
  {
    id: "task.contract", entity: "Task", version: "v1", status: "shadow", readiness: 69,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "D1"
  },
  {
    id: "project.contract", entity: "Project", version: "v1", status: "planned", readiness: 73,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "R2"
  },
  {
    id: "stockitem.contract", entity: "StockItem", version: "v1", status: "locked", readiness: 77,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Google Sheets bridge"
  },
  {
    id: "reservation.contract", entity: "Reservation", version: "v1", status: "ready", readiness: 81,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Audit Ledger"
  },
  {
    id: "pontajsession.contract", entity: "PontajSession", version: "v1", status: "shadow", readiness: 85,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Prisma"
  },
  {
    id: "leaverequest.contract", entity: "LeaveRequest", version: "v1", status: "planned", readiness: 89,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "D1"
  },
  {
    id: "auditevent.contract", entity: "AuditEvent", version: "v1", status: "locked", readiness: 93,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "R2"
  },
  {
    id: "admincommand.contract", entity: "AdminCommand", version: "v1", status: "ready", readiness: 97,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Google Sheets bridge"
  },
  {
    id: "prismawrite.contract", entity: "PrismaWrite", version: "v1", status: "shadow", readiness: 66,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Audit Ledger"
  },
  {
    id: "mobileaction.contract", entity: "MobileAction", version: "v1", status: "planned", readiness: 70,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "Prisma"
  },
  {
    id: "client.contract", entity: "Client", version: "v1", status: "locked", readiness: 74,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: true, rollbackSnapshot: true,
    persistenceTarget: "D1"
  },
  {
    id: "offer.contract", entity: "Offer", version: "v1", status: "ready", readiness: 78,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: true, rollbackSnapshot: false,
    persistenceTarget: "R2"
  },
  {
    id: "purchaserequest.contract", entity: "PurchaseRequest", version: "v1", status: "shadow", readiness: 82,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: true, rollbackSnapshot: false,
    persistenceTarget: "Google Sheets bridge"
  },
  {
    id: "documentevidence.contract", entity: "DocumentEvidence", version: "v1", status: "planned", readiness: 86,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "Audit Ledger"
  },
  {
    id: "iotalert.contract", entity: "IoTAlert", version: "v1", status: "locked", readiness: 90,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "Prisma"
  },
  {
    id: "reportpack.contract", entity: "ReportPack", version: "v1", status: "ready", readiness: 94,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "D1"
  },
  {
    id: "notification.contract", entity: "Notification", version: "v1", status: "shadow", readiness: 98,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "R2"
  },
  {
    id: "globalsearchrecord.contract", entity: "GlobalSearchRecord", version: "v1", status: "planned", readiness: 67,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "Google Sheets bridge"
  },
  {
    id: "workloadcapacity.contract", entity: "WorkloadCapacity", version: "v1", status: "locked", readiness: 71,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: false, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "Audit Ledger"
  },
  {
    id: "incident.contract", entity: "Incident", version: "v1", status: "ready", readiness: 75,
    fields: ["id", "tenantId", "actorId", "sourceModule", "status", "createdAt", "updatedAt"],
    requiredAudit: true, requiredRbac: false, rollbackSnapshot: false,
    persistenceTarget: "Prisma"
  }
];

const automations: FabricAutomation[] = [
  {
    id: "auto-01", title: "Automation lane 01 · proiecte to stocuri",
    trigger: "SLA breach",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["proiecte", "stocuri", "audit"], status: "blue", readiness: 66,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-02", title: "Automation lane 02 · stocuri to audit",
    trigger: "stock shortage",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["stocuri", "audit", "audit"], status: "amber", readiness: 68,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-03", title: "Automation lane 03 · pontaj to database",
    trigger: "RBAC deny spike",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["pontaj", "database", "audit"], status: "shadow", readiness: 70,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-04", title: "Automation lane 04 · audit to crm",
    trigger: "missing audit",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["audit", "crm", "audit"], status: "green", readiness: 72,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-05", title: "Automation lane 05 · adminControls to achizitii",
    trigger: "mobile offline sync",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["adminControls", "achizitii", "audit"], status: "blue", readiness: 74,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-06", title: "Automation lane 06 · database to iotOps",
    trigger: "project milestone drift",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["database", "iotOps", "audit"], status: "amber", readiness: 76,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-07", title: "Automation lane 07 · mobile to taskuri",
    trigger: "pontaj capacity change",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["mobile", "taskuri", "audit"], status: "shadow", readiness: 78,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-08", title: "Automation lane 08 · crm to stocuri",
    trigger: "daily digest",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["crm", "stocuri", "audit"], status: "green", readiness: 80,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-09", title: "Automation lane 09 · ofertare to audit",
    trigger: "SLA breach",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["ofertare", "audit", "audit"], status: "blue", readiness: 82,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-10", title: "Automation lane 10 · achizitii to database",
    trigger: "stock shortage",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["achizitii", "database", "audit"], status: "amber", readiness: 84,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-11", title: "Automation lane 11 · documente to crm",
    trigger: "RBAC deny spike",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["documente", "crm", "audit"], status: "shadow", readiness: 86,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-12", title: "Automation lane 12 · iotOps to achizitii",
    trigger: "missing audit",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["iotOps", "achizitii", "audit"], status: "green", readiness: 88,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-13", title: "Automation lane 13 · reports to iotOps",
    trigger: "mobile offline sync",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["reports", "iotOps", "audit"], status: "blue", readiness: 90,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-14", title: "Automation lane 14 · taskuri to taskuri",
    trigger: "project milestone drift",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["taskuri", "taskuri", "audit"], status: "amber", readiness: 92,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-15", title: "Automation lane 15 · proiecte to stocuri",
    trigger: "pontaj capacity change",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["proiecte", "stocuri", "audit"], status: "shadow", readiness: 94,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-16", title: "Automation lane 16 · stocuri to audit",
    trigger: "daily digest",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["stocuri", "audit", "audit"], status: "green", readiness: 96,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-17", title: "Automation lane 17 · pontaj to database",
    trigger: "SLA breach",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["pontaj", "database", "audit"], status: "blue", readiness: 98,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-18", title: "Automation lane 18 · audit to crm",
    trigger: "stock shortage",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["audit", "crm", "audit"], status: "amber", readiness: 65,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-19", title: "Automation lane 19 · adminControls to achizitii",
    trigger: "RBAC deny spike",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["adminControls", "achizitii", "audit"], status: "shadow", readiness: 67,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-20", title: "Automation lane 20 · database to iotOps",
    trigger: "missing audit",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["database", "iotOps", "audit"], status: "green", readiness: 69,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-21", title: "Automation lane 21 · mobile to taskuri",
    trigger: "mobile offline sync",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["mobile", "taskuri", "audit"], status: "blue", readiness: 71,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-22", title: "Automation lane 22 · crm to stocuri",
    trigger: "project milestone drift",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["crm", "stocuri", "audit"], status: "amber", readiness: 73,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-23", title: "Automation lane 23 · ofertare to audit",
    trigger: "pontaj capacity change",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["ofertare", "audit", "audit"], status: "shadow", readiness: 75,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-24", title: "Automation lane 24 · achizitii to database",
    trigger: "daily digest",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["achizitii", "database", "audit"], status: "green", readiness: 77,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-25", title: "Automation lane 25 · documente to crm",
    trigger: "SLA breach",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["documente", "crm", "audit"], status: "blue", readiness: 79,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-26", title: "Automation lane 26 · iotOps to achizitii",
    trigger: "stock shortage",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["iotOps", "achizitii", "audit"], status: "amber", readiness: 81,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-27", title: "Automation lane 27 · reports to iotOps",
    trigger: "RBAC deny spike",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["reports", "iotOps", "audit"], status: "shadow", readiness: 83,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-28", title: "Automation lane 28 · taskuri to taskuri",
    trigger: "missing audit",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["taskuri", "taskuri", "audit"], status: "green", readiness: 85,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-29", title: "Automation lane 29 · proiecte to stocuri",
    trigger: "mobile offline sync",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["proiecte", "stocuri", "audit"], status: "blue", readiness: 87,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-30", title: "Automation lane 30 · stocuri to audit",
    trigger: "project milestone drift",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["stocuri", "audit", "audit"], status: "amber", readiness: 89,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-31", title: "Automation lane 31 · pontaj to database",
    trigger: "pontaj capacity change",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["pontaj", "database", "audit"], status: "shadow", readiness: 91,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-32", title: "Automation lane 32 · audit to crm",
    trigger: "daily digest",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["audit", "crm", "audit"], status: "green", readiness: 93,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-33", title: "Automation lane 33 · adminControls to achizitii",
    trigger: "SLA breach",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["adminControls", "achizitii", "audit"], status: "blue", readiness: 95,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-34", title: "Automation lane 34 · database to iotOps",
    trigger: "stock shortage",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["database", "iotOps", "audit"], status: "amber", readiness: 97,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-35", title: "Automation lane 35 · mobile to taskuri",
    trigger: "RBAC deny spike",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["mobile", "taskuri", "audit"], status: "shadow", readiness: 64,
    guardrail: "never mutate production without explicit gate + audit envelope"
  },
  {
    id: "auto-36", title: "Automation lane 36 · crm to stocuri",
    trigger: "missing audit",
    action: "create operational signal, attach evidence and notify owner",
    modules: ["crm", "stocuri", "audit"], status: "green", readiness: 66,
    guardrail: "never mutate production without explicit gate + audit envelope"
  }
];

const incidents: FabricIncidentCommand[] = [
  { id: "incident-1", label: "Global kill switch", severity: "critical", status: "ready",
    command: "workos incident global-kill-switch", owner: "Operations Lead",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-2", label: "Freeze rollout wave", severity: "medium", status: "locked",
    command: "workos incident freeze-rollout-wave", owner: "Security / RBAC",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-3", label: "Isolate module writes", severity: "high", status: "guarded",
    command: "workos incident isolate-module-writes", owner: "Database Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-4", label: "Read-only mode", severity: "critical", status: "ready",
    command: "workos incident read-only-mode", owner: "Platform Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-5", label: "Quarantine mutation class", severity: "medium", status: "locked",
    command: "workos incident quarantine-mutation-class", owner: "Operations Lead",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-6", label: "Rollback last mutation batch", severity: "high", status: "guarded",
    command: "workos incident rollback-last-mutation-batch", owner: "Security / RBAC",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-7", label: "Escalate RBAC anomaly", severity: "critical", status: "ready",
    command: "workos incident escalate-rbac-anomaly", owner: "Database Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-8", label: "Audit evidence missing", severity: "medium", status: "locked",
    command: "workos incident audit-evidence-missing", owner: "Platform Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-9", label: "Database parity failure", severity: "high", status: "guarded",
    command: "workos incident database-parity-failure", owner: "Operations Lead",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-10", label: "Mobile queue overflow", severity: "critical", status: "ready",
    command: "workos incident mobile-queue-overflow", owner: "Security / RBAC",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-11", label: "Stock reservation drift", severity: "medium", status: "locked",
    command: "workos incident stock-reservation-drift", owner: "Database Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" },
  { id: "incident-12", label: "Pontaj capacity anomaly", severity: "high", status: "guarded",
    command: "workos incident pontaj-capacity-anomaly", owner: "Platform Owner",
    response: "capture evidence, freeze affected lane, notify owner, require post-incident note", rollback: "restore last valid snapshot or disable affected write lane" }
];

const risks: FabricRisk[] = [
  { id: "risk-1", title: "Cross-module source-of-truth conflict", severity: "high", probability: "medium",
    module: "proiecte", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "monitoring" },
  { id: "risk-2", title: "Stock reservation drift", severity: "critical", probability: "high",
    module: "stocuri", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "controlled" },
  { id: "risk-3", title: "Pontaj sheet bridge latency", severity: "low", probability: "low",
    module: "pontaj", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "blocked" },
  { id: "risk-4", title: "RBAC role mismatch", severity: "medium", probability: "medium",
    module: "audit", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "open" },
  { id: "risk-5", title: "Missing audit event", severity: "high", probability: "high",
    module: "adminControls", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "monitoring" },
  { id: "risk-6", title: "Mobile offline duplicate", severity: "critical", probability: "low",
    module: "database", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "controlled" },
  { id: "risk-7", title: "Prisma/D1 parity mismatch", severity: "low", probability: "medium",
    module: "mobile", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "blocked" },
  { id: "risk-8", title: "Project budget adapter missing", severity: "medium", probability: "high",
    module: "crm", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "open" },
  { id: "risk-9", title: "CRM duplicate client", severity: "high", probability: "low",
    module: "ofertare", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "monitoring" },
  { id: "risk-10", title: "Offer/BOM version mismatch", severity: "critical", probability: "medium",
    module: "achizitii", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "controlled" },
  { id: "risk-11", title: "Hard delete attempt", severity: "low", probability: "high",
    module: "documente", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "blocked" },
  { id: "risk-12", title: "Unreviewed admin command", severity: "medium", probability: "low",
    module: "iotOps", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "open" },
  { id: "risk-13", title: "IoT false positive alert", severity: "high", probability: "medium",
    module: "reports", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "monitoring" },
  { id: "risk-14", title: "Report export stale data", severity: "critical", probability: "high",
    module: "taskuri", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "controlled" },
  { id: "risk-15", title: "Notification fatigue", severity: "low", probability: "low",
    module: "proiecte", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "blocked" },
  { id: "risk-16", title: "Global search stale index", severity: "medium", probability: "medium",
    module: "stocuri", mitigation: "guarded bridge, audit evidence, parity check, owner review", status: "open" }
];

const rbac: FabricRbacRule[] = [
  { role: "Admin", allowedActions: ["read", "create", "update", "status-change", "assign", "approve", "rollback", "export", "admin-command", "delete-request"], deniedActions: [],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "Manager", allowedActions: ["read", "create", "update", "status-change", "assign", "approve", "rollback", "export", "admin-command", "delete-request"], deniedActions: [],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "Engineer", allowedActions: ["read", "create", "update", "status-change", "assign", "approve", "rollback", "export", "admin-command", "delete-request"], deniedActions: [],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "Technician", allowedActions: ["read", "update", "status-change"], deniedActions: ["create", "assign", "approve", "rollback", "export", "admin-command", "delete-request"],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "Warehouse", allowedActions: ["read", "update", "approve", "export"], deniedActions: ["create", "status-change", "assign", "rollback", "admin-command", "delete-request"],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "HR Ops", allowedActions: ["read", "update", "export"], deniedActions: ["create", "status-change", "assign", "approve", "rollback", "admin-command", "delete-request"],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "Viewer", allowedActions: ["read", "export"], deniedActions: ["create", "update", "status-change", "assign", "approve", "rollback", "admin-command", "delete-request"],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" },
  { role: "External Auditor", allowedActions: ["read", "export"], deniedActions: ["create", "update", "status-change", "assign", "approve", "rollback", "admin-command", "delete-request"],
    scope: "tenant + module + ownership + wave", evidence: "RBAC decision must be included in audit envelope" }
];

const runbooks: FabricRunbook[] = [
  { id: "runbook-1", title: "Morning operational readiness", owner: "Platform Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-2", title: "Cross-module incident response", owner: "Warehouse Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-3", title: "Stock shortage to task blocker", owner: "HR Ops",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-4", title: "Pontaj capacity sync", owner: "Security / Compliance",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-5", title: "Project milestone drift", owner: "Operations Lead",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-6", title: "Mobile offline queue reconciliation", owner: "Platform Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-7", title: "Prisma parity check", owner: "Warehouse Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-8", title: "Audit evidence export", owner: "HR Ops",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-9", title: "Admin command approval", owner: "Security / Compliance",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-10", title: "Rollback drill", owner: "Operations Lead",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-11", title: "End-of-day management digest", owner: "Platform Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" },
  { id: "runbook-12", title: "Weekly GA review", owner: "Warehouse Owner",
    steps: ["Open command center", "Review evidence and affected modules", "Run health endpoint", "Approve guarded action or keep read-only", "Record outcome"],
    evidence: "command-center snapshot + audit envelope + owner note" }
];

const commandActions: FabricCommandAction[] = [
  { id: "global-kill", label: "Global kill-switch", command: "workosctl kill --scope all-writes", module: "global", state: "guarded", requiresApproval: true, evidence: "Incident + owner approval + timestamp" },
  { id: "freeze-wave", label: "Freeze rollout wave", command: "workosctl wave freeze --active", module: "global", state: "guarded", requiresApproval: true, evidence: "Wave id + reason + rollback note" },
  { id: "readonly", label: "Read-only mode", command: "workosctl mode readonly --tenant servelect", module: "global", state: "ready", requiresApproval: true, evidence: "Read-only evidence envelope" },
  { id: "task-write-off", label: "Disable task writes", command: "workosctl task writes off", module: "taskuri", state: "ready", requiresApproval: true, evidence: "Task write-gate evidence" },
  { id: "stock-freeze", label: "Freeze stock reservations", command: "workosctl stock reservation freeze", module: "stocuri", state: "guarded", requiresApproval: true, evidence: "Stock reservation snapshot" },
  { id: "pontaj-sync-pause", label: "Pause pontaj sync", command: "workosctl pontaj sync pause", module: "pontaj", state: "shadow", requiresApproval: true, evidence: "Pontaj bridge state" },
  { id: "audit-export", label: "Export evidence pack", command: "workosctl audit export --range today", module: "audit", state: "ready", requiresApproval: false, evidence: "Export checksum" },
  { id: "mobile-queue-drain", label: "Drain mobile offline queue", command: "workosctl mobile queue drain --safe", module: "mobile", state: "shadow", requiresApproval: true, evidence: "Queue before/after" },
  { id: "project-risk-refresh", label: "Refresh project risk scoring", command: "workosctl project risk refresh", module: "proiecte", state: "guarded", requiresApproval: false, evidence: "Risk score diff" },
  { id: "db-parity", label: "Run DB parity check", command: "workosctl db parity --task-project-stock", module: "database", state: "ready", requiresApproval: false, evidence: "Parity report" },
  { id: "iot-alert-quarantine", label: "Quarantine noisy IoT alert", command: "workosctl iot alert quarantine", module: "iotOps", state: "shadow", requiresApproval: true, evidence: "Alert sample + owner note" },
  { id: "report-pack", label: "Generate management report pack", command: "workosctl reports generate --ops", module: "reports", state: "guarded", requiresApproval: false, evidence: "Report pack id" }
];

const executiveReadiness: FabricExecutiveLane[] = [
  { id: "web", title: "Website/Web App", completion: readiness.websiteWebApp, owner: "Platform Owner", evidence: "Vercel build + admin dashboards + command center", nextDecision: "Keep platform pages production visible" },
  { id: "core", title: "Task & Project Core", completion: readiness.taskProjectCore, owner: "Operations Lead", evidence: "Task writes gates + project flow contracts", nextDecision: "Enable real cross-module bridge in v5" },
  { id: "api", title: "Backend/API", completion: readiness.backendApi, owner: "Backend Owner", evidence: "40+ enterprise endpoints and health manifests", nextDecision: "Stabilize real connectors" },
  { id: "db", title: "Database/Prisma/Seed", completion: readiness.databasePrismaSeed, owner: "Database Owner", evidence: "Prisma write gates + parity contracts", nextDecision: "Activate adapter per module" },
  { id: "rbac", title: "Auth/RBAC", completion: readiness.authRbac, owner: "Security / RBAC", evidence: "Role/action matrix + command approval rules", nextDecision: "Bind to real users and sessions" },
  { id: "iot", title: "IoT/Ops", completion: readiness.iotOps, owner: "IoT Operations", evidence: "IoT flow and telemetry contracts", nextDecision: "Connect real site telemetry source" },
  { id: "mobile", title: "Mobile App", completion: readiness.mobileApp, owner: "Field Operations", evidence: "Mobile offline queue and incident acknowledgement contracts", nextDecision: "Build field UX and queue persistence" }
];

const roadmap: FabricRoadmapItem[] = [
  { version: "v5.0.0", title: "Real Cross-Module Data Bridge Activation", impact: "critical", outcome: "Connect real adapters for tasks, projects, stock, pontaj and audit with guarded read/write lanes.", required: ["adapter credentials", "source-of-truth decision", "rollback plan", "owner signoff"] },
  { version: "v5.1.0", title: "Unified Operations Console GA", impact: "platform", outcome: "One operations console for daily dispatch, incidents, shortages, capacity and project execution.", required: ["ops workflows", "management report templates", "admin command approvals"] },
  { version: "v5.2.0", title: "Mobile Field Operations Offline Queue", impact: "platform", outcome: "Technicians can work offline, sync actions, acknowledge incidents and update task/pontaj context.", required: ["mobile storage", "conflict resolver", "field UI"] },
  { version: "v5.3.0", title: "Inventory and Procurement Real Bridge", impact: "major", outcome: "Stock, reservations, purchase requests and supplier orders become operationally connected.", required: ["D1 schema", "reservation rules", "supplier adapter"] },
  { version: "v5.4.0", title: "Pontaj Capacity and Project Labor Intelligence", impact: "major", outcome: "Attendance, leave and workload feed planning and project staffing risk.", required: ["Pontaj API bridge", "capacity algorithm", "employee mapping"] }
];

export function getWorkOsOperationsFabric(): WorkOsOperationsFabricRelease {
  return {
    ok: true,
    version: "4.9.0",
    name: "Unified Work OS Real Cross-Module Data Bridge & Operations Fabric",
    generatedAt: new Date().toISOString(),
    productionWrites: "env-gated",
    summary: "A platform-scale release that expands the command center into a Work OS operations fabric across tasks, projects, stock, pontaj, audit, admin controls, database, mobile, CRM, offers, procurement, documents, IoT and reporting. It is intentionally env-gated for real writes and designed as the bridge to v5 real adapters.",
    readiness,
    metrics,
    modules,
    connectors,
    flows,
    dataContracts,
    automations,
    incidents,
    risks,
    rbac,
    runbooks,
    commandActions,
    executiveReadiness,
    roadmap
  };
}

export const getWorkOsOperationsFabricHealth = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, generatedAt: r.generatedAt, productionWrites: r.productionWrites, readiness: r.readiness, metrics: r.metrics, moduleCount: r.modules.length, connectorCount: r.connectors.length, flowCount: r.flows.length, automationCount: r.automations.length }; };
export const getWorkOsOperationsFabricModules = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, modules: r.modules }; };
export const getWorkOsOperationsFabricConnectors = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, connectors: r.connectors }; };
export const getWorkOsOperationsFabricFlows = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, flows: r.flows }; };
export const getWorkOsOperationsFabricContracts = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, dataContracts: r.dataContracts }; };
export const getWorkOsOperationsFabricAutomations = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, automations: r.automations }; };
export const getWorkOsOperationsFabricIncidents = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, incidents: r.incidents }; };
export const getWorkOsOperationsFabricRisks = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, risks: r.risks }; };
export const getWorkOsOperationsFabricRbac = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, rbac: r.rbac }; };
export const getWorkOsOperationsFabricRunbooks = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, runbooks: r.runbooks }; };
export const getWorkOsOperationsFabricCommands = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, commandActions: r.commandActions }; };
export const getWorkOsOperationsFabricExecutive = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, readiness: r.readiness, executiveReadiness: r.executiveReadiness }; };
export const getWorkOsOperationsFabricRoadmap = () => { const r = getWorkOsOperationsFabric(); return { ok: true, version: r.version, roadmap: r.roadmap }; };
