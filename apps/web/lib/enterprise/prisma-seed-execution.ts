import { currentEnterpriseVersion } from "./release-status";

export type SeedExecutionStatus = "planned" | "ready" | "shadow" | "blocked";

export type SeedStep = {
  id: string;
  label: string;
  status: SeedExecutionStatus;
  order: number;
  command: string;
  output: string;
  risk: "low" | "medium" | "high";
};

export type RepositoryAdapterStage = {
  id: string;
  label: string;
  status: "mock-memory" | "shadow-ready" | "db-ready" | "blocked";
  percent: number;
  summary: string;
  nextAction: string;
};

export const seedSteps: SeedStep[] = [
  {
    id: "env",
    label: "Validate environment variables",
    status: "ready",
    order: 1,
    command: "node scripts/check-env.mjs",
    output: "DATABASE_URL, DIRECT_URL and provider mode must be validated before Prisma runtime activation.",
    risk: "medium"
  },
  {
    id: "generate",
    label: "Generate Prisma Client",
    status: "ready",
    order: 2,
    command: "pnpm prisma generate",
    output: "Client generation must happen in CI/Vercel only after schema compatibility is confirmed.",
    risk: "medium"
  },
  {
    id: "migrate",
    label: "Apply migrations in controlled mode",
    status: "blocked",
    order: 3,
    command: "pnpm prisma migrate deploy",
    output: "Blocked until production PostgreSQL database and migration review are confirmed.",
    risk: "high"
  },
  {
    id: "seed",
    label: "Execute idempotent seed",
    status: "planned",
    order: 4,
    command: "pnpm prisma db seed",
    output: "Seed must be idempotent: workspace, users, roles, projects, tasks and audit events should not duplicate.",
    risk: "high"
  },
  {
    id: "shadow-compare",
    label: "Compare mock-memory vs Prisma shadow reads",
    status: "shadow",
    order: 5,
    command: "pnpm test:repository-shadow",
    output: "Read parity and count parity should be visible before switching writes to DB.",
    risk: "high"
  }
];

export const repositoryAdapterStages: RepositoryAdapterStage[] = [
  {
    id: "repository-contract",
    label: "Repository contract",
    status: "shadow-ready",
    percent: 70,
    summary: "Task/project APIs have a mock-memory contract and are ready for adapter routing.",
    nextAction: "Introduce provider switch: mock-memory | prisma-shadow | prisma-active."
  },
  {
    id: "task-adapter",
    label: "Task repository adapter",
    status: "mock-memory",
    percent: 44,
    summary: "CRUD contract exists, but writes are not persisted to PostgreSQL yet.",
    nextAction: "Implement create/update/delete through Prisma in shadow mode."
  },
  {
    id: "project-adapter",
    label: "Project repository adapter",
    status: "mock-memory",
    percent: 41,
    summary: "Project API exists, but DB-backed project workspace is not active.",
    nextAction: "Map Project, Client, User, Task relations in repository adapter."
  },
  {
    id: "audit-adapter",
    label: "Audit/event adapter",
    status: "mock-memory",
    percent: 35,
    summary: "Audit is documented but not persisted for each task mutation.",
    nextAction: "Create audit event on task/project mutation and surface it in task detail."
  },
  {
    id: "seed-adapter",
    label: "Seed adapter",
    status: "blocked",
    percent: 30,
    summary: "Seed plan exists; execution is blocked until DB env is confirmed.",
    nextAction: "Add safe seed script with idempotent upserts."
  }
];

export function getPrismaSeedExecutionRelease() {
  return {
    ok: true,
    version: currentEnterpriseVersion,
    title: "Prisma Seed Execution & Repository Adapter Pack",
    generatedAt: new Date().toISOString(),
    providerMode: "mock-memory-safe",
    dbWriteEnabled: false,
    dbSeedEnabled: false,
    repositoryAdapterPercent: Math.round(repositoryAdapterStages.reduce((sum, item) => sum + item.percent, 0) / repositoryAdapterStages.length),
    seedReadinessPercent: 46,
    warning:
      "Acest build nu execută seed real în PostgreSQL. Pregătește pașii, ecranul, API-urile și adapter plan-ul pentru activarea controlată în v2.5+.",
    seedSteps,
    repositoryAdapterStages,
    nextBuild: {
      version: "2.5.0",
      title: "DB-backed Task Mutations Pack",
      goal: "Primul build cu task create/update/delete trecute prin repository adapter în shadow/write-gated mode."
    }
  };
}

export function getPrismaSeedExecutionHealth() {
  const release = getPrismaSeedExecutionRelease();
  const blocked = seedSteps.filter((step) => step.status === "blocked").length;
  const highRisk = seedSteps.filter((step) => step.risk === "high").length;

  return {
    ok: blocked === 0 ? true : false,
    version: release.version,
    generatedAt: new Date().toISOString(),
    mode: release.providerMode,
    dbWriteEnabled: release.dbWriteEnabled,
    dbSeedEnabled: release.dbSeedEnabled,
    readiness: release.seedReadinessPercent,
    blockedSteps: blocked,
    highRiskSteps: highRisk,
    message:
      blocked > 0
        ? "Seed execution is intentionally blocked until real DB env, migration and rollback are confirmed."
        : "Seed execution plan is ready for controlled runtime activation."
  };
}

export function getRepositoryAdapterPlan() {
  return {
    ok: true,
    version: currentEnterpriseVersion,
    generatedAt: new Date().toISOString(),
    stages: repositoryAdapterStages,
    migrationOrder: [
      "Keep mock-memory as safe default",
      "Add prisma-shadow reads for tasks/projects",
      "Compare response shape and count parity",
      "Enable DB writes for internal admin only",
      "Add audit events per mutation",
      "Enable /taskuri UI feature flag for API-backed mutations",
      "Move mobile offline sync after web CRUD is stable"
    ]
  };
}
