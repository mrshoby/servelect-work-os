import {
  approvals,
  inventory,
  iotAlerts,
  maintenanceTickets,
  projects,
  tasks,
  users
} from "@servelect/shared";

export type V57AdapterKind = "mock" | "local-storage" | "api-route" | "prisma" | "external";
export type V57AdapterStatus = "active" | "shadow" | "ready" | "blocked" | "planned";
export type V57WriteMode = "read-only" | "shadow" | "queued" | "enabled";
export type V57Domain = "tasks" | "projects" | "pontaj" | "materials" | "approvals" | "iot" | "maintenance" | "users" | "documents" | "reports";
export type V57MutationVerb = "create" | "update" | "move" | "comment" | "attach" | "approve" | "reserve" | "close" | "sync";

export type V57DataAdapter = {
  id: string;
  title: string;
  kind: V57AdapterKind;
  status: V57AdapterStatus;
  writeMode: V57WriteMode;
  domains: V57Domain[];
  source: string;
  target: string;
  coverage: number;
  latencyMs: number;
  risk: "low" | "medium" | "high";
  owner: string;
  evidence: string;
  nextAction: string;
};

export type V57MutationContract = {
  id: string;
  domain: V57Domain;
  verb: V57MutationVerb;
  title: string;
  route: string;
  adapter: string;
  writeMode: V57WriteMode;
  rollback: string;
  auditEvent: string;
  requiredPermission: string;
  status: V57AdapterStatus;
};

export type V57MutationQueueItem = {
  id: string;
  domain: V57Domain;
  title: string;
  payloadSummary: string;
  adapter: string;
  status: "queued" | "shadowed" | "validated" | "blocked" | "ready";
  actor: string;
  createdAt: string;
  safety: string;
};

export type V57SourceMap = {
  domain: V57Domain;
  records: number;
  primarySource: string;
  fallbackSource: string;
  writeGate: V57WriteMode;
  apiRoute: string;
  prismaModel: string;
  readiness: number;
};

const writeMode = (process.env.SERVELECT_WORK_OS_WRITE_MODE as V57WriteMode | undefined) ?? "shadow";
const prismaEnabled = Boolean(process.env.DATABASE_URL);

export const v57Adapters: V57DataAdapter[] = [
  {
    id: "adapter-mock-workos",
    title: "Shared mock data foundation",
    kind: "mock",
    status: "active",
    writeMode: "read-only",
    domains: ["tasks", "projects", "materials", "approvals", "iot", "maintenance", "users"],
    source: "packages/shared/src/mock-data.ts",
    target: "apps/web Work OS UI",
    coverage: 96,
    latencyMs: 12,
    risk: "low",
    owner: "Product Engineering",
    evidence: `${tasks.length} taskuri, ${projects.length} proiecte, ${users.length} utilizatori, ${approvals.length} aprobari si ${inventory.length} linii de stoc disponibile pentru UI.`,
    nextAction: "Ramane fallback controlat pentru demo, training si preview inainte de productie."
  },
  {
    id: "adapter-local-records",
    title: "Local persistent records bridge",
    kind: "local-storage",
    status: "ready",
    writeMode: "queued",
    domains: ["tasks", "projects", "pontaj", "approvals", "materials"],
    source: "Zustand/localStorage client state",
    target: "Mutation queue + activity comments",
    coverage: 82,
    latencyMs: 20,
    risk: "low",
    owner: "Frontend Platform",
    evidence: "v5.6 a introdus persistent records, inline editing si activity comments in mod local/shadow-safe.",
    nextAction: "Sincronizeaza queue-ul local cu adapterul Prisma dupa activarea write gate."
  },
  {
    id: "adapter-next-api",
    title: "Next.js route handlers API facade",
    kind: "api-route",
    status: "ready",
    writeMode: writeMode === "enabled" ? "enabled" : "shadow",
    domains: ["tasks", "projects", "materials", "approvals", "iot", "maintenance", "reports"],
    source: "/api/v1/work-os/*",
    target: "Web/Mobile clients + Vercel runtime",
    coverage: 78,
    latencyMs: 48,
    risk: writeMode === "enabled" ? "medium" : "low",
    owner: "Backend API",
    evidence: "API facade separa UI-ul de sursa reala si permite audit pe fiecare mutatie.",
    nextAction: "Leaga fiecare POST de contracte de mutatie cu audit si rollback."
  },
  {
    id: "adapter-prisma-postgres",
    title: "Prisma/PostgreSQL source-of-truth",
    kind: "prisma",
    status: prismaEnabled ? "shadow" : "blocked",
    writeMode: prismaEnabled && writeMode === "enabled" ? "enabled" : "shadow",
    domains: ["tasks", "projects", "pontaj", "materials", "approvals", "users", "documents"],
    source: "PostgreSQL + Prisma ORM",
    target: "Real enterprise source-of-truth",
    coverage: prismaEnabled ? 68 : 38,
    latencyMs: prismaEnabled ? 76 : 0,
    risk: writeMode === "enabled" ? "high" : "medium",
    owner: "Data Platform",
    evidence: prismaEnabled ? "DATABASE_URL prezent: adapterul poate rula in shadow/controlled mode." : "DATABASE_URL lipseste: adapterul ramane blocat pentru scrieri reale.",
    nextAction: "v5.8 poate activa cutover controlat dupa seed, migration audit si parity checks."
  },
  {
    id: "adapter-external-ops",
    title: "External operational connectors",
    kind: "external",
    status: "planned",
    writeMode: "read-only",
    domains: ["iot", "maintenance", "materials", "reports"],
    source: "MQTT/Modbus, Cloudflare D1/R2, ERP/e-Factura, SPV/ANAF",
    target: "Task/ticket generation + operational evidence",
    coverage: 42,
    latencyMs: 120,
    risk: "medium",
    owner: "Operations Integrations",
    evidence: `${iotAlerts.length} alerte IoT si ${maintenanceTickets.length} tickete pot genera taskuri/actiuni in Work OS.`,
    nextAction: "Introdu conectori reali pe rand, fiecare prin switchboard si write gate."
  }
];

