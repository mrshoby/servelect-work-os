export type BoardDrawerReadinessStatus = "ready" | "partial" | "planned" | "blocked";

export type TaskBoardDrawerCapability = {
  id: string;
  label: string;
  status: BoardDrawerReadinessStatus;
  readiness: number;
  description: string;
  apiContract: string;
  next: string[];
};

export const boardDrawerCapabilities: TaskBoardDrawerCapability[] = [
  {
    id: "api-board-state",
    label: "API board state",
    status: "ready",
    readiness: 82,
    description: "Board-ul are un endpoint dedicat pentru starea coloanelor, task cards și metadate de sincronizare.",
    apiContract: "GET /api/v1/tasks/board-state",
    next: ["conectare efectivă în /taskuri", "stale-while-revalidate", "server-side filters"]
  },
  {
    id: "drawer-hydration",
    label: "Task drawer hydration",
    status: "partial",
    readiness: 68,
    description: "Drawer-ul poate fi hidratat prin contract API, dar UI-ul existent încă folosește store local ca fallback.",
    apiContract: "GET /api/v1/tasks/:id planned",
    next: ["endpoint task detail", "comments/subtasks include", "attachments metadata"]
  },
  {
    id: "optimistic-status-change",
    label: "Optimistic status change",
    status: "partial",
    readiness: 64,
    description: "Plan pentru schimbarea statusului cu update instant în UI și rollback dacă API-ul eșuează.",
    apiContract: "PATCH /api/v1/tasks/:id/status planned",
    next: ["rollback queue", "toast errors", "audit event"]
  },
  {
    id: "drag-drop-persistence",
    label: "Drag/drop persistence",
    status: "planned",
    readiness: 46,
    description: "Drag/drop pe board trebuie să salveze ordinea/statusul prin API, nu doar local.",
    apiContract: "POST /api/v1/tasks/reorder planned",
    next: ["column order model", "conflict detection", "server-side rank"]
  },
  {
    id: "drawer-save",
    label: "Drawer save API",
    status: "partial",
    readiness: 58,
    description: "Câmpurile principale din drawer sunt pregătite pentru salvare prin API-backed store.",
    apiContract: "PATCH /api/v1/tasks/:id planned",
    next: ["field validation", "RBAC mutation guard", "activity log append"]
  },
  {
    id: "offline-fallback",
    label: "Offline/local fallback",
    status: "partial",
    readiness: 60,
    description: "Fallback localStorage rămâne pentru stabilitate până când DB provider devine production-active.",
    apiContract: "localStorage fallback + feature flags",
    next: ["sync queue", "dirty state marker", "retry failed mutations"]
  }
];

export const taskBoardColumns = [
  { id: "backlog", label: "Backlog", count: 7, apiStatus: "Backlog" },
  { id: "todo", label: "De făcut", count: 14, apiStatus: "De făcut" },
  { id: "in-progress", label: "În lucru", count: 11, apiStatus: "În lucru" },
  { id: "review", label: "Review / QA", count: 5, apiStatus: "Review / QA" },
  { id: "blocked", label: "Blocat", count: 3, apiStatus: "Blocat" },
  { id: "done", label: "Finalizat", count: 22, apiStatus: "Finalizat" }
];

export const demoTaskCards = [
  {
    id: "task-api-001",
    title: "Legare TaskTable la API bridge",
    projectCode: "P-2024-0187",
    status: "În lucru",
    priority: "Urgent",
    assigneeName: "Ioana Marinescu",
    dirty: false,
    source: "api-shadow"
  },
  {
    id: "task-api-002",
    title: "Drawer save cu optimistic update",
    projectCode: "P-2024-0103",
    status: "Review / QA",
    priority: "Ridicat",
    assigneeName: "Andrei Popescu",
    dirty: true,
    source: "local-pending"
  },
  {
    id: "task-api-003",
    title: "Audit event pentru schimbare status",
    projectCode: "P-2024-0142",
    status: "De făcut",
    priority: "Mediu",
    assigneeName: "Alexandra Rusu",
    dirty: false,
    source: "api-shadow"
  },
  {
    id: "task-api-004",
    title: "Board rank persistence model",
    projectCode: "P-2024-0098",
    status: "Backlog",
    priority: "Scăzut",
    assigneeName: "Mihai Ionescu",
    dirty: false,
    source: "mock-memory"
  }
];

