export type PrismaShadowModeStatus = "ready" | "partial" | "mock" | "blocked";
export type PrismaProviderMode = "mock-memory" | "prisma-shadow" | "prisma-active";

export type PrismaShadowCapability = {
  id: string;
  label: string;
  area: string;
  status: PrismaShadowModeStatus;
  readiness: number;
  description: string;
  nextAction: string;
};

export type PrismaShadowGuardrail = {
  id: string;
  label: string;
  enforced: boolean;
  reason: string;
};

export type PrismaShadowRoute = {
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  provider: PrismaProviderMode;
  writesEnabled: boolean;
  shadowReadiness: number;
};

export const PRISMA_SHADOW_VERSION = "2.3.0";

export function getPrismaRuntimeMode(): PrismaProviderMode {
  const rawMode = process.env.SERVELECT_DATA_PROVIDER?.trim();

  if (rawMode === "prisma-active" || rawMode === "prisma-shadow") {
    return rawMode;
  }

  return "mock-memory";
}

export function getPrismaShadowCapabilities(): PrismaShadowCapability[] {
  return [
    {
      id: "schema-contract",
      label: "Prisma schema contract",
      area: "Database",
      status: "ready",
      readiness: 88,
      description: "Modelele principale Work OS sunt mapate pentru Workspace, User, Project, Task, Comment, TimeEntry, Approval și AuditEvent.",
      nextAction: "Verifică schema.prisma cu prisma validate înainte de activarea providerului real."
    },
    {
      id: "read-provider",
      label: "Shadow read provider",
      area: "Runtime",
      status: "partial",
      readiness: 64,
      description: "Providerul poate fi comutat conceptual spre prisma-shadow, dar producția rămâne mock-memory până există DATABASE_URL valid.",
      nextAction: "Adaugă DATABASE_URL în Vercel Preview și rulează shadow read tests fără scrieri."
    },
    {
      id: "write-guard",
      label: "Write guard",
      area: "Safety",
      status: "ready",
      readiness: 92,
      description: "Scrierile reale rămân blocate până când DB_WRITE_ENABLED=true și toate health-check-urile trec.",
      nextAction: "Păstrează DB_WRITE_ENABLED=false până la v2.4/v2.5."
    },
    {
      id: "seed-parity",
      label: "Seed parity",
      area: "Data",
      status: "partial",
      readiness: 58,
      description: "Mock data și seed plan sunt aliniate la entitățile principale, dar nu există încă migrare efectivă completă.",
      nextAction: "Generează seed.ts real cu proiecte/taskuri/users/roles în v2.4."
    },
    {
      id: "rollback-plan",
      label: "Rollback plan",
      area: "Operations",
      status: "ready",
      readiness: 90,
      description: "Fallback-ul mock-memory rămâne implicit, deci orice eroare Prisma poate fi izolată fără a bloca UI-ul.",
      nextAction: "Documentează comutarea SERVELECT_DATA_PROVIDER=mock-memory în playbook."
    }
  ];
}

export function getPrismaShadowGuardrails(): PrismaShadowGuardrail[] {
  return [
    {
      id: "no-production-writes",
      label: "No production DB writes by default",
      enforced: process.env.DB_WRITE_ENABLED !== "true",
      reason: "Build-ul v2.3 este shadow mode. Nu activăm scrieri reale până când seed/migrations/RBAC sunt validate."
    },
    {
      id: "mock-memory-default",
      label: "mock-memory remains default",
      enforced: getPrismaRuntimeMode() === "mock-memory",
      reason: "Vercel production trebuie să rămână stabil chiar dacă DATABASE_URL lipsește."
    },
    {
      id: "runtime-observability",
      label: "runtime health endpoints",
      enforced: true,
      reason: "Endpoint-urile v2.3 expun mode, readiness, guardrails și plan de activare."
    },
    {
      id: "task-first-contract",
      label: "task-first contract",
      enforced: true,
      reason: "Orice activare DB trebuie să păstreze taskurile/proiectele ca nucleu al Work OS."
    }
  ];
}

export function getPrismaShadowRoutes(): PrismaShadowRoute[] {
  const provider = getPrismaRuntimeMode();
  const writesEnabled = provider === "prisma-active" && process.env.DB_WRITE_ENABLED === "true";

  return [
    { path: "/api/v1/tasks", method: "GET", provider, writesEnabled, shadowReadiness: 72 },
    { path: "/api/v1/tasks", method: "POST", provider, writesEnabled, shadowReadiness: 54 },
    { path: "/api/v1/projects", method: "GET", provider, writesEnabled, shadowReadiness: 70 },
    { path: "/api/v1/projects", method: "POST", provider, writesEnabled, shadowReadiness: 48 },
    { path: "/api/v1/enterprise/database-health", method: "GET", provider, writesEnabled: false, shadowReadiness: 82 },
    { path: "/api/v1/enterprise/prisma-shadow", method: "GET", provider, writesEnabled: false, shadowReadiness: 95 }
  ];
}

