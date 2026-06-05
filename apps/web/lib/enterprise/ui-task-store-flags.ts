export type UiTaskStoreFeatureFlagStatus = "enabled" | "controlled" | "disabled" | "planned";
export type UiTaskStoreFeatureFlagRisk = "low" | "medium" | "high";
export type UiTaskStoreFeatureFlagScope = "read" | "write" | "sync" | "rollback" | "observability";

export type UiTaskStoreFeatureFlag = {
  id: string;
  label: string;
  description: string;
  status: UiTaskStoreFeatureFlagStatus;
  scope: UiTaskStoreFeatureFlagScope;
  rolloutPercent: number;
  risk: UiTaskStoreFeatureFlagRisk;
  owner: string;
  fallback: string;
  apiContract: string;
  requiredBeforeProduction: string[];
};

export type UiTaskStoreRolloutPhase = {
  id: string;
  label: string;
  target: string;
  status: "done" | "active" | "next" | "blocked";
  exitCriteria: string[];
};

const flags: UiTaskStoreFeatureFlag[] = [
  {
    id: "task_api_read",
    label: "Task API read path",
    description: "UI poate consuma lista de taskuri din /api/v1/tasks, cu fallback localStorage.",
    status: "controlled",
    scope: "read",
    rolloutPercent: 35,
    risk: "medium",
    owner: "Work OS Core",
    fallback: "Zustand/localStorage mock data",
    apiContract: "GET /api/v1/tasks",
    requiredBeforeProduction: ["E2E table view", "empty state", "server error fallback"]
  },
  {
    id: "project_api_read",
    label: "Project API read path",
    description: "UI poate consuma lista de proiecte din /api/v1/projects, cu fallback local.",
    status: "controlled",
    scope: "read",
    rolloutPercent: 35,
    risk: "medium",
    owner: "Work OS Core",
    fallback: "Shared mock projects",
    apiContract: "GET /api/v1/projects",
    requiredBeforeProduction: ["project list smoke test", "API latency budget < 1200ms"]
  },
  {
    id: "task_api_create",
    label: "Task create via API",
    description: "Creare task prin contract API, momentan mock-memory; DB real vine ulterior.",
    status: "planned",
    scope: "write",
    rolloutPercent: 0,
    risk: "high",
    owner: "Task Management",
    fallback: "TaskCreateModal local store action",
    apiContract: "POST /api/v1/tasks",
    requiredBeforeProduction: ["validation schema", "audit event", "permission check", "optimistic rollback"]
  },
  {
    id: "task_api_update_status",
    label: "Task status update via API",
    description: "Schimbarea statusului din board/table poate fi mutată în API cu rollback vizual.",
    status: "planned",
    scope: "write",
    rolloutPercent: 0,
    risk: "high",
    owner: "Task Management",
    fallback: "Zustand updateTaskStatus",
    apiContract: "PATCH /api/v1/tasks/:id",
    requiredBeforeProduction: ["optimistic update", "failed write toast", "activity log append"]
  },
  {
    id: "local_storage_fallback",
    label: "LocalStorage fallback",
    description: "Fallback de siguranță pentru demo/live dacă API-ul nu răspunde.",
    status: "enabled",
    scope: "rollback",
    rolloutPercent: 100,
    risk: "low",
    owner: "Platform",
    fallback: "Hard reset demo data",
    apiContract: "N/A",
    requiredBeforeProduction: ["versioned store key", "migration guard"]
  },
  {
    id: "ui_store_telemetry",
    label: "UI store telemetry",
    description: "Pregătește măsurarea timpilor de încărcare și a fallback-urilor API.",
    status: "controlled",
    scope: "observability",
    rolloutPercent: 25,
    risk: "low",
    owner: "Quality",
    fallback: "console diagnostics only",
    apiContract: "GET /api/v1/enterprise/api-ui-store-health",
    requiredBeforeProduction: ["Vercel logs review", "client metric budget"]
  },
  {
    id: "kill_switch_api_store",
    label: "API-backed store kill switch",
    description: "Feature flag pentru dezactivarea rapidă a citirii/scrierii prin API fără redeploy major.",
    status: "enabled",
    scope: "rollback",
    rolloutPercent: 100,
    risk: "low",
    owner: "Release Manager",
    fallback: "USE_API_TASK_STORE=false",
    apiContract: "environment/runtime flag",
    requiredBeforeProduction: ["documented env flag", "release checklist"]
  }
];