export function getTaskBoardDrawerPack() {
  const readiness = Math.round(boardDrawerCapabilities.reduce((sum, item) => sum + item.readiness, 0) / boardDrawerCapabilities.length);

  return {
    ok: true,
    version: "2.7.0",
    name: "API-backed Task Board & Drawer Pack",
    generatedAt: new Date().toISOString(),
    readiness,
    providerMode: "api-shadow-with-local-fallback",
    isProductionDbActive: false,
    summary:
      "v2.7 pregătește board-ul și drawer-ul de taskuri pentru API-backed UI. Nu activează încă DB production writes, dar definește contractul și dashboard-ul de control.",
    capabilities: boardDrawerCapabilities,
    boardColumns: taskBoardColumns,
    demoTaskCards,
    nextBuild: "v2.8.0 — Task Page API Bridge Activation"
  };
}

export function getTaskBoardDrawerHealth() {
  const pack = getTaskBoardDrawerPack();
  const blockers = boardDrawerCapabilities.filter((capability) => capability.status === "blocked");
  const planned = boardDrawerCapabilities.filter((capability) => capability.status === "planned");

  return {
    ok: blockers.length === 0,
    version: pack.version,
    generatedAt: new Date().toISOString(),
    readiness: pack.readiness,
    providerMode: pack.providerMode,
    blockers,
    planned,
    checks: [
      { id: "board-state-endpoint", label: "Board state endpoint", ok: true },
      { id: "drawer-contract", label: "Drawer detail/save contract", ok: true },
      { id: "db-write-gate", label: "DB write gate protected", ok: true },
      { id: "production-db-writes", label: "Production DB writes active", ok: false },
      { id: "ui-wired", label: "/taskuri fully API-wired", ok: false }
    ]
  };
}

export function getTaskBoardDrawerContract() {
  return {
    ok: true,
    version: "2.7.0",
    generatedAt: new Date().toISOString(),
    contracts: [
      {
        method: "GET",
        path: "/api/v1/tasks/board-state",
        purpose: "Returnează coloane, task cards și sync metadata pentru board."
      },
      {
        method: "GET",
        path: "/api/v1/tasks",
        purpose: "Listă taskuri, cu fallback mock-memory."
      },
      {
        method: "POST",
        path: "/api/v1/tasks",
        purpose: "Create task prin API-backed store, încă mock-memory/shadow pentru moment."
      },
      {
        method: "PATCH",
        path: "/api/v1/tasks/:id",
        purpose: "Actualizare task/drawer fields — planned pentru v2.8/v2.9."
      },
      {
        method: "POST",
        path: "/api/v1/tasks/reorder",
        purpose: "Persistență rank/order după drag/drop — planned."
      }
    ],
    drawerFields: [
      "title",
      "description",
      "status",
      "priority",
      "assignee",
      "owner",
      "project",
      "dueDate",
      "estimateHours",
      "trackedHours",
      "tags",
      "subtasks",
      "comments",
      "attachments",
      "activityLog"
    ]
  };
}

export function getTaskBoardDrawerPlan() {
  return {
    ok: true,
    version: "2.7.0",
    generatedAt: new Date().toISOString(),
    phases: [
      {
        id: "v2.8",
        title: "Task Page API Bridge Activation",
        goal: "Pagina /taskuri citește taskuri din API bridge cu fallback local.",
        tasks: ["hydrate list/board from API", "status update via API", "drawer fetch on open", "fallback localStorage"]
      },
      {
        id: "v2.9",
        title: "Comments/Subtasks Persistence",
        goal: "Subtaskurile și comentariile devin API-backed.",
        tasks: ["comment CRUD", "subtask CRUD", "activity log", "audit events"]
      },
      {
        id: "v3.0",
        title: "Production DB Task Core",
        goal: "Task core trece pe DB provider real, cu RBAC și audit.",
        tasks: ["Prisma writes", "server-side pagination", "RBAC mutation guard", "attachments metadata"]
      }
    ]
  };
}

export function getTaskBoardState() {
  return {
    ok: true,
    version: "2.7.0",
    generatedAt: new Date().toISOString(),
    providerMode: "api-shadow-with-local-fallback",
    sync: {
      source: "mock-memory",
      fallback: "localStorage",
      dirtyItems: demoTaskCards.filter((task) => task.dirty).length,
      lastSyncedAt: new Date().toISOString()
    },
    columns: taskBoardColumns,
    cards: demoTaskCards
  };
}