export const v57MutationContracts: V57MutationContract[] = [
  {
    id: "mut-task-status",
    domain: "tasks",
    verb: "update",
    title: "Update task status / priority / assignee",
    route: "/api/v1/work-os/data-switchboard/mutations",
    adapter: "adapter-next-api",
    writeMode,
    rollback: "Restore previous task snapshot and append rollback audit event.",
    auditEvent: "workos.task.updated",
    requiredPermission: "task:write",
    status: "ready"
  },
  {
    id: "mut-task-comment",
    domain: "tasks",
    verb: "comment",
    title: "Add task activity comment",
    route: "/api/v1/work-os/data-switchboard/mutations",
    adapter: "adapter-local-records",
    writeMode: "queued",
    rollback: "Mark comment as retracted and keep immutable audit trace.",
    auditEvent: "workos.task.comment_added",
    requiredPermission: "task:comment",
    status: "ready"
  },
  {
    id: "mut-material-reserve",
    domain: "materials",
    verb: "reserve",
    title: "Reserve material for project/task",
    route: "/api/v1/work-os/data-switchboard/mutations",
    adapter: "adapter-next-api",
    writeMode: writeMode === "enabled" ? "enabled" : "shadow",
    rollback: "Release reservation and restore previous available/reserved quantities.",
    auditEvent: "workos.material.reserved",
    requiredPermission: "materials:reserve",
    status: "shadow"
  },
  {
    id: "mut-approval-decision",
    domain: "approvals",
    verb: "approve",
    title: "Approve/reject offer, pontaj or material request",
    route: "/api/v1/work-os/data-switchboard/mutations",
    adapter: "adapter-next-api",
    writeMode: writeMode === "enabled" ? "enabled" : "shadow",
    rollback: "Create reversal approval event; original decision remains auditable.",
    auditEvent: "workos.approval.decided",
    requiredPermission: "approval:decide",
    status: "ready"
  },
  {
    id: "mut-iot-ticket",
    domain: "iot",
    verb: "create",
    title: "Create maintenance ticket from IoT alert",
    route: "/api/v1/work-os/data-switchboard/mutations",
    adapter: "adapter-external-ops",
    writeMode: "shadow",
    rollback: "Close generated ticket as duplicate and retain IoT source evidence.",
    auditEvent: "workos.iot.ticket_created",
    requiredPermission: "maintenance:write",
    status: "planned"
  }
];

export const v57SourceMaps: V57SourceMap[] = [
  { domain: "tasks", records: tasks.length, primarySource: "Task API facade", fallbackSource: "@servelect/shared.tasks", writeGate: writeMode, apiRoute: "/api/v1/work-os/data-switchboard/mutations", prismaModel: "Task", readiness: 84 },
  { domain: "projects", records: projects.length, primarySource: "Project API facade", fallbackSource: "@servelect/shared.projects", writeGate: writeMode, apiRoute: "/api/v1/work-os/projects", prismaModel: "Project", readiness: 80 },
  { domain: "materials", records: inventory.length, primarySource: "Materials planning facade", fallbackSource: "@servelect/shared.inventory", writeGate: writeMode === "enabled" ? "enabled" : "shadow", apiRoute: "/api/v1/work-os/stock", prismaModel: "InventoryItem", readiness: 72 },
  { domain: "approvals", records: approvals.length, primarySource: "Approval queue facade", fallbackSource: "@servelect/shared.approvals", writeGate: writeMode, apiRoute: "/api/v1/work-os/approvals", prismaModel: "ApprovalRequest", readiness: 76 },
  { domain: "iot", records: iotAlerts.length, primarySource: "IoT alert facade", fallbackSource: "@servelect/shared.iotAlerts", writeGate: "read-only", apiRoute: "/api/v1/work-os/operations", prismaModel: "IoTAlert", readiness: 58 },
  { domain: "maintenance", records: maintenanceTickets.length, primarySource: "Field ops ticket facade", fallbackSource: "@servelect/shared.maintenanceTickets", writeGate: writeMode === "enabled" ? "enabled" : "shadow", apiRoute: "/api/v1/work-os/field-ops", prismaModel: "MaintenanceTicket", readiness: 64 },
  { domain: "users", records: users.length, primarySource: "RBAC/Auth facade", fallbackSource: "@servelect/shared.users", writeGate: "read-only", apiRoute: "/api/v1/auth/users", prismaModel: "User", readiness: 70 }
];

