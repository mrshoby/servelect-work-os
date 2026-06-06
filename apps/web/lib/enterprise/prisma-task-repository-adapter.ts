export type PrismaTaskRepositoryMode = "mock-memory" | "prisma-shadow" | "prisma-write-gate" | "prisma-active";
export type PrismaTaskRepositoryRisk = "low" | "medium" | "high" | "critical";
export type PrismaTaskRepositoryStatus = "ready" | "partial" | "planned" | "blocked";

export type PrismaTaskRepositoryLayer = {
  id: string;
  title: string;
  module: string;
  status: PrismaTaskRepositoryStatus;
  mode: PrismaTaskRepositoryMode;
  readiness: number;
  risk: PrismaTaskRepositoryRisk;
  summary: string;
  done: string[];
  next: string[];
};

export type PrismaTaskRepositoryAdapterRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  readiness: number;
  currentMode: PrismaTaskRepositoryMode;
  writeGateOpen: boolean;
  isProductionDbActive: boolean;
  summary: string;
  layers: PrismaTaskRepositoryLayer[];
  safeguards: string[];
  nextBuild: string;
};

const layers: PrismaTaskRepositoryLayer[] = [
  {
    id: "adapter-contract",
    title: "Task Repository Adapter Contract",
    module: "Tasks",
    status: "ready",
    mode: "prisma-shadow",
    readiness: 82,
    risk: "medium",
    summary: "Contract stabil pentru separarea UI/API de providerul efectiv de date.",
    done: ["repository interface", "provider modes", "safe response shape", "shadow-ready planning"],
    next: ["bind adapter to real /api/v1/tasks mutations", "add audit event wrapper"]
  },
  {
    id: "prisma-shadow",
    title: "Prisma Shadow Runtime",
    module: "Database",
    status: "partial",
    mode: "prisma-shadow",
    readiness: 64,
    risk: "high",
    summary: "Pregătire pentru comparație mock-memory vs Prisma fără write-uri reale implicite.",
    done: ["shadow mode contract", "readiness endpoint", "write gate separation"],
    next: ["connect Prisma client when DATABASE_URL exists", "compare seeded tasks with API payload"]
  },
  {
    id: "write-gate",
    title: "Production Write Gate",
    module: "Governance",
    status: "partial",
    mode: "prisma-write-gate",
    readiness: 58,
    risk: "critical",
    summary: "Scrierile reale rămân blocate până la audit, RBAC și validări de integritate.",
    done: ["write gate endpoint", "default closed", "safe production messaging"],
    next: ["role based write authorization", "rollback-safe mutation log", "admin switch with explicit confirmation"]
  },
  {
    id: "crud-hardening",
    title: "Task CRUD Hardening",
    module: "Task Center",
    status: "planned",
    mode: "mock-memory",
    readiness: 46,
    risk: "high",
    summary: "Create/update/delete există ca flux UI/API, dar trebuie stabilizat înainte de DB production.",
    done: ["task page API bridge", "mutation panel", "board/drawer foundation"],
    next: ["server validation schema", "optimistic rollback", "subtasks/comments/attachments persistence"]
  }
];

function avg(items: Array<{ readiness: number }>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.readiness, 0) / items.length);
}

export function getPrismaTaskRepositoryAdapterRelease(): PrismaTaskRepositoryAdapterRelease {
  return {
    ok: true,
    version: "3.1.0",
    name: "Prisma Task Repository Adapter Activation",
    generatedAt: new Date().toISOString(),
    readiness: avg(layers),
    currentMode: "prisma-shadow",
    writeGateOpen: false,
    isProductionDbActive: false,
    summary:
      "v3.1 activează stratul de repository adapter pentru taskuri și pregătește conectarea controlată la Prisma. Scrierile reale în DB rămân închise implicit.",
    layers,
    safeguards: [
      "No production write by default",
      "Mock-memory remains fallback provider",
      "Prisma shadow mode is read/compare only until explicitly enabled",
      "Write gate must require audit + RBAC before prisma-active"
    ],
    nextBuild: "v3.2.0 — Prisma Task Read Shadow Verification"
  };
}

export function getPrismaTaskRepositoryAdapterHealth() {
  const release = getPrismaTaskRepositoryAdapterRelease();
  const blocked = release.layers.filter((layer) => layer.status === "blocked");
  const critical = release.layers.filter((layer) => layer.risk === "critical");

  return {
    ok: blocked.length === 0,
    version: release.version,
    generatedAt: new Date().toISOString(),
    mode: release.currentMode,
    readiness: release.readiness,
    writeGateOpen: release.writeGateOpen,
    isProductionDbActive: release.isProductionDbActive,
    blockedCount: blocked.length,
    criticalCount: critical.length,
    message: release.writeGateOpen
      ? "Write gate is open. Verify RBAC and audit before production use."
      : "Write gate is closed. Safe for beta/staging deployment."
  };
}

export function getPrismaTaskRepositoryAdapterPlan() {
  return {
    ok: true,
    version: "3.1.0",
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: "shadow-read",
        title: "Shadow read adapter",
        target: "v3.2.0",
        required: ["DATABASE_URL validation", "Prisma client safe loader", "mock-vs-db diff endpoint"]
      },
      {
        id: "write-guard",
        title: "Write gate governance",
        target: "v3.3.0",
        required: ["admin-only switch", "mutation audit trail", "rollback strategy"]
      },
      {
        id: "production-crud",
        title: "Production CRUD activation",
        target: "v3.4.0",
        required: ["RBAC enforcement", "server validation", "DB write tests", "Vercel env verification"]
      }
    ]
  };
}

export function getTaskRepositoryMode() {
  const release = getPrismaTaskRepositoryAdapterRelease();
  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    scope: "tasks",
    mode: release.currentMode,
    provider: release.isProductionDbActive ? "prisma" : "mock-memory",
    writeGateOpen: release.writeGateOpen,
    productionWrites: release.isProductionDbActive && release.writeGateOpen,
    message: "Task repository adapter is active in shadow-safe mode. Production DB writes are not enabled by default."
  };
}
