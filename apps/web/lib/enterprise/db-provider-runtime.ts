export type DbProviderMode = "mock-memory" | "prisma-shadow" | "prisma-active";
export type DbProviderStatus = "ready" | "partial" | "mock" | "blocked";
export type DbProviderRisk = "low" | "medium" | "high" | "critical";
export type DbProviderGate = "passed" | "active" | "next" | "blocked";

export type DbProviderLayer = {
  id: string;
  label: string;
  status: DbProviderStatus;
  readiness: number;
  risk: DbProviderRisk;
  owner: string;
  purpose: string;
  currentProvider: DbProviderMode;
  targetProvider: DbProviderMode;
  evidence: string;
  nextActions: string[];
};

export type DbRuntimeEntity = {
  id: string;
  label: string;
  table: string;
  status: DbProviderStatus;
  readiness: number;
  apiSurface: string[];
  prismaModel: string;
  migrationStep: string;
};

export type DbProviderSafetyGate = {
  id: string;
  label: string;
  status: DbProviderGate;
  requiredFor: "shadow" | "active" | "production";
  evidence: string;
};

const providerMode = (process.env.SERVELECT_DATA_PROVIDER as DbProviderMode | undefined) ?? "mock-memory";
const databaseUrlConfigured = Boolean(process.env.DATABASE_URL);
const directUrlConfigured = Boolean(process.env.DIRECT_URL);
const prismaLogLevel = process.env.PRISMA_LOG_LEVEL ?? "warn,error";

const layers: DbProviderLayer[] = [
  {
    id: "provider_switch",
    label: "Repository provider switch",
    status: "partial",
    readiness: 70,
    risk: "medium",
    owner: "Backend",
    purpose: "Comutare controlată între mock-memory, prisma-shadow și prisma-active fără schimbări vizuale în UI.",
    currentProvider: providerMode,
    targetProvider: "prisma-shadow",
    evidence: "SERVELECT_DATA_PROVIDER env contract + health endpoint + fallback policy.",
    nextActions: ["Introduce provider adapter în repository", "Loghează providerul activ în health checks", "Blochează prisma-active fără safety gates"]
  },
  {
    id: "prisma_runtime",
    label: "Prisma runtime contract",
    status: databaseUrlConfigured ? "partial" : "mock",
    readiness: databaseUrlConfigured ? 68 : 42,
    risk: databaseUrlConfigured ? "medium" : "high",
    owner: "Backend",
    purpose: "Pregătește runtime-ul pentru Prisma Client, migrations, seed și environment checks.",
    currentProvider: "mock-memory",
    targetProvider: "prisma-shadow",
    evidence: databaseUrlConfigured ? "DATABASE_URL detected in runtime." : "DATABASE_URL missing in runtime.",
    nextActions: ["Configurează DATABASE_URL în Vercel", "Rulează prisma migrate deploy", "Adaugă seed deterministic pentru demo Servelect"]
  },
  {
    id: "shadow_reads",
    label: "Shadow reads",
    status: "blocked",
    readiness: 34,
    risk: "high",
    owner: "Data Platform",
    purpose: "Compară răspunsurile mock/API actuale cu răspunsurile Prisma fără a schimba UI-ul pentru utilizatori.",
    currentProvider: "mock-memory",
    targetProvider: "prisma-shadow",
    evidence: "Plan definit; implementarea reală se activează după seed și schema confirmată.",
    nextActions: ["Adaugă diff report mock vs Prisma", "Stochează mismatch-uri în audit log", "Activează pe rute read-only"]
  },
  {
    id: "write_gates",
    label: "Write safety gates",
    status: "partial",
    readiness: 62,
    risk: "high",
    owner: "Security",
    purpose: "Nicio scriere în DB real fără RBAC server-side, audit event și rollback plan.",
    currentProvider: "mock-memory",
    targetProvider: "prisma-active",
    evidence: "RBAC foundation există, dar enforcement complet pe write APIs este încă în lucru.",
    nextActions: ["Gates pentru POST/PATCH/DELETE", "Audit event pentru fiecare mutation", "Transaction boundaries în repository"]
  },
  {
    id: "rollback",
    label: "Rollback & fallback",
    status: "partial",
    readiness: 58,
    risk: "medium",
    owner: "Release Manager",
    purpose: "Permite revenire rapidă la mock-memory/localStorage fallback dacă providerul Prisma eșuează.",
    currentProvider: providerMode,
    targetProvider: "mock-memory",
    evidence: "Feature flags și localStorage reset keys există; lipsește toggle centralizat runtime.",
    nextActions: ["Adaugă env kill-switch", "Documentează rollback playbook", "Testează provider fallback în preview deploy"]
  }
];

