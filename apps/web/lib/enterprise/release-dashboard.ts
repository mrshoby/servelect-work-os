export type ProductAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked";

export type ProductCompletionArea = {
  id: string;
  label: string;
  completion: number;
  status: ProductAreaStatus;
  summary: string;
  done: string[];
  next: string[];
};

export type ReleaseChangelogItem = {
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "fix";
  status: "deployed" | "ready" | "planned";
  highlights: string[];
  next: string[];
};

export const currentRelease = {
  version: "2.7.0",
  name: "API-backed Task Board & Drawer Pack",
  status: "beta" as const,
  generatedAt: new Date().toISOString(),
  releaseChannel: "enterprise-beta",
  summary:
    "v2.7 conectează conceptual board-ul și drawer-ul de taskuri la API-backed store: board state, drawer contract, optimistic update plan, dirty-state handling și rollback strategy. UI-ul existent rămâne păstrat, dar primește fundația pentru hidratare API reală în build-urile următoare."
};

export const productCompletion: ProductCompletionArea[] = [
  {
    id: "web-app",
    label: "Website / Web App",
    completion: 80,
    status: "beta",
    summary: "Interfața web este utilizabilă ca enterprise beta: dashboard-uri, module principale, admin readiness, changelog și audit route coverage.",
    done: [
      "layout enterprise cu sidebar/topbar",
      "dashboard, taskuri, proiecte și module operaționale",
      "release-status + changelog vizibile pe site",
      "pagini admin pentru DB/Auth/Task/Prisma readiness"
    ],
    next: [
      "legare UI reală la API pentru task create/update/delete",
      "testare browser completă pentru slowdowns",
      "stabilizare responsive tablet/mobile web"
    ]
  },
  {
    id: "task-project-core",
    label: "Task & Project Core",
    completion: 68,
    status: "partial",
    summary: "Taskurile au UI, board/list/drawer, API contracts și feature flags. Încă nu sunt complet DB-backed production.",
    done: [
      "task table/board optimizate",
      "task drawer păstrat ca UX central",
      "API contracts pentru /api/v1/tasks și /api/v1/projects",
      "board/drawer API bridge plan în v2.7"
    ],
    next: [
      "mutations reale din UI către API",
      "comments/subtasks/attachments persistente",
      "server-side filtering/sorting/pagination",
      "audit event la fiecare schimbare task"
    ]
  },
  {
    id: "backend-api",
    label: "Backend / API",
    completion: 62,
    status: "partial",
    summary: "Există multe endpoints enterprise și contracte API, dar providerul real DB este încă controlat / shadow-mode.",
    done: [
      "API readiness endpoints",
      "task/project API foundation",
      "task board state endpoint",
      "release and product completion APIs"
    ],
    next: [
      "repository adapter activ pentru task mutations",
      "API validation cu schema runtime",
      "rate-limit/error envelope consistent"
    ]
  },
  {
    id: "database-prisma",
    label: "Database / Prisma / Seed",
    completion: 55,
    status: "partial",
    summary: "Schema/seed/runtime plan există, dar DB production-write încă nu este activat implicit.",
    done: [
      "Prisma schema/seed planning",
      "DB provider runtime planning",
      "Prisma shadow mode plan",
      "repository adapter plan"
    ],
    next: [
      "seed execution real",
      "shadow read compare cu API mock",
      "write-gate pentru task mutations",
      "migration scripts verificate"
    ]
  },
  {
    id: "auth-rbac",
    label: "Auth / RBAC",
    completion: 42,
    status: "partial",
    summary: "RBAC/admin foundation există, dar Auth.js/SSO production și enforcement complet pe API nu sunt încă finalizate.",
    done: ["role/permission readiness", "protected app foundation", "user management demo"],
    next: ["Auth.js/SSO real", "server-side RBAC enforcement", "audit security events", "persistent users/sessions"]
  },
  {
    id: "iot-ops",
    label: "IoT / Ops / Mentenanță",
    completion: 36,
    status: "mock",
    summary: "Modulele există în UI și concept, dar integrarea reală IoT/alarme/tickete nu este încă production.",
    done: ["IoT dashboard mock", "maintenance/ticket pages", "task-first concept"],
    next: ["alerts -> tickets real", "TimescaleDB/MQTT/Modbus plan", "dispatch workflow", "SLA automation"]
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    completion: 23,
    status: "mock",
    summary: "Mobile rămâne schelet Expo/concept. Nu este încă app completă pentru teren.",
    done: ["Expo skeleton", "mobile concept screens", "field technician flow planned"],
    next: ["bottom nav real", "offline queue", "GPS/QR/photo flows", "task sync with API"]
  }
];

