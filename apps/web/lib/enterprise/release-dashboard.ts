export type ProductAreaStatus = "stable" | "beta" | "partial" | "mock" | "blocked" | "risk" | "early" | "progress";

export type ProductCompletionArea = {
  id: string;
  label: string;
  completion: number;
  percent: number;
  status: ProductAreaStatus;
  summary: string;
  done: string[];
  next: string[];
};

export type CompletionArea = ProductCompletionArea;

export type ReleaseChangelogItem = {
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "fix";
  status: "deployed" | "ready" | "planned" | "current" | "baseline" | "shipped";
  highlights: string[];
  shipped: string[];
  next: string[];
};

export type ChangelogEntry = ReleaseChangelogItem;

export const currentRelease = {
  version: "3.0.0",
  name: "Production Task CRUD Stabilization & Prisma Write-Gate",
  status: "beta" as const,
  generatedAt: new Date().toISOString(),
  releaseChannel: "enterprise-beta",
  productStatus: "Enterprise beta — production task CRUD stabilization stage",
  betaReadiness: 74,
  productionReadiness: 56,
  websiteReadiness: 84,
  mobileReadiness: 25,
  nextMajor: "v3.1.0 — Prisma Task Repository Adapter Activation",
  summary:
    "v3.0 marchează trecerea de la simple readiness pages la stabilizarea nucleului de Task CRUD: write-gate explicit pentru Prisma/PostgreSQL, create/update/delete în regim guarded, audit prerequisites și roadmap clar pentru activarea DB-backed task mutations."
};

export const productCompletion: ProductCompletionArea[] = [
  {
    id: "web-app",
    label: "Website / Web App",
    completion: 84,
    percent: 84,
    status: "beta",
    summary: "Interfața web este funcțională ca beta internă enterprise: dashboard, taskuri, proiecte, admin status, changelog și module principale.",
    done: ["layout enterprise", "module principale", "release status/changelog", "task API bridge", "admin CRUD/write-gate"],
    next: ["smoke tests automate", "polish responsive", "error boundary per modul"]
  },
  {
    id: "task-project-core",
    label: "Task & Project Core",
    completion: 72,
    percent: 72,
    status: "partial",
    summary: "Taskurile au UI, API contracts, create/update panel și write-gate. Încă nu sunt complet Prisma/PostgreSQL-backed production.",
    done: ["task table/board", "drawer", "API client", "mutation panel", "write-gate plan"],
    next: ["Prisma repository adapter", "real persisted create/update/archive", "subtasks/comments/time entries", "server pagination"]
  },
  {
    id: "backend-api",
    label: "Backend / API",
    completion: 68,
    percent: 68,
    status: "partial",
    summary: "API-urile enterprise și task/project contracts există; providerul DB real este încă write-gated.",
    done: ["task/project endpoints", "board state", "enterprise status endpoints", "write-gate status"],
    next: ["repository adapter", "server validation", "audit events", "RBAC guards"]
  },
  {
    id: "database",
    label: "Database / Prisma",
    completion: 59,
    percent: 59,
    status: "partial",
    summary: "Schema/seed/shadow/write-gate sunt definite, dar scrierile production în PostgreSQL nu sunt încă active.",
    done: ["schema readiness", "seed plan", "shadow mode", "write-gate"],
    next: ["PrismaTaskRepository", "migration tests", "staging DATABASE_URL", "seed execution real"]
  },
  {
    id: "auth",
    label: "Auth / RBAC",
    completion: 43,
    percent: 43,
    status: "risk",
    summary: "Există fundație RBAC, dar Auth.js/SSO și enforcement complet pe API sunt încă incomplete.",
    done: ["role matrix", "admin readiness", "permission plan"],
    next: ["Auth.js", "session persistence", "API permission guards", "security audit log"]
  },
  {
    id: "iot-ops",
    label: "IoT / Operațiuni energie",
    completion: 37,
    percent: 37,
    status: "early",
    summary: "Modulele IoT/energie există în UX, dar date live/Timescale/MQTT nu sunt încă active.",
    done: ["energy module UI", "alert to task concept", "maintenance integration"],
    next: ["TimescaleDB", "MQTT/Modbus ingest", "alert to ticket real", "SLA dispatch"]
  },
  {
    id: "mobile",
    label: "Mobile App",
    completion: 25,
    percent: 25,
    status: "early",
    summary: "Mobile rămâne schelet/concept Expo; încă nu este aplicație field technician production.",
    done: ["mobile architecture", "screen concepts"],
    next: ["Expo screens reale", "offline queue", "GPS/check-in", "foto și semnătură client"]
  }
];

