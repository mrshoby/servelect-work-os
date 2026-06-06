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
  status: "stable" | "beta" | "partial" | "mock" | "blocked" | "shadow" | "controlled";
  summary: string;
};

export type PrismaWriteGateStage = {
  id: string;
  label: string;
  status: "ready" | "controlled" | "shadow" | "locked" | "blocked";
  risk: "low" | "medium" | "high" | "critical";
  result: string;
};

export const productStatusPercentages: ProductStatusArea[] = [
  {
    id: "website-web-app",
    label: "Website/Web App",
    completion: 88,
    status: "beta",
    summary: "Interfața web principală este stabilizată după v3.0.x, cu pagini admin, release, taskuri și verificări Prisma shadow."
  },
  {
    id: "task-project-core",
    label: "Task & Project Core",
    completion: 79,
    status: "beta",
    summary: "Task board, drawer, create/update API UI, read shadow și write-gate controlat sunt disponibile ca traseu beta."
  },
  {
    id: "backend-api",
    label: "Backend/API",
    completion: 75,
    status: "beta",
    summary: "Endpointurile enterprise/task sunt extinse cu health, plan și write-gate controlat pentru următoarea activare Prisma."
  },
  {
    id: "database-prisma-seed",
    label: "Database/Prisma/Seed",
    completion: 68,
    status: "controlled",
    summary: "Prisma trece de la read-shadow la write-gate controlat, dar scrierile reale production rămân OFF implicit."
  },
  {
    id: "auth-rbac",
    label: "Auth/RBAC",
    completion: 51,
    status: "partial",
    summary: "Auth/RBAC este pregătit parțial pentru protecții, dar enforcement complet pe mutații task încă trebuie finalizat."
  },
  {
    id: "iot-ops",
    label: "IoT/Ops",
    completion: 39,
    status: "partial",
    summary: "Zona IoT/Ops rămâne în foundation/demo, separată de activarea controlată a task writes."
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    completion: 29,
    status: "mock",
    summary: "Aplicația mobilă rămâne la nivel incipient; web-ul rămâne prioritar pentru fluxurile task/project."
  }
];

export function getOverallProductCompletion() {
  return Math.round(
    productStatusPercentages.reduce((sum, area) => sum + area.completion, 0) /
      Math.max(productStatusPercentages.length, 1)
  );
}

function readBooleanEnv(name: string) {
  const value = process.env[name];
  return value === "1" || value === "true" || value === "TRUE" || value === "yes" || value === "YES";
}