export const releaseChangelog: ReleaseChangelogItem[] = [
  {
    version: "2.7.0",
    date: "2026-06-05",
    title: "API-backed Task Board & Drawer Pack",
    type: "major",
    status: "ready",
    highlights: [
      "Adaugă /admin/task-board-drawer pentru status board/drawer API integration.",
      "Adaugă endpoint-uri enterprise pentru board/drawer contract, health și plan.",
      "Adaugă /api/v1/tasks/board-state ca endpoint demo pentru board state API-backed.",
      "Actualizează release-status și changelog la v2.7 cu procente reale de progres."
    ],
    next: [
      "v2.8 — Task Page API Bridge Activation",
      "Mutations reale din UI către /api/v1/tasks",
      "Drawer hydrate/save cu optimistic update + rollback"
    ]
  },
  {
    version: "2.6.0",
    date: "2026-06-05",
    title: "Task UI API Wiring Pack",
    type: "major",
    status: "ready",
    highlights: ["Client API pentru taskuri", "useTaskApiBridge hook", "contracte UI/API pentru task store"],
    next: ["Board/drawer API-backed", "UI task store feature flag activation"]
  },
  {
    version: "2.5.0",
    date: "2026-06-05",
    title: "DB-backed Task Mutations Pack",
    type: "major",
    status: "ready",
    highlights: ["plan pentru create/update/delete task", "task mutation audit", "write-gated/shadow mode"],
    next: ["conectare UI reală la task mutations"]
  },
  {
    version: "2.4.0",
    date: "2026-06-05",
    title: "Prisma Seed Execution & Repository Adapter Pack",
    type: "major",
    status: "ready",
    highlights: ["release status dashboard", "changelog", "product completion percentages", "repository adapter plan"],
    next: ["seed execution real", "DB-backed repository adapter"]
  },
  {
    version: "2.3.0",
    date: "2026-06-05",
    title: "Prisma Runtime Shadow Mode Pack",
    type: "major",
    status: "ready",
    highlights: ["Prisma shadow mode", "task functionality status", "task completeness dashboard"],
    next: ["repository adapter wiring"]
  }
];

export const nextUpdates = [
  {
    version: "2.8.0",
    title: "Task Page API Bridge Activation",
    priority: "critical",
    goal: "Pagina /taskuri începe să citească din API bridge cu fallback localStorage, fără să schimbe UI-ul vizual.",
    scope: ["hydrate tasks from /api/v1/tasks", "status update via API", "drawer save through API", "rollback on failure"]
  },
  {
    version: "2.9.0",
    title: "Task Comments/Subtasks Persistence Pack",
    priority: "high",
    goal: "Subtaskuri și comentarii salvate prin API/repository adapter.",
    scope: ["comment CRUD", "subtask CRUD", "activity log", "audit events"]
  },
  {
    version: "3.0.0",
    title: "Production DB Task Core",
    priority: "critical",
    goal: "Task core trece din mock-memory/localStorage în DB-backed production mode controlat.",
    scope: ["PostgreSQL provider active", "Prisma writes", "seed data", "RBAC enforced mutations"]
  }
];

export function getReleaseStatus() {
  const average = Math.round(productCompletion.reduce((sum, item) => sum + item.completion, 0) / productCompletion.length);

  return {
    ok: true,
    ...currentRelease,
    overallCompletion: average,
    websiteCompletion: productCompletion.find((item) => item.id === "web-app")?.completion ?? average,
    appCompletion: productCompletion.find((item) => item.id === "mobile-app")?.completion ?? 0,
    areas: productCompletion,
    latestChangelog: releaseChangelog[0],
    nextUpdates
  };
}

export function getReleaseChangelog() {
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    changelog: releaseChangelog
  };
}

export function getProductCompletion() {
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    areas: productCompletion,
    overallCompletion: Math.round(productCompletion.reduce((sum, item) => sum + item.completion, 0) / productCompletion.length)
  };
}

export function getNextUpdates() {
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    updates: nextUpdates
  };
}
