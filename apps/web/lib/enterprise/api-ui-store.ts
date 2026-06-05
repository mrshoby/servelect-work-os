export type ApiUiStoreStatus = "ready" | "partial" | "mock" | "blocked";
export type ApiUiStorePriority = "critical" | "high" | "medium" | "low";

export type ApiUiStoreLayer = {
  id: string;
  label: string;
  module: string;
  status: ApiUiStoreStatus;
  readiness: number;
  priority: ApiUiStorePriority;
  owner: string;
  currentProvider: "localStorage" | "mock-api" | "api-bridge" | "hybrid";
  targetProvider: "api-backed-store" | "database-backed-api" | "realtime-api";
  description: string;
  nextAction: string;
};

export type ApiUiStoreRouteContract = {
  id: string;
  route: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  purpose: string;
  uiConsumers: string[];
  status: ApiUiStoreStatus;
};

export type ApiUiStoreIntegrationStep = {
  id: string;
  title: string;
  phase: string;
  status: ApiUiStoreStatus;
  priority: ApiUiStorePriority;
  checklist: string[];
};

export const apiUiStoreLayers: ApiUiStoreLayer[] = [
  {
    id: "task-ui-store",
    label: "Task UI store",
    module: "Taskuri",
    status: "partial",
    readiness: 76,
    priority: "critical",
    owner: "Product Engineering",
    currentProvider: "localStorage",
    targetProvider: "api-backed-store",
    description: "Task Center folosește încă Zustand/localStorage pentru interacțiuni rapide. v1.8 definește contractul de migrare spre API-backed store fără schimbare vizuală.",
    nextAction: "Conectează TaskFiltersBar, TaskDrawer și TaskCreateModal la /api/v1/tasks printr-un feature flag controlat."
  },
  {
    id: "project-ui-store",
    label: "Project UI store",
    module: "Proiecte",
    status: "partial",
    readiness: 72,
    priority: "critical",
    owner: "Project Ops",
    currentProvider: "hybrid",
    targetProvider: "api-backed-store",
    description: "Proiectele sunt prezente în mock data și API routes. Următorul pas este sincronizarea listelor, progresului și taskurilor asociate prin API.",
    nextAction: "Creează query layer pentru /api/v1/projects și fallback pe mock data în caz de eroare."
  },
  {
    id: "drawer-interactions",
    label: "Task drawer interactions",
    module: "Task detail",
    status: "partial",
    readiness: 68,
    priority: "high",
    owner: "UX Engineering",
    currentProvider: "localStorage",
    targetProvider: "api-backed-store",
    description: "Drawer-ul de task trebuie să trimită status, comentarii, checklist și timer prin API, dar să păstreze aceeași interfață.",
    nextAction: "Adaugă optimistic updates și rollback la eroare pentru status, comments și checklist."
  },
  {
    id: "crud-api-contract",
    label: "CRUD API contract",
    module: "API Work OS",
    status: "ready",
    readiness: 88,
    priority: "critical",
    owner: "Backend Architecture",
    currentProvider: "mock-api",
    targetProvider: "database-backed-api",
    description: "v1.7 a introdus baza pentru /api/v1/tasks și /api/v1/projects. v1.8 marchează contractul ca interfață de consum pentru UI.",
    nextAction: "Introduce contract tests pentru GET/POST/PATCH/DELETE și seed deterministic."
  },
  {
    id: "offline-cache",
    label: "Offline cache strategy",
    module: "Mobile / Field",
    status: "mock",
    readiness: 42,
    priority: "medium",
    owner: "Mobile Engineering",
    currentProvider: "localStorage",
    targetProvider: "realtime-api",
    description: "Strategia offline este documentată, dar nu este încă conectată la mobile runtime."
    ,nextAction: "Definește queue locală pentru acțiuni offline și sync după reconectare."
  },
  {
    id: "realtime-updates",
    label: "Realtime updates",
    module: "Live Work OS",
    status: "blocked",
    readiness: 28,
    priority: "high",
    owner: "Platform Engineering",
    currentProvider: "mock-api",
    targetProvider: "realtime-api",
    description: "Live updates au nevoie de WebSocket/SSE și Redis pub/sub pentru producție."
    ,nextAction: "Alege SSE pentru MVP și WebSocket pentru dispatch/IoT live."
  }
];

