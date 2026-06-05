export type TaskPageApiBridgeStatus = "ready" | "partial" | "planned" | "blocked";

export type TaskPageApiBridgeCapability = {
  id: string;
  label: string;
  status: TaskPageApiBridgeStatus;
  readiness: number;
  route: string;
  description: string;
  evidence: string[];
  next: string[];
};

export const taskPageApiBridgeCapabilities: TaskPageApiBridgeCapability[] = [
  {
    id: "task-list-fetch",
    label: "Task list API fetch",
    status: "partial",
    readiness: 72,
    route: "GET /api/v1/tasks",
    description: "Pagina Taskuri poate verifica disponibilitatea API-ului de taskuri și poate afișa starea bridge-ului fără să rupă store-ul local existent.",
    evidence: ["client API bridge banner", "local fallback remains active", "no UI redesign"],
    next: ["hydrate tasks from API into page state", "server-side filtering", "pagination"]
  },
  {
    id: "board-state-fetch",
    label: "Board state API fetch",
    status: "ready",
    readiness: 84,
    route: "GET /api/v1/tasks/board-state",
    description: "Board state endpoint este folosit ca sursă de verificare pentru coloane, cards și readiness API-backed board.",
    evidence: ["board-state route", "task board drawer contract", "API status in task page"],
    next: ["wire columns to API payload", "persist drag/drop order", "stale-while-revalidate refresh"]
  },
  {
    id: "drawer-api-hydration",
    label: "Drawer API hydration",
    status: "partial",
    readiness: 66,
    route: "GET /api/v1/tasks/:id planned",
    description: "Drawer-ul este pregătit pentru hidratare API, dar păstrează fallback pe Zustand/localStorage până la activarea mutațiilor reale.",
    evidence: ["drawer contract", "planned task detail route", "fallback local mode"],
    next: ["task detail endpoint", "comments/subtasks include", "attachments metadata"]
  },
  {
    id: "api-write-guard",
    label: "API write guard",
    status: "planned",
    readiness: 52,
    route: "POST/PATCH/DELETE /api/v1/tasks planned",
    description: "Mutațiile DB-backed trebuie activate prin feature flag, audit și rollback. v2.8 nu forțează writes reale în producție.",
    evidence: ["feature flag plan", "task mutation audit pack", "shadow provider mode"],
    next: ["enable create task API path", "optimistic update rollback", "audit log persistence"]
  }
];

export function getTaskPageApiBridgeRelease() {
  const readiness = Math.round(
    taskPageApiBridgeCapabilities.reduce((sum, item) => sum + item.readiness, 0) / taskPageApiBridgeCapabilities.length
  );

  return {
    ok: true,
    version: "2.8.0",
    name: "Task Page API Bridge Activation",
    generatedAt: new Date().toISOString(),
    readiness,
    taskPageMode: "api-bridge-with-local-fallback",
    isFullProductionTaskSystem: false,
    summary:
      "v2.8 activează vizibil bridge-ul API în pagina Taskuri: verifică API-ul de taskuri și board-state, păstrând aceeași interfață și fallback local pentru stabilitate.",
    capabilities: taskPageApiBridgeCapabilities,
    productCompletion: {
      website: 82,
      taskProjectCore: 72,
      backendApi: 66,
      databasePrismaSeed: 58,
      authRbac: 43,
      iotOps: 37,
      mobileApp: 24
    },
    nextBuild: "v2.9.0 — Real Task Create/Update API UI Activation"
  };
}

export function getTaskPageApiBridgeHealth() {
  const release = getTaskPageApiBridgeRelease();
  const blockers = taskPageApiBridgeCapabilities.filter((item) => item.status === "blocked");
  const partial = taskPageApiBridgeCapabilities.filter((item) => item.status === "partial");

  return {
    ok: blockers.length === 0,
    version: release.version,
    generatedAt: new Date().toISOString(),
    readiness: release.readiness,
    blockers: blockers.length,
    partialItems: partial.length,
    isFullProductionTaskSystem: false,
    requiredBeforeProduction: [
      "Task create/update/delete persisted through repository adapter",
      "Subtasks/comments/attachments persisted",
      "RBAC mutation guard",
      "Audit event on every mutation",
      "Optimistic rollback and conflict handling"
    ]
  };
}

export function getTaskPageApiBridgeContract() {
  return {
    ok: true,
    version: "2.8.0",
    generatedAt: new Date().toISOString(),
    endpointsUsedByTaskPage: [
      "GET /api/v1/tasks",
      "GET /api/v1/projects",
      "GET /api/v1/tasks/board-state"
    ],
    endpointsPlannedForFullActivation: [
      "GET /api/v1/tasks/:id",
      "POST /api/v1/tasks",
      "PATCH /api/v1/tasks/:id",
      "PATCH /api/v1/tasks/:id/status",
      "POST /api/v1/tasks/reorder",
      "DELETE /api/v1/tasks/:id"
    ],
    fallbackMode: "Zustand/localStorage remains source of truth until DB writes are enabled",
    noVisualRedesign: true
  };
}

export function getTaskPageApiBridgePlan() {
  return {
    ok: true,
    version: "2.8.0",
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: "phase-1",
        title: "Safe visible bridge",
        status: "active",
        steps: ["show API bridge status in /taskuri", "fetch board-state", "show fallback/local status"]
      },
      {
        id: "phase-2",
        title: "Read path activation",
        status: "next",
        steps: ["hydrate task list from API", "server-side filters", "drawer detail API read"]
      },
      {
        id: "phase-3",
        title: "Write path activation",
        status: "planned",
        steps: ["create/update/delete through API", "optimistic rollback", "audit mutation events"]
      }
    ]
  };
}