export function getPrismaTaskWriteGateControlledActivation() {
  const explicitWriteMode = process.env.SERVELECT_TASK_PRISMA_WRITE_MODE ?? "locked";
  const operatorConfirmed = readBooleanEnv("SERVELECT_TASK_WRITE_GATE_CONFIRMED");
  const auditConfirmed = readBooleanEnv("SERVELECT_TASK_WRITE_AUDIT_CONFIRMED");
  const rbacConfirmed = readBooleanEnv("SERVELECT_TASK_WRITE_RBAC_CONFIRMED");

  const canEnableControlledWrites =
    explicitWriteMode === "controlled" && operatorConfirmed && auditConfirmed && rbacConfirmed;

  const stages: PrismaWriteGateStage[] = [
    {
      id: "read-shadow-baseline",
      label: "Read shadow baseline",
      status: "ready",
      risk: "low",
      result: "v3.2 read-shadow baseline remains the required precondition before any controlled write path."
    },
    {
      id: "write-gate-env",
      label: "Write-gate environment switch",
      status: explicitWriteMode === "controlled" ? "controlled" : "locked",
      risk: "high",
      result:
        explicitWriteMode === "controlled"
          ? "Write mode is requested as controlled, but confirmations are still checked independently."
          : "Default mode is locked. Set SERVELECT_TASK_PRISMA_WRITE_MODE=controlled only after validation."
    },
    {
      id: "operator-confirmation",
      label: "Operator confirmation",
      status: operatorConfirmed ? "ready" : "locked",
      risk: "high",
      result: operatorConfirmed
        ? "Operator confirmation is present."
        : "SERVELECT_TASK_WRITE_GATE_CONFIRMED is not enabled, so production writes stay locked."
    },
    {
      id: "audit-confirmation",
      label: "Audit confirmation",
      status: auditConfirmed ? "ready" : "locked",
      risk: "critical",
      result: auditConfirmed
        ? "Audit confirmation is present."
        : "SERVELECT_TASK_WRITE_AUDIT_CONFIRMED is not enabled, so production writes stay locked."
    },
    {
      id: "rbac-confirmation",
      label: "RBAC confirmation",
      status: rbacConfirmed ? "ready" : "locked",
      risk: "critical",
      result: rbacConfirmed
        ? "RBAC confirmation is present."
        : "SERVELECT_TASK_WRITE_RBAC_CONFIRMED is not enabled, so production writes stay locked."
    },
    {
      id: "production-write-state",
      label: "Production write state",
      status: canEnableControlledWrites ? "controlled" : "blocked",
      risk: "critical",
      result: canEnableControlledWrites
        ? "Controlled write path can be enabled by runtime adapter logic."
        : "Production task writes are blocked by default. This is expected for v3.3.0."
    }
  ];

  return {
    ok: true,
    version: "3.3.0",
    name: "Prisma Task Write-Gate Controlled Activation",
    generatedAt: new Date().toISOString(),
    mode: "prisma-write-gate-controlled",
    requestedWriteMode: explicitWriteMode,
    operatorConfirmed,
    auditConfirmed,
    rbacConfirmed,
    isProductionWriteEnabled: canEnableControlledWrites,
    writeGateState: canEnableControlledWrites ? "controlled-enabled" : "locked-by-default",
    readiness: 74,
    overallCompletion: getOverallProductCompletion(),
    statusPercentages: productStatusPercentages,
    stages,
    summary:
      "v3.3.0 introduce write-gate controlat pentru task writes Prisma. Scrierile reale production rămân OFF implicit și necesită confirmări explicite.",
    endpoints: [
      "/admin/prisma-task-write-gate",
      "/api/v1/enterprise/prisma-task-write-gate",
      "/api/v1/enterprise/prisma-task-write-gate-health",
      "/api/v1/enterprise/prisma-task-write-gate-plan",
      "/api/v1/tasks/prisma-write-gate"
    ],
    nextBuild: "v3.4.0 — Prisma Task Mutation Shadow Audit"
  };
}

export function getPrismaTaskWriteGateHealth() {
  const release = getPrismaTaskWriteGateControlledActivation();
  const readyStages = release.stages.filter((stage) => stage.status === "ready" || stage.status === "controlled").length;

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    mode: release.mode,
    readiness: release.readiness,
    readyStages,
    totalStages: release.stages.length,
    writeGateState: release.writeGateState,
    productionWrites: release.isProductionWriteEnabled ? "controlled-enabled" : "locked",
    statusPercentages: release.statusPercentages,
    message: release.isProductionWriteEnabled
      ? "Controlled write-gate requirements are satisfied."
      : "Production writes are locked by default. This is expected until all confirmations are enabled."
  };
}

export function getPrismaTaskWriteGatePlan() {
  const release = getPrismaTaskWriteGateControlledActivation();

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    title: "Prisma Task Write-Gate Controlled Activation Plan",
    statusPercentages: release.statusPercentages,
    steps: [
      {
        id: "keep-default-locked",
        title: "Keep default locked",
        outcome: "Production writes must remain disabled until explicit environment confirmations are present."
      },
      {
        id: "confirm-rbac",
        title: "Confirm RBAC enforcement",
        outcome: "Write paths require role checks before any Prisma mutation can become active."
      },
      {
        id: "confirm-audit",
        title: "Confirm audit trail",
        outcome: "Every controlled mutation must produce an audit entry before write mode can be trusted."
      },
      {
        id: "shadow-mutation-next",
        title: "Prepare mutation shadow audit",
        outcome: "Next build validates mutation payloads in shadow mode before real writes."
      }
    ],
    nextBuild: release.nextBuild
  };
}
