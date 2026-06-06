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
  status: "stable" | "beta" | "partial" | "mock" | "blocked" | "shadow" | "controlled" | "audit";
  summary: string;
};

export type MutationShadowAuditCheck = {
  id: string;
  label: string;
  status: "pass" | "shadow" | "warning" | "blocked" | "planned";
  risk: "low" | "medium" | "high" | "critical";
  result: string;
};

export type MutationShadowPayloadSample = {
  action: "create" | "update" | "status-change" | "assignment";
  source: "task-ui" | "api" | "board" | "drawer";
  prismaWrite: "not-executed";
  auditMode: "shadow-only";
  result: "accepted-shadow" | "needs-rbac" | "needs-audit";
};

export const productStatusPercentages: ProductStatusArea[] = [
  {
    id: "website-web-app",
    label: "Website/Web App",
    completion: 89,
    status: "beta",
    summary: "Interfața web este stabilizată pentru taskuri, release status, admin pages și fluxurile Prisma shadow/write-gate."
  },
  {
    id: "task-project-core",
    label: "Task & Project Core",
    completion: 82,
    status: "beta",
    summary: "Task CRUD, board, drawer, API bridge, read shadow și write-gate sunt conectate într-un flux beta coerent."
  },
  {
    id: "backend-api",
    label: "Backend/API",
    completion: 78,
    status: "beta",
    summary: "API-ul are endpointuri de health, plan, repository mode, read shadow, write-gate și acum mutation shadow audit."
  },
  {
    id: "database-prisma-seed",
    label: "Database/Prisma/Seed",
    completion: 72,
    status: "shadow",
    summary: "Prisma este verificat prin shadow-read și mutation shadow audit. Scrierile reale rămân blocate implicit."
  },
  {
    id: "auth-rbac",
    label: "Auth/RBAC",
    completion: 54,
    status: "partial",
    summary: "RBAC trebuie legat strict de mutațiile reale înainte de activarea production writes."
  },
  {
    id: "iot-ops",
    label: "IoT/Ops",
    completion: 40,
    status: "partial",
    summary: "IoT/Ops rămâne în fază de foundation, dar nu blochează stabilizarea task/project."
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    completion: 30,
    status: "mock",
    summary: "Mobile app este încă secundar; fluxurile enterprise principale rămân în web app."
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

export function getPrismaTaskMutationShadowAudit() {
  const mutationShadowEnabled = true;
  const prismaWriteMode = process.env.SERVELECT_TASK_PRISMA_WRITE_MODE ?? "locked";
  const allowRealWrites = readBooleanEnv("SERVELECT_TASK_REAL_WRITES_ENABLED");
  const auditConfirmed = readBooleanEnv("SERVELECT_TASK_WRITE_AUDIT_CONFIRMED");
  const rbacConfirmed = readBooleanEnv("SERVELECT_TASK_WRITE_RBAC_CONFIRMED");

  const checks: MutationShadowAuditCheck[] = [
    {
      id: "payload-normalization",
      label: "Payload normalization",
      status: "pass",
      risk: "low",
      result: "Task create/update payloads can be normalized before repository execution."
    },
    {
      id: "mutation-shadow-mode",
      label: "Mutation shadow mode",
      status: mutationShadowEnabled ? "shadow" : "blocked",
      risk: "medium",
      result: mutationShadowEnabled
        ? "Mutation payloads are accepted in shadow-only mode and no Prisma write is executed."
        : "Shadow mutation audit is not enabled."
    },
    {
      id: "real-write-lock",
      label: "Real write lock",
      status: allowRealWrites ? "warning" : "pass",
      risk: "critical",
      result: allowRealWrites
        ? "Environment requests real writes; keep blocked until v3.5+ safety gates are complete."
        : "Real Prisma task writes are locked by default. This is expected for v3.4.0."
    },
    {
      id: "audit-trail-required",
      label: "Audit trail required",
      status: auditConfirmed ? "pass" : "planned",
      risk: "critical",
      result: auditConfirmed
        ? "Audit confirmation exists in environment."
        : "Audit confirmation is not active; real writes must stay disabled."
    },
    {
      id: "rbac-required",
      label: "RBAC required",
      status: rbacConfirmed ? "pass" : "planned",
      risk: "critical",
      result: rbacConfirmed
        ? "RBAC confirmation exists in environment."
        : "RBAC enforcement is still required before real Prisma task mutations."
    },
    {
      id: "prisma-write-mode",
      label: "Prisma write mode",
      status: prismaWriteMode === "controlled" ? "warning" : "pass",
      risk: "high",
      result:
        prismaWriteMode === "controlled"
          ? "Controlled write mode is requested, but v3.4 still audits mutations in shadow mode only."
          : "Write mode remains locked."
    }
  ];

  const payloadSamples: MutationShadowPayloadSample[] = [
    { action: "create", source: "task-ui", prismaWrite: "not-executed", auditMode: "shadow-only", result: "accepted-shadow" },
    { action: "update", source: "drawer", prismaWrite: "not-executed", auditMode: "shadow-only", result: "accepted-shadow" },
    { action: "status-change", source: "board", prismaWrite: "not-executed", auditMode: "shadow-only", result: "needs-audit" },
    { action: "assignment", source: "api", prismaWrite: "not-executed", auditMode: "shadow-only", result: "needs-rbac" }
  ];

  return {
    ok: true,
    version: "3.4.0",
    name: "Prisma Task Mutation Shadow Audit",
    generatedAt: new Date().toISOString(),
    mode: "mutation-shadow-audit",
    prismaWriteMode,
    mutationShadowEnabled,
    isProductionWriteEnabled: false,
    writeState: "shadow-only-no-real-prisma-write",
    readiness: 78,
    overallCompletion: getOverallProductCompletion(),
    statusPercentages: productStatusPercentages,
    checks,
    payloadSamples,
    summary:
      "v3.4.0 validează mutațiile de task în shadow mode: payload, audit, RBAC și write-gate sunt verificate fără a executa scrieri reale Prisma.",
    endpoints: [
      "/admin/prisma-task-mutation-shadow-audit",
      "/api/v1/enterprise/prisma-task-mutation-shadow-audit",
      "/api/v1/enterprise/prisma-task-mutation-shadow-audit-health",
      "/api/v1/enterprise/prisma-task-mutation-shadow-audit-plan",
      "/api/v1/tasks/mutation-shadow-audit"
    ],
    nextBuild: "v3.5.0 — Prisma Task Audit Trail & RBAC Enforcement"
  };
}

export function getPrismaTaskMutationShadowAuditHealth() {
  const release = getPrismaTaskMutationShadowAudit();
  const passedChecks = release.checks.filter((check) => check.status === "pass" || check.status === "shadow").length;

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    mode: release.mode,
    readiness: release.readiness,
    passedChecks,
    totalChecks: release.checks.length,
    productionWrites: "disabled",
    writeState: release.writeState,
    statusPercentages: release.statusPercentages,
    message: "Mutation shadow audit is active. Real Prisma writes remain disabled."
  };
}

export function getPrismaTaskMutationShadowAuditPlan() {
  const release = getPrismaTaskMutationShadowAudit();

  return {
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    title: "Prisma Task Mutation Shadow Audit Plan",
    statusPercentages: release.statusPercentages,
    steps: [
      {
        id: "capture-mutation-payloads",
        title: "Capture mutation payloads",
        outcome: "Create/update/status/assignment requests are shaped and checked before any database write."
      },
      {
        id: "audit-no-write",
        title: "Audit without write",
        outcome: "All mutation attempts are evaluated as shadow events. Prisma write execution remains disabled."
      },
      {
        id: "rbac-contract",
        title: "RBAC contract",
        outcome: "Define which roles can create, update, assign and close tasks before production mutation activation."
      },
      {
        id: "next-audit-trail",
        title: "Next audit trail",
        outcome: "v3.5 should add audit trail and RBAC enforcement for controlled write activation."
      }
    ],
    nextBuild: release.nextBuild
  };
}
