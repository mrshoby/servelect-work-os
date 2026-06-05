export type RealTaskUiStatus = "ready" | "partial" | "planned" | "blocked";
export type RealTaskMutationMode = "api-backed-local-memory" | "api-backed-shadow" | "db-write-gated" | "db-active";

export type RealTaskUiCapability = {
  id: string;
  label: string;
  status: RealTaskUiStatus;
  readiness: number;
  mode: RealTaskMutationMode;
  route: string;
  description: string;
  done: string[];
  missing: string[];
};

export const realTaskUiCapabilities: RealTaskUiCapability[] = [
  {
    id: "create-task-ui",
    label: "Create task from UI",
    status: "ready",
    readiness: 82,
    mode: "api-backed-local-memory",
    route: "POST /api/v1/tasks",
    description: "UI-ul poate crea un task prin API folosind providerul curent mock-memory, fără să modifice designul paginii principale.",
    done: ["API create route exists", "UI mutation panel added", "local fallback remains safe", "validation for title/project is visible"],
    missing: ["Prisma active write mode", "RBAC server guard", "persistent DB audit log"]
  },
  {
    id: "update-task-ui",
    label: "Update task status from UI",
    status: "ready",
    readiness: 78,
    mode: "api-backed-local-memory",
    route: "PATCH /api/v1/tasks",
    description: "UI-ul poate trimite update de status/prioritate către API. Rezultatul este refresh-uit din API și poate fi folosit ca bridge pentru board.",
    done: ["PATCH contract exists", "status allowlist preserved", "refresh after mutation", "safe error handling"],
    missing: ["optimistic rollback for every board move", "server-side field allowlist hardening", "persistent activity timeline"]
  },
  {
    id: "task-list-refresh",
    label: "Refresh task list from API",
    status: "ready",
    readiness: 84,
    mode: "api-backed-local-memory",
    route: "GET /api/v1/tasks",
    description: "Panoul de activare poate citi taskuri reale din API și afișa ultimele rezultate după create/update.",
    done: ["GET /api/v1/tasks used by UI", "loading/error states", "count and recent rows shown"],
    missing: ["server-side pagination", "query caching", "TanStack Query migration"]
  },
  {
    id: "task-detail-drawer-write",
    label: "Task drawer write integration",
    status: "partial",
    readiness: 64,
    mode: "api-backed-shadow",
    route: "drawer -> /api/v1/tasks planned wiring",
    description: "Drawer-ul are contractul pregătit, dar mutațiile directe din drawer trebuie legate într-un build separat ca să nu stricăm UI-ul existent.",
    done: ["contract exists", "admin status visible", "API shape stable"],
    missing: ["edit fields in drawer", "comments/subtasks persistence", "attachments provider"]
  },
  {
    id: "db-write-activation",
    label: "DB-backed production writes",
    status: "planned",
    readiness: 48,
    mode: "db-write-gated",
    route: "repository adapter -> Prisma",
    description: "Scrierile reale în PostgreSQL rămân gated. v2.9 activează UI/API bridge, nu Prisma production writes.",
    done: ["write-gate model documented", "repository adapter plan exists", "shadow status documented"],
    missing: ["DATABASE_URL production", "Prisma migrations applied", "RBAC and audit enforcement", "backup/rollback plan"]
  }
];

export function getRealTaskUiActivationRelease() {
  const readiness = Math.round(realTaskUiCapabilities.reduce((sum, item) => sum + item.readiness, 0) / realTaskUiCapabilities.length);
  const readyItems = realTaskUiCapabilities.filter((item) => item.status === "ready").length;
  const partialItems = realTaskUiCapabilities.filter((item) => item.status === "partial").length;

  return {
    ok: true,
    version: "2.9.0",
    name: "Real Task Create/Update API UI Activation",
    generatedAt: new Date().toISOString(),
    readiness,
    isFullProductionTaskSystem: false,
    uiMode: "api-mutations-enabled-with-local-memory-provider",
    provider: "mock-memory",
    dbWritesEnabled: false,
    summary:
      "v2.9 activează un UI real de create/update task prin API. Taskurile pot fi create și actualizate prin /api/v1/tasks, dar providerul este încă mock-memory până la activarea Prisma write-gated.",
    productCompletion: {
      overallCompletion: 83,
      website: 83,
      taskProjectCore: 74,
      backendApi: 70,
      databasePrismaSeed: 60,
      authRbac: 44,
      iotOps: 38,
      mobileApp: 25
    },
    capabilities: realTaskUiCapabilities,
    metrics: {
      readyItems,
      partialItems,
      plannedItems: realTaskUiCapabilities.filter((item) => item.status === "planned").length,
      blockedItems: realTaskUiCapabilities.filter((item) => item.status === "blocked").length
    },
    nextBuild: "v3.0.0 — Production Task CRUD Stabilization & Prisma Write-Gate"
  };
}

export function getRealTaskUiActivationHealth() {
  const release = getRealTaskUiActivationRelease();
  const blocked = realTaskUiCapabilities.filter((item) => item.status === "blocked");
  const notReady = realTaskUiCapabilities.filter((item) => item.status !== "ready");

  return {
    ok: blocked.length === 0,
    version: release.version,
    generatedAt: new Date().toISOString(),
    readiness: release.readiness,
    taskUiMutationsEnabled: true,
    fullProduction: false,
    provider: release.provider,
    blocked: blocked.length,
    notReady: notReady.length,
    requiredBeforeFullProduction: [
      "Persist task create/update/delete through Prisma repository adapter",
      "Enable RBAC server-side mutation guard",
      "Write audit events for each mutation",
      "Add optimistic rollback and conflict handling",
      "Persist comments, subtasks, attachments and time entries",
      "Run E2E tests against deployed Vercel URL"
    ]
  };
}

export function getRealTaskUiActivationContract() {
  return {
    ok: true,
    version: "2.9.0",
    generatedAt: new Date().toISOString(),
    endpointsActivatedInUi: [
      "GET /api/v1/tasks",
      "POST /api/v1/tasks",
      "PATCH /api/v1/tasks",
      "GET /api/v1/projects"
    ],
    uiComponents: ["TaskApiMutationPanel", "TaskApiBridgeBanner"],
    safeFallback: "Existing Zustand/localStorage task UI remains available. The v2.9 panel uses API as an activation layer.",
    writeMode: "mock-memory API now; Prisma DB write-gate later",
    noVisualRedesign: true
  };
}

export function getRealTaskUiActivationPlan() {
  return {
    ok: true,
    version: "2.9.0",
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: "phase-1",
        title: "API mutation panel",
        status: "active",
        steps: ["load tasks from API", "create task from UI", "update task status from UI", "show API response/errors"]
      },
      {
        id: "phase-2",
        title: "Task page native integration",
        status: "next",
        steps: ["connect main create button to API", "refresh task table from API", "sync board state after PATCH"]
      },
      {
        id: "phase-3",
        title: "Prisma write-gate",
        status: "planned",
        steps: ["enable repository adapter", "shadow compare results", "audit every mutation", "roll back on mismatch"]
      }
    ]
  };
}