const entities: DbRuntimeEntity[] = [
  { id: "workspace", label: "Workspace / tenant", table: "workspaces", status: "partial", readiness: 74, apiSurface: ["/api/v1/enterprise/*"], prismaModel: "Workspace", migrationStep: "Create tenant-safe base table + seed Servelect workspace" },
  { id: "users", label: "Users & roles", table: "users, roles, permissions", status: "partial", readiness: 66, apiSurface: ["/admin/users", "/api/v1/auth/session"], prismaModel: "User, Role, Permission", migrationStep: "Persist demo users, then wire Auth.js sessions" },
  { id: "projects", label: "Projects", table: "projects", status: "partial", readiness: 72, apiSurface: ["/api/v1/projects", "/proiecte"], prismaModel: "Project", migrationStep: "Seed projects and switch GET /api/v1/projects to repository provider" },
  { id: "tasks", label: "Tasks", table: "tasks, subtasks, task_comments", status: "partial", readiness: 70, apiSurface: ["/api/v1/tasks", "/taskuri"], prismaModel: "Task, Subtask, TaskComment", migrationStep: "Read through Prisma shadow, then enable write path behind feature flag" },
  { id: "time_entries", label: "Time entries", table: "time_entries", status: "mock", readiness: 46, apiSurface: ["Task timers", "timesheet module"], prismaModel: "TimeEntry", migrationStep: "Define timer mutation API and conflict handling" },
  { id: "approvals", label: "Approvals", table: "approval_requests", status: "mock", readiness: 48, apiSurface: ["/action-center", "workflow run"], prismaModel: "ApprovalRequest", migrationStep: "Persist approval queue and link to task/project IDs" },
  { id: "audit", label: "Audit log", table: "audit_events", status: "partial", readiness: 60, apiSurface: ["/admin/audit", "/api/v1/audit/events"], prismaModel: "AuditEvent", migrationStep: "Persist security + mutation events with correlation IDs" },
  { id: "documents", label: "Documents & attachments", table: "documents, attachments", status: "blocked", readiness: 28, apiSurface: ["documents module", "task attachments"], prismaModel: "Document, Attachment", migrationStep: "Add storage provider contract before DB activation" }
];

const safetyGates: DbProviderSafetyGate[] = [
  { id: "env", label: "DATABASE_URL configured", status: databaseUrlConfigured ? "passed" : "blocked", requiredFor: "shadow", evidence: databaseUrlConfigured ? "DATABASE_URL exists" : "DATABASE_URL missing" },
  { id: "direct_url", label: "DIRECT_URL configured for migrations", status: directUrlConfigured ? "passed" : "next", requiredFor: "shadow", evidence: directUrlConfigured ? "DIRECT_URL exists" : "Optional for some providers, recommended for migrations" },
  { id: "schema", label: "Prisma schema mapped to WorkGraph", status: "active", requiredFor: "shadow", evidence: "WorkGraph and Data Foundation manifests define entity/table targets" },
  { id: "seed", label: "Deterministic Servelect seed", status: "next", requiredFor: "shadow", evidence: "Needs task/project/user seed parity with mock data" },
  { id: "rbac", label: "Server-side RBAC on write APIs", status: "active", requiredFor: "active", evidence: "RBAC manifest exists; write gates still required" },
  { id: "audit", label: "Persistent audit events", status: "next", requiredFor: "active", evidence: "Audit UI exists; DB persistence still needed" },
  { id: "rollback", label: "Provider rollback tested", status: "next", requiredFor: "production", evidence: "Fallback policy documented; runtime drill needed" }
];

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));
}

export function getDbProviderRuntimeRelease() {
  const readiness = average([...layers.map((layer) => layer.readiness), ...entities.map((entity) => entity.readiness)]);
  const blocked = [...layers.filter((layer) => layer.status === "blocked"), ...entities.filter((entity) => entity.status === "blocked")];
  const gatesPassed = safetyGates.filter((gate) => gate.status === "passed").length;

  return {
    ok: true,
    version: "2.1.0",
    name: "DB Provider Wiring & Prisma Runtime Pack",
    generatedAt: new Date().toISOString(),
    provider: {
      mode: providerMode,
      databaseUrlConfigured,
      directUrlConfigured,
      prismaLogLevel,
      productionWritesEnabled: providerMode === "prisma-active" && safetyGates.every((gate) => gate.status === "passed")
    },
    readiness: {
      score: readiness,
      label: readiness >= 85 ? "provider-ready" : readiness >= 65 ? "shadow-ready candidate" : "not ready for active DB writes",
      gatesPassed,
      gatesTotal: safetyGates.length,
      blockedItems: blocked.map((item) => item.label)
    },
    layers,
    entities,
    safetyGates,
    runtimePlan: [
      "Set DATABASE_URL and optional DIRECT_URL in Vercel preview environment.",
      "Run prisma migrate deploy in controlled environment, not directly from UI runtime.",
      "Seed workspace/users/projects/tasks deterministically.",
      "Enable SERVELECT_DATA_PROVIDER=prisma-shadow for read-only parity checks.",
      "Compare API responses mock-memory vs Prisma and log mismatches.",
      "Enable prisma-active only for reads, then gated writes with audit log.",
      "Keep kill-switch back to mock-memory until v2.3 production readiness."
    ],
    nextBuild: {
      version: "2.2.0",
      name: "Prisma Schema & Seed Pack",
      objective: "Adaugă schema Prisma finală, seed Servelect deterministic și scripts de migration/rollback pentru preview DB."
    }
  };
}

export function getDbProviderRuntimeHealth() {
  const release = getDbProviderRuntimeRelease();

  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    provider: release.provider,
    readiness: release.readiness,
    health: {
      apiRuntime: "online",
      prismaClientImported: false,
      dbConnectionAttempted: false,
      dbConnectionStatus: release.provider.databaseUrlConfigured ? "not-attempted-runtime-safe" : "not-configured",
      writesEnabled: release.provider.productionWritesEnabled,
      safetyMode: "no runtime DB connection in this manifest endpoint"
    }
  };
}
