export type CompletionArea = {
  id: string;
  label: string;
  percent: number;
  status: "stable" | "progress" | "risk" | "early";
  summary: string;
  next: string[];
};

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  type: "major" | "minor" | "fix";
  shipped: string[];
  next: string[];
  status: string;
};

export const currentRelease = {
  version: "2.6.0",
  name: "Task UI API Wiring Pack",
  generatedAt: new Date().toISOString(),
  productStatus: "Enterprise beta — task-first Work OS, API wiring stage",
  betaReadiness: 68,
  productionReadiness: 47,
  websiteReadiness: 78,
  mobileReadiness: 22,
  nextMajor: "v2.7.0 — API-backed Task Board & Drawer Pack"
};

export const completionAreas: CompletionArea[] = [
  {
    id: "web",
    label: "Website / Web App",
    percent: 78,
    status: "progress",
    summary: "Interfața web este stabilă ca beta internă: dashboard, taskuri, proiecte, admin readiness, changelog și release status.",
    next: ["verificare completă responsive", "polish pe tabele și drawer", "smoke test automat după fiecare deploy"]
  },
  {
    id: "task-core",
    label: "Task & Project Core",
    percent: 64,
    status: "progress",
    summary: "Există UI task-first, API contracts și feature flags; v2.6 adaugă wiring controlat între UI și API.",
    next: ["create task prin API în UI", "update status prin API", "drawer task sincronizat cu API", "rollback la eroare"]
  },
  {
    id: "backend",
    label: "Backend / API",
    percent: 58,
    status: "progress",
    summary: "API-urile principale există pentru taskuri/proiecte și enterprise readiness, dar încă rulează predominant pe mock-memory.",
    next: ["repository adapter real", "validare payload", "server-side pagination", "audit event la mutații"]
  },
  {
    id: "database",
    label: "Database / Prisma",
    percent: 52,
    status: "progress",
    summary: "Schema, seed plan, shadow mode și repository plan sunt definite; DB real nu este încă activ pentru mutații production.",
    next: ["Prisma shadow compare", "seed execution real", "task mutations DB-backed", "migration checks"]
  },
  {
    id: "auth",
    label: "Auth / RBAC",
    percent: 40,
    status: "risk",
    summary: "Există fundație RBAC și pagini de readiness; Auth.js/SSO real și enforcement complet nu sunt finalizate.",
    next: ["Auth.js provider", "session persistent", "permission guard pe API", "audit security events"]
  },
  {
    id: "iot-ops",
    label: "IoT / Operațiuni energie",
    percent: 36,
    status: "early",
    summary: "Modulele IoT/mentenanță sunt integrate ca UX și workflow, dar datele live/Timescale/MQTT nu sunt active.",
    next: ["ingest alerte", "alertă → ticket/task real", "TimescaleDB", "SLA dispatch real"]
  },
  {
    id: "mobile",
    label: "Mobile App",
    percent: 22,
    status: "early",
    summary: "Există schelet Expo/concept. Nu este încă aplicație mobilă production pentru tehnicieni.",
    next: ["Expo screens reale", "offline queue", "GPS/check-in", "poze și semnătură client"]
  }
];

export const changelog: ChangelogEntry[] = [
  {
    version: "2.6.0",
    date: "2026-06-05",
    title: "Task UI API Wiring Pack",
    type: "major",
    status: "current",
    shipped: [
      "Adaugă centru admin pentru integrarea UI taskuri cu API-backed store.",
      "Definește client API pentru list/create/update/delete task și list proiecte.",
      "Adaugă hook de bridge UI pentru migrare controlată, fără schimbare vizuală majoră.",
      "Actualizează release status, product completion și changelog vizibil pe site.",
      "Documentează exact ce lipsește pentru taskuri full production."
    ],
    next: ["v2.7 leagă efectiv Task List/Board/Drawer la API sub feature flag", "optimistic update + rollback", "audit event la status change"]
  },
  {
    version: "2.5.0",
    date: "2026-06-05",
    title: "DB-backed Task Mutations Pack",
    type: "major",
    status: "baseline",
    shipped: ["Plan mutații DB-backed", "audit pentru task mutations", "release status v2.5", "changelog vizibil"],
    next: ["wiring UI la API", "shadow writes", "DB provider activation"]
  },
  {
    version: "2.4.0",
    date: "2026-06-05",
    title: "Prisma Seed Execution & Repository Adapter Pack",
    type: "major",
    status: "baseline",
    shipped: ["repository adapter plan", "seed execution plan", "release status dashboard", "product completion API"],
    next: ["task mutations", "seed real", "repository writes"]
  },
  {
    version: "2.3.0",
    date: "2026-06-05",
    title: "Prisma Runtime Shadow Mode Pack",
    type: "major",
    status: "baseline",
    shipped: ["Prisma shadow mode", "task completeness page", "task functionality status"],
    next: ["repository adapter", "DB-backed task core"]
  },
  {
    version: "2.0.0",
    date: "2026-06-05",
    title: "Enterprise Beta Stabilization",
    type: "major",
    status: "baseline",
    shipped: ["beta stabilization page", "route audit", "release checklist", "critical route manifest"],
    next: ["Prisma runtime", "task CRUD", "API store"]
  }
];

export const nextUpdates = [
  {
    version: "2.7.0",
    title: "API-backed Task Board & Drawer Pack",
    priority: "critical",
    outcome: "Task List, Kanban status update și Task Drawer vor consuma API-ul sub feature flag.",
    required: ["GET /api/v1/tasks în UI", "PATCH status prin API", "drawer refresh după mutație", "rollback la eroare"]
  },
  {
    version: "2.8.0",
    title: "Task Comments/Subtasks API Pack",
    priority: "high",
    outcome: "Subtaskurile și comentariile devin mutate prin API, nu doar localStorage.",
    required: ["POST comment", "POST subtask", "PATCH subtask done", "activity log"]
  },
  {
    version: "2.9.0",
    title: "DB Write Gate Pack",
    priority: "high",
    outcome: "Activare controlată a scrierilor în DB pentru taskuri, cu shadow comparison.",
    required: ["DATABASE_URL", "Prisma client", "write gate", "audit DB"]
  },
  {
    version: "3.0.0",
    title: "Production Task Core",
    priority: "critical",
    outcome: "Taskuri/proiecte production-ready pentru beta intern extins.",
    required: ["DB-backed CRUD", "RBAC enforcement", "pagination", "attachments plan", "E2E smoke"]
  }
];

export function getReleaseStatus() {
  return {
    ok: true,
    ...currentRelease,
    areas: completionAreas,
    changelog: changelog.slice(0, 5),
    nextUpdates
  };
}

export function getProductCompletion() {
  const average = Math.round(completionAreas.reduce((sum, area) => sum + area.percent, 0) / completionAreas.length);
  return {
    ok: true,
    version: currentRelease.version,
    generatedAt: new Date().toISOString(),
    overall: average,
    website: currentRelease.websiteReadiness,
    mobile: currentRelease.mobileReadiness,
    production: currentRelease.productionReadiness,
    areas: completionAreas
  };
}
