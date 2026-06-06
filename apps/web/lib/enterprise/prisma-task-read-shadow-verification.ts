export type ProductStatusAreaId =
  | "website-web-app"
  | "task-project-core"
  | "backend-api"
  | "database-prisma-seed"
  | "auth-rbac"
  | "iot-ops"
  | "mobile-app";

export type ProductStatusArea = {
  id: ProductStatusAreaId;
  label: string;
  completion: number;
  status: "stable" | "beta" | "partial" | "mock" | "blocked" | "shadow";
  summary: string;
};

export type PrismaTaskReadShadowCheck = {
  id: string;
  label: string;
  status: "ready" | "shadow" | "partial" | "blocked";
  source: "api" | "repository" | "prisma-shadow" | "ui";
  result: string;
};

export const productStatusPercentages: ProductStatusArea[] = [
  {
    id: "website-web-app",
    label: "Website/Web App",
    completion: 87,
    status: "beta",
    summary: "Interfața web principală este funcțională în beta, cu pagini admin/release/status și taskuri stabilizate după v3.0.x."
  },
  {
    id: "task-project-core",
    label: "Task & Project Core",
    completion: 76,
    status: "beta",
    summary: "Task board, drawer, create/update API UI și write-gate există; urmează verificarea strictă pe adapterul Prisma read-shadow."
  },
  {
    id: "backend-api",
    label: "Backend/API",
    completion: 72,
    status: "beta",
    summary: "Endpointurile enterprise și task APIs sunt prezente, cu răspunsuri JSON verificabile și moduri de lucru controlate."
  },
  {
    id: "database-prisma-seed",
    label: "Database/Prisma/Seed",
    completion: 64,
    status: "shadow",
    summary: "Prisma/DB este în modul shadow/read verification; scrierile reale production rămân blocate până la validarea completă."
  },
  {
    id: "auth-rbac",
    label: "Auth/RBAC",
    completion: 48,
    status: "partial",
    summary: "Structura Auth/RBAC există parțial, dar enforcement complet pe task mutations și admin actions încă trebuie consolidat."
  },
  {
    id: "iot-ops",
    label: "IoT/Ops",
    completion: 38,
    status: "partial",
    summary: "Zona IoT/Ops este încă în foundation/demo; urmează integrare cu evenimente operaționale reale."
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    completion: 28,
    status: "mock",
    summary: "Aplicația mobilă rămâne în stadiu inițial; web-ul este prioritar pentru task/project workflows."
  }
];

export function getOverallProductCompletion() {
  return Math.round(
    productStatusPercentages.reduce((sum, area) => sum + area.completion, 0) /
      Math.max(productStatusPercentages.length, 1)
  );
}

export function getPrismaTaskReadShadowVerification() {
  const checks: PrismaTaskReadShadowCheck[] = [
    {
      id: "task-list-read",
      label: "Task list read path",
      status: "ready",
      source: "api",
      result: "Task list read endpoint can be called without enabling production writes."
    },
    {
      id: "board-state-read",
      label: "Board state read path",
      status: "ready",
      source: "repository",
      result: "Board-state contract remains compatible with the task page bridge."
    },
    {
      id: "prisma-shadow-compare",
      label: "Prisma shadow compare",
      status: "shadow",
      source: "prisma-shadow",
      result: "Shadow verification mode compares expected repository shape before enabling real DB writes."
    },
    {
      id: "ui-safe-fallback",
      label: "UI safe fallback",
      status: "ready",
      source: "ui",
      result: "UI must keep fallback behavior when DB provider is unavailable."
    },
    {
      id: "production-write-lock",
      label: "Production write lock",
      status: "blocked",
      source: "prisma-shadow",
      result: "Real Prisma task writes remain disabled until v3.3+ write-gate activation."
    }
  ];

  return {
    ok: true,
    version: "3.2.0",
    name: "Prisma Task Read Shadow Verification",
    generatedAt: new Date().toISOString(),
    mode: "prisma-read-shadow",
    isProductionWriteEnabled: false,
    readiness: 70,
    overallCompletion: getOverallProductCompletion(),
    statusPercentages: productStatusPercentages,
    checks,
    summary:
      "v3.2.0 verifică citirea taskurilor printr-un mod Prisma read-shadow, fără să activeze scrieri reale production.",
    endpoints: [
      "/admin/prisma-task-read-shadow",
      "/api/v1/enterprise/prisma-task-read-shadow",
      "/api/v1/enterprise/prisma-task-read-shadow-health",
      "/api/v1/enterprise/prisma-task-read-shadow-plan",
      "/api/v1/tasks/read-shadow"
    ],
    nextBuild: "v3.3.0 — Prisma Task Write-Gate Controlled Activation"
  };
}

export function getPrismaTaskReadShadowHealth() {
  const release = getPrismaTaskReadShadowVerification();
  const readyChecks = release.checks.filter((check) => check.status === "ready").length;

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    mode: release.mode,
    readiness: release.readiness,
    readyChecks,
    totalChecks: release.checks.length,
    productionWrites: "disabled",
    statusPercentages: release.statusPercentages,
    message: "Read-shadow verification is available. Production writes are still locked."
  };
}

export function getPrismaTaskReadShadowPlan() {
  const release = getPrismaTaskReadShadowVerification();

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    title: "Prisma Task Read Shadow Verification Plan",
    statusPercentages: release.statusPercentages,
    steps: [
      {
        id: "read-contract",
        title: "Lock read contract",
        outcome: "Keep /api/v1/tasks and /api/v1/tasks/board-state compatible with UI expectations."
      },
      {
        id: "shadow-provider",
        title: "Add shadow provider checks",
        outcome: "Compare mock-memory output with the planned Prisma repository shape."
      },
      {
        id: "fallback-behavior",
        title: "Keep UI fallback",
        outcome: "Task page must not freeze if DB provider is unavailable."
      },
      {
        id: "write-gate-next",
        title: "Prepare controlled write gate",
        outcome: "Next build can activate write paths only behind explicit feature flags and audit checks."
      }
    ],
    nextBuild: release.nextBuild
  };
}