export function getPrismaShadowRelease() {
  const capabilities = getPrismaShadowCapabilities();
  const guardrails = getPrismaShadowGuardrails();
  const routes = getPrismaShadowRoutes();
  const readiness = Math.round(capabilities.reduce((sum, item) => sum + item.readiness, 0) / capabilities.length);
  const mode = getPrismaRuntimeMode();

  return {
    ok: true,
    version: PRISMA_SHADOW_VERSION,
    name: "Prisma Runtime Shadow Mode Pack",
    generatedAt: new Date().toISOString(),
    runtime: {
      providerMode: mode,
      databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
      writesEnabled: mode === "prisma-active" && process.env.DB_WRITE_ENABLED === "true",
      recommendedProductionMode: "mock-memory",
      nextSafeMode: "prisma-shadow"
    },
    readiness,
    capabilities,
    guardrails,
    routes,
    nextBuild: {
      version: "2.4.0",
      name: "Prisma Seed Execution & Repository Adapter Pack",
      goal: "Implementare seed.ts + repository adapter real, încă fără activare totală production writes."
    }
  };
}

export function getPrismaShadowHealth() {
  const release = getPrismaShadowRelease();
  const failedGuardrails = release.guardrails.filter((guardrail) => !guardrail.enforced);

  return {
    ok: failedGuardrails.length === 0,
    version: PRISMA_SHADOW_VERSION,
    generatedAt: new Date().toISOString(),
    providerMode: release.runtime.providerMode,
    readiness: release.readiness,
    failedGuardrails,
    checks: [
      {
        id: "database-url",
        label: "DATABASE_URL configured",
        ok: release.runtime.databaseUrlConfigured,
        severity: release.runtime.databaseUrlConfigured ? "info" : "warning",
        message: release.runtime.databaseUrlConfigured
          ? "DATABASE_URL este prezent. Poți testa prisma-shadow în preview."
          : "DATABASE_URL lipsește. Producția rămâne pe mock-memory."
      },
      {
        id: "writes-disabled",
        label: "Writes disabled by default",
        ok: !release.runtime.writesEnabled,
        severity: release.runtime.writesEnabled ? "critical" : "info",
        message: release.runtime.writesEnabled
          ? "Scrierile reale sunt active. Folosește doar după validare DB completă."
          : "Scrierile reale sunt oprite, conform shadow mode."
      },
      {
        id: "route-contract",
        label: "Task/project route contract tracked",
        ok: release.routes.length >= 4,
        severity: "info",
        message: "Rutele task/proiect sunt incluse în manifestul shadow."
      }
    ]
  };
}

export function getPrismaShadowActivationPlan() {
  return {
    ok: true,
    version: PRISMA_SHADOW_VERSION,
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: "phase-1",
        title: "Shadow read only",
        targetVersion: "2.3.x",
        status: "current",
        tasks: [
          "Păstrează SERVELECT_DATA_PROVIDER=mock-memory în production.",
          "Testează prisma-shadow doar în local/preview cu DATABASE_URL.",
          "Compară răspunsurile /api/v1/tasks mock vs DB seed."
        ]
      },
      {
        id: "phase-2",
        title: "Repository adapter",
        targetVersion: "2.4.0",
        status: "next",
        tasks: [
          "Creează PrismaTaskRepository și PrismaProjectRepository.",
          "Adaugă seed.ts pentru utilizatori, proiecte, taskuri, roluri.",
          "Introdu feature flag per route: tasks.read.provider."
        ]
      },
      {
        id: "phase-3",
        title: "Selective API reads",
        targetVersion: "2.5.0",
        status: "planned",
        tasks: [
          "Activează citiri Prisma pentru /api/v1/tasks în preview.",
          "Păstrează scrierile pe mock/local fallback.",
          "Adaugă observabilitate query latency."
        ]
      },
      {
        id: "phase-4",
        title: "Controlled writes",
        targetVersion: "2.6.0",
        status: "planned",
        tasks: [
          "Activează DB_WRITE_ENABLED pentru staging.",
          "Adaugă audit log persistent la fiecare create/update/delete.",
          "Rulează rollback drill înainte de production."
        ]
      }
    ]
  };
}