const rollout: UiTaskStoreRolloutPhase[] = [
  {
    id: "phase-1",
    label: "Read-only API shadow mode",
    target: "Taskuri + Proiecte citesc API în paralel cu local store",
    status: "active",
    exitCriteria: ["GET /api/v1/tasks stabil", "GET /api/v1/projects stabil", "fără freeze pe /taskuri"]
  },
  {
    id: "phase-2",
    label: "Controlled API reads",
    target: "UI poate porni reads din API pentru 25-50% din sesiuni",
    status: "next",
    exitCriteria: ["latency p95 sub 1500ms", "fallback verificat", "smoke test verde"]
  },
  {
    id: "phase-3",
    label: "Write operations behind flag",
    target: "create/update task prin API, cu optimistic UI și rollback",
    status: "next",
    exitCriteria: ["POST/PATCH tests", "audit log event", "permission gate"]
  },
  {
    id: "phase-4",
    label: "DB-backed provider",
    target: "Înlocuire mock-memory cu PostgreSQL/Prisma provider",
    status: "blocked",
    exitCriteria: ["DATABASE_URL configurat", "Prisma migrations", "seed + rollback plan"]
  }
];

function computeScore() {
  const weighted = flags.reduce((sum, flag) => {
    const base = flag.status === "enabled" ? 100 : flag.status === "controlled" ? 70 : flag.status === "planned" ? 35 : 0;
    const riskPenalty = flag.risk === "high" ? 12 : flag.risk === "medium" ? 6 : 0;
    return sum + Math.max(base - riskPenalty, 0);
  }, 0);

  return Math.round(weighted / flags.length);
}

export function getUiTaskStoreFeatureFlagRelease() {
  const score = computeScore();

  return {
    ok: true,
    version: "1.9.0",
    name: "UI Task Store Feature Flag Pack",
    generatedAt: new Date().toISOString(),
    mode: "hybrid",
    storeKey: "servelect-work-os-store-v19",
    summary:
      "v1.9 introduce guvernanță pentru trecerea controlată de la Zustand/localStorage la UI API-backed pentru taskuri și proiecte, fără schimbări vizuale majore.",
    defaults: {
      provider: "local-first-api-ready",
      apiBackedReads: false,
      apiBackedWrites: false,
      localStorageFallback: true,
      rollbackEnabled: true,
      telemetryEnabled: true,
      rolloutPercent: 25
    },
    readiness: {
      score,
      label: score >= 80 ? "ready for controlled rollout" : "controlled rollout pending",
      blockers: [
        "DB provider real nu este încă activat pentru writes",
        "Auth/RBAC production trebuie conectat la API write gates"
      ],
      warnings: [
        "Păstrează localStorage fallback până când API write path este testat",
        "Nu activa writes fără rollback și audit log"
      ],
      productionGate: "API reads pot fi testate controlat; API writes rămân gated până la provider DB real."
    },
    flags,
    rollout
  };
}

export function getUiTaskStoreFeatureFlagHealth() {
  const release = getUiTaskStoreFeatureFlagRelease();
  const activeFlags = release.flags.filter((flag) => flag.status === "enabled" || flag.status === "controlled").length;
  const plannedFlags = release.flags.filter((flag) => flag.status === "planned").length;

  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    score: release.readiness.score,
    activeFlags,
    plannedFlags,
    provider: release.defaults.provider,
    fallbackEnabled: release.defaults.localStorageFallback,
    rollbackEnabled: release.defaults.rollbackEnabled,
    status: release.readiness.label
  };
}

export function getUiTaskStoreIntegrationPlan() {
  const release = getUiTaskStoreFeatureFlagRelease();

  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    goal: "Migrare controlată UI store: local-first -> API read -> API write -> DB-backed provider.",
    rollout: release.rollout,
    flags: release.flags.map((flag) => ({
      id: flag.id,
      status: flag.status,
      rolloutPercent: flag.rolloutPercent,
      apiContract: flag.apiContract,
      fallback: flag.fallback,
      requiredBeforeProduction: flag.requiredBeforeProduction
    })),
    nextBuild: "v2.0.0 — Enterprise Beta Stabilization sau v1.10.0 — DB Provider Wiring, în funcție de stabilitatea Vercel."
  };
}