export const apiUiStoreRouteContracts: ApiUiStoreRouteContract[] = [
  {
    id: "tasks-list",
    route: "/api/v1/tasks",
    method: "GET",
    purpose: "Listează taskurile pentru Task Center, dashboard, Action Center și module operaționale.",
    uiConsumers: ["/taskuri", "/", "/action-center", "/admin/task-crud"],
    status: "ready"
  },
  {
    id: "tasks-create",
    route: "/api/v1/tasks",
    method: "POST",
    purpose: "Creează taskuri din UI, IoT alerts, CRM follow-up sau ticket mentenanță.",
    uiConsumers: ["TaskCreateModal", "IoT alerts", "Mentenanță", "CRM"],
    status: "partial"
  },
  {
    id: "tasks-update",
    route: "/api/v1/tasks/:id",
    method: "PATCH",
    purpose: "Actualizează status, prioritate, assignee, due date, timer și checklist.",
    uiConsumers: ["TaskDrawer", "Kanban", "Task Table", "Approvals"],
    status: "partial"
  },
  {
    id: "projects-list",
    route: "/api/v1/projects",
    method: "GET",
    purpose: "Alimentează lista de proiecte, dashboard-ul, CRM/project relations și workload.",
    uiConsumers: ["/proiecte", "/", "/admin/task-projects"],
    status: "ready"
  },
  {
    id: "enterprise-task-crud",
    route: "/api/v1/enterprise/task-crud",
    method: "GET",
    purpose: "Expune readiness-ul pentru trecerea UI-ului la API-backed store.",
    uiConsumers: ["/admin/task-crud", "/admin/api-ui-store"],
    status: "ready"
  }
];

export const apiUiStoreIntegrationSteps: ApiUiStoreIntegrationStep[] = [
  {
    id: "feature-flag-api-store",
    title: "Feature flag pentru API-backed store",
    phase: "v1.8",
    status: "ready",
    priority: "critical",
    checklist: [
      "Definește flag SERVELECT_API_BACKED_UI_STORE",
      "Păstrează fallback localStorage pentru demo",
      "Nu schimba interfața vizuală existentă"
    ]
  },
  {
    id: "task-query-layer",
    title: "Task query/mutation layer",
    phase: "v1.8 → v1.9",
    status: "partial",
    priority: "critical",
    checklist: [
      "GET /api/v1/tasks pentru listă",
      "POST /api/v1/tasks pentru TaskCreateModal",
      "PATCH /api/v1/tasks/:id pentru status/assignee/due date",
      "Optimistic update cu rollback"
    ]
  },
  {
    id: "project-query-layer",
    title: "Project query layer",
    phase: "v1.9",
    status: "partial",
    priority: "high",
    checklist: [
      "GET /api/v1/projects",
      "Proiecte legate de taskuri",
      "Fallback mock data la eroare",
      "Skeleton loading pentru UI"
    ]
  },
  {
    id: "persisted-audit-actions",
    title: "Audit pe acțiuni UI",
    phase: "v1.9",
    status: "mock",
    priority: "high",
    checklist: [
      "Audit event la create task",
      "Audit event la update status",
      "Audit event la assign/reassign",
      "Audit event la delete/archive"
    ]
  },
  {
    id: "database-provider-switch",
    title: "Switch provider mock-memory → PostgreSQL",
    phase: "v2.0",
    status: "blocked",
    priority: "critical",
    checklist: [
      "DATABASE_URL configurat",
      "Prisma migrations aplicate",
      "Seed deterministic",
      "Repository real activat prin env"
    ]
  }
];

export function getApiUiStoreRelease() {
  const readiness = Math.round(apiUiStoreLayers.reduce((sum, layer) => sum + layer.readiness, 0) / apiUiStoreLayers.length);
  const criticalOpen = apiUiStoreLayers.filter((layer) => layer.priority === "critical" && layer.status !== "ready").length;

  return {
    ok: true,
    version: "1.8.0",
    name: "API-backed UI Store Integration Pack",
    generatedAt: new Date().toISOString(),
    summary: "v1.8 conectează strategia de UI store la API contractele task/project introduse în v1.7, fără să modifice interfața vizuală existentă.",
    readiness,
    criticalOpen,
    layers: apiUiStoreLayers,
    routeContracts: apiUiStoreRouteContracts,
    nextBuild: "v1.9.0 — UI Task Store Feature Flag Pack"
  };
}

export function getApiUiStoreHealth() {
  const release = getApiUiStoreRelease();
  const blocked = apiUiStoreLayers.filter((layer) => layer.status === "blocked");
  const partial = apiUiStoreLayers.filter((layer) => layer.status === "partial");

  return {
    ok: blocked.length === 0,
    version: release.version,
    generatedAt: release.generatedAt,
    readiness: release.readiness,
    blocked: blocked.length,
    partial: partial.length,
    provider: "hybrid-localStorage-api-contract",
    productionSafe: true,
    note: "UI-ul rămâne stabil. Store-ul API-backed este pregătit prin contract și feature flag, nu forțat peste tot."
  };
}

export function getApiUiStoreIntegrationPlan() {
  return {
    ok: true,
    version: "1.8.0",
    generatedAt: new Date().toISOString(),
    title: "API-backed UI Store integration plan",
    principle: "Integrare progresivă, fără schimbare de design și fără blocarea paginilor existente.",
    steps: apiUiStoreIntegrationSteps,
    rollback: [
      "Dezactivează feature flag-ul API-backed store",
      "Revino la localStorage/Zustand provider",
      "Păstrează route handlers active pentru testare",
      "Nu modifica schema UI până când DB provider nu este stabil"
    ]
  };
}