export const completionAreas: CompletionArea[] = productCompletion;

export const changelog: ReleaseChangelogItem[] = [
  {
    version: "3.0.0",
    date: "2026-06-05",
    title: "Production Task CRUD Stabilization & Prisma Write-Gate",
    type: "major",
    status: "current",
    highlights: ["Task CRUD write-gate", "production guard rules", "admin production CRUD page", "release status v3"],
    shipped: [
      "Adaugă /admin/production-task-crud pentru statusul Task CRUD production.",
      "Adaugă endpoints enterprise pentru production-task-crud, health, write-gate și plan.",
      "Definește condițiile de activare Prisma/PostgreSQL writes fără să forțeze DATABASE_URL la build.",
      "Actualizează release dashboard la v3.0 cu procente website/app/module."
    ],
    next: ["v3.1 Prisma Task Repository Adapter", "v3.2 UI production mutations", "v3.3 subtasks/comments/time entries"]
  },
  {
    version: "2.9.0",
    date: "2026-06-05",
    title: "Real Task Create/Update API UI Activation",
    type: "major",
    status: "deployed",
    highlights: ["TaskApiMutationPanel", "create/update UI", "mock-memory provider"],
    shipped: ["Real UI panel pentru POST/PATCH task", "Admin page real-task-ui-activation", "API readiness endpoints"],
    next: ["write-gate", "Prisma adapter", "audit/RBAC"]
  },
  {
    version: "2.8.0",
    date: "2026-06-05",
    title: "Task Page API Bridge Activation",
    type: "major",
    status: "deployed",
    highlights: ["Task API bridge", "taskuri banner", "fallback local"],
    shipped: ["TaskApiBridgeBanner", "bridge health endpoints", "fallback mode"],
    next: ["real create/update", "drawer hydration"]
  },
  {
    version: "2.7.0",
    date: "2026-06-05",
    title: "API-backed Task Board & Drawer Pack",
    type: "major",
    status: "deployed",
    highlights: ["board state endpoint", "drawer contract", "optimistic update plan"],
    shipped: ["/api/v1/tasks/board-state", "admin task-board-drawer", "board/drawer contracts"],
    next: ["task page bridge", "real mutations"]
  },
  {
    version: "2.6.0",
    date: "2026-06-05",
    title: "Task UI API Wiring Pack",
    type: "major",
    status: "deployed",
    highlights: ["API client", "UI store bridge", "feature flags"],
    shipped: ["API wiring admin", "Task API client", "release dashboard"],
    next: ["board/drawer API"]
  }
];

export const nextUpdates = [
  {
    version: "3.1.0",
    title: "Prisma Task Repository Adapter Activation",
    priority: "critical",
    outcome: "Task create/update/archive vor trece prin repository interface cu mock/prisma parity.",
    required: ["TaskRepository interface", "PrismaTaskRepository", "MockTaskRepository", "shadow compare"]
  },
  {
    version: "3.2.0",
    title: "Task UI Production Mutations",
    priority: "critical",
    outcome: "Pagina /taskuri va folosi mutații API reale cu optimistic update + rollback.",
    required: ["create task modal", "update status", "archive", "error state", "toast feedback"]
  },
  {
    version: "3.3.0",
    title: "Subtasks, Comments & Time Entries Persistence",
    priority: "high",
    outcome: "Task detail devine complet cu subtaskuri, comentarii și timer persistente.",
    required: ["comments API", "subtasks API", "time entries", "activity log"]
  }
];

export function getReleaseStatus() {
  return {
    ok: true,
    ...currentRelease,
    areas: productCompletion,
    changelog: changelog.slice(0, 8),
    nextUpdates
  };
}

export function getProductCompletion() {
  const average = Math.round(productCompletion.reduce((sum, area) => sum + area.completion, 0) / productCompletion.length);

  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    overall: average,
    overallCompletion: average,
    website: currentRelease.websiteReadiness,
    mobile: currentRelease.mobileReadiness,
    production: currentRelease.productionReadiness,
    areas: productCompletion
  };
}

export function getReleaseChangelog() {
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    changelog
  };
}

export function getNextUpdates() {
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    nextUpdates
  };
}