export const v57MutationQueue: V57MutationQueueItem[] = [
  {
    id: "queue-001",
    domain: "tasks",
    title: "Bulk move urgent field tasks to In lucru",
    payloadSummary: "3 taskuri teren, assignee Mihai Ionescu, status In lucru",
    adapter: "adapter-next-api",
    status: writeMode === "enabled" ? "ready" : "shadowed",
    actor: "Andrei Popescu",
    createdAt: "2026-06-08T08:45:00.000Z",
    safety: "Shadow payload generated; real write requires SERVELECT_WORK_OS_WRITE_MODE=enabled."
  },
  {
    id: "queue-002",
    domain: "materials",
    title: "Reserve inverter and mounting kit for P-2024-0187",
    payloadSummary: "Invertor Huawei + sistem prindere, linked to task t3",
    adapter: "adapter-next-api",
    status: "validated",
    actor: "Alexandra Rusu",
    createdAt: "2026-06-08T08:47:00.000Z",
    safety: "Reservation is reversible before stock ledger cutover."
  },
  {
    id: "queue-003",
    domain: "approvals",
    title: "Approve pontaj overtime proposal",
    payloadSummary: "Cristian Radu, 2.5h extra, linked to Racordare AC",
    adapter: "adapter-local-records",
    status: "queued",
    actor: "Ioana Marinescu",
    createdAt: "2026-06-08T08:51:00.000Z",
    safety: "Queued locally; payroll export remains disabled until manager approval."
  },
  {
    id: "queue-004",
    domain: "iot",
    title: "Create ticket from inverter offline alarm",
    payloadSummary: "Alert IoT P-2024-0098 -> ticket mentenanta urgent",
    adapter: "adapter-external-ops",
    status: "blocked",
    actor: "System IoT",
    createdAt: "2026-06-08T08:55:00.000Z",
    safety: "External connector not enabled; task preview only."
  }
];

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length));
}

export function getV57DataSwitchboard() {
  const activeAdapters = v57Adapters.filter((adapter) => adapter.status === "active" || adapter.status === "ready" || adapter.status === "shadow").length;
  const readyMutations = v57MutationContracts.filter((item) => item.status === "ready" || item.status === "shadow").length;
  const blockedQueue = v57MutationQueue.filter((item) => item.status === "blocked").length;
  const readiness = average([
    average(v57Adapters.map((adapter) => adapter.coverage)),
    average(v57SourceMaps.map((source) => source.readiness)),
    Math.round((readyMutations / v57MutationContracts.length) * 100),
    blockedQueue === 0 ? 100 : 82
  ]);

  return {
    version: "5.7.0",
    title: "Real Database Adapter Switchboard & Record Mutations",
    generatedAt: new Date().toISOString(),
    writeMode,
    prismaEnabled,
    ok: blockedQueue <= 1,
    readiness,
    summary: {
      adapters: v57Adapters.length,
      activeAdapters,
      mutationContracts: v57MutationContracts.length,
      readyMutations,
      queuedMutations: v57MutationQueue.length,
      blockedQueue,
      sourceMaps: v57SourceMaps.length,
      linkedRecords: tasks.length + projects.length + approvals.length + inventory.length + iotAlerts.length + maintenanceTickets.length
    },
    adapters: v57Adapters,
    sourceMaps: v57SourceMaps,
    mutationContracts: v57MutationContracts,
    mutationQueue: v57MutationQueue,
    nextRecommendedVersion: {
      version: "5.8.0",
      title: "Controlled Prisma Cutover, Seed Parity & Live Mutation Audit",
      focus: "Activeaza adapterul Prisma gradual, verifica seed/parity, mutatii reale pe task/proiect/material cu rollback si audit persistent."
    }
  };
}

export function createV57ShadowMutation(input: Partial<V57MutationQueueItem> & { title: string; domain: V57Domain }) {
  const now = new Date().toISOString();
  return {
    accepted: true,
    persisted: writeMode === "enabled",
    mode: writeMode,
    mutation: {
      id: `queue-${Date.now()}`,
      domain: input.domain,
      title: input.title,
      payloadSummary: input.payloadSummary ?? "Shadow mutation created from Work OS switchboard.",
      adapter: input.adapter ?? "adapter-next-api",
      status: writeMode === "enabled" ? "ready" : "shadowed",
      actor: input.actor ?? "System",
      createdAt: now,
      safety: writeMode === "enabled" ? "Write mode enabled: persist only after adapter policy passes." : "Shadow-safe: no production write executed."
    } satisfies V57MutationQueueItem,
    audit: {
      event: "workos.v57.shadow_mutation_created",
      createdAt: now,
      writeMode,
      rollbackAvailable: true
    }
  };
}
