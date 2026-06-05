export type CompletionStatus = "done" | "partial" | "blocked" | "planned";
export type ReleaseRisk = "low" | "medium" | "high";

export type CompletionArea = {
  id: string;
  label: string;
  category: "website" | "mobile" | "backend" | "data" | "ops";
  percent: number;
  status: CompletionStatus;
  summary: string;
  missing: string[];
};

export type ReleaseEntry = {
  version: string;
  title: string;
  date: string;
  type: "major" | "minor" | "fix";
  status: "planned" | "shipped" | "blocked" | "in-progress";
  risk: ReleaseRisk;
  done: string[];
  missing: string[];
};

export type NextUpdate = {
  version: string;
  title: string;
  goal: string;
  mustDeliver: string[];
  acceptanceCriteria: string[];
};

export const currentEnterpriseVersion = "2.4.0";

export const completionAreas: CompletionArea[] = [
  {
    id: "web-ui",
    label: "Website / Web App UI",
    category: "website",
    percent: 72,
    status: "partial",
    summary: "Interfața enterprise task-first există, modulele principale sunt prezente, iar /taskuri a fost optimizat pentru a nu mai bloca browserul.",
    missing: ["test manual complet pe toate rezoluțiile", "polish UX pe pagini secundare", "legare completă UI la API pentru toate modulele"]
  },
  {
    id: "task-core",
    label: "Task & Project Core",
    category: "website",
    percent: 46,
    status: "partial",
    summary: "Există UI, mock data, localStorage fallback, API contracts și pagini de readiness. Nu este încă full DB-backed production.",
    missing: ["CRUD persistent în PostgreSQL", "comments/subtasks/attachments persistente", "optimistic update + rollback", "server-side filtering/pagination/sorting"]
  },
  {
    id: "backend-api",
    label: "Backend/API Layer",
    category: "backend",
    percent: 42,
    status: "partial",
    summary: "Există multe rute API v1 și contracte enterprise, dar providerul principal rămâne mock-memory/local runtime.",
    missing: ["repository adapter real", "validare input cu schema", "rate limiting", "erori standardizate", "audit pentru mutații"]
  },
  {
    id: "database",
    label: "Database / Prisma / Seed",
    category: "data",
    percent: 38,
    status: "partial",
    summary: "Schema și seed-plan sunt pregătite conceptual; v2.4 adaugă pagina de execuție seed și adapter-plan.",
    missing: ["DATABASE_URL real în Vercel", "prisma migrate deploy", "seed idempotent real", "shadow read/write parity", "rollback strategy"]
  },
  {
    id: "auth-rbac",
    label: "Auth & RBAC",
    category: "backend",
    percent: 36,
    status: "partial",
    summary: "Există foundation, permission matrix și readiness pages. Nu este încă SSO/Auth.js production.",
    missing: ["Auth.js real", "Microsoft Entra/Google Workspace", "server-side permission enforcement", "session persistence DB"]
  },
  {
    id: "iot-ops",
    label: "IoT / Energy / Maintenance Ops",
    category: "ops",
    percent: 34,
    status: "partial",
    summary: "Modulele sunt vizibile și integrate task-first, dar încă folosesc date mock și alerte simulate.",
    missing: ["TimescaleDB", "ingest MQTT/HTTP", "IoT alert -> ticket real", "SLA persistent", "dispatch live"]
  },
  {
    id: "mobile-app",
    label: "Mobile App / Expo",
    category: "mobile",
    percent: 18,
    status: "planned",
    summary: "Există schelet/concept mobil, dar nu aplicație Expo production cu offline sync.",
    missing: ["Expo screens complete", "auth mobile", "offline queue", "GPS/QR/photo/signature real", "sync cu backend"]
  }
];

export const releaseChangelog: ReleaseEntry[] = [
  {
    version: "0.7.0",
    title: "Protected App + User Management",
    date: "2026-06-05",
    type: "minor",
    status: "shipped",
    risk: "medium",
    done: ["protected app foundation", "admin users", "dynamic auth route fix"],
    missing: ["auth real", "DB persistence"]
  },
  {
    version: "0.8.0",
    title: "Persistence Governance Core",
    date: "2026-06-05",
    type: "minor",
    status: "shipped",
    risk: "medium",
    done: ["system status", "workflow templates", "readiness APIs"],
    missing: ["real workflow execution persistence"]
  },
  {
    version: "0.9.0",
    title: "Action Center & Audit Automation",
    date: "2026-06-05",
    type: "minor",
    status: "shipped",
    risk: "medium",
    done: ["action center", "audit log manifest", "workflow executions endpoint"],
    missing: ["persistent audit table"]
  },
  {
    version: "1.0.0",
    title: "Enterprise Release Baseline",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["release console", "release checklist", "enterprise baseline docs"],
    missing: ["consistent version visibility across all pages"]
  },
  {
    version: "1.1.0",
    title: "Enterprise Operations Release",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["enterprise overview", "quality/roadmap/admin views", "continuation MD"],
    missing: ["production DB activation"]
  },
  {
    version: "1.2.0",
    title: "Enterprise Data Foundation",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["data foundation page", "data readiness APIs", "DB readiness model"],
    missing: ["runtime Prisma connection"]
  },
  {
    version: "1.3.0",
    title: "Database Activation Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["database activation manifest", "schema endpoint", "database readiness test"],
    missing: ["db-ready cleanup fix was required", "no real writes"]
  },
  {
    version: "1.4.0",
    title: "WorkGraph Persistence Core",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["WorkGraph model", "migration plan", "health endpoint"],
    missing: ["actual WorkGraph repository adapter"]
  },
  {
    version: "1.5.0",
    title: "Auth & RBAC Production Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["auth/RBAC readiness", "permission matrix", "production auth plan"],
    missing: ["Auth.js provider", "server-side enforcement"]
  },
  {
    version: "1.6.0",
    title: "Task & Project Persistence Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["task/project persistence plan", "schema/readiness routes", "task project admin page"],
    missing: ["health ok duplicate fix was required", "UI still not fully API-backed"]
  },
  {
    version: "1.7.0",
    title: "Real Task CRUD & API-backed Store",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["task/project API contracts", "mock-memory CRUD foundation", "task CRUD admin page"],
    missing: ["PostgreSQL persistence", "UI live mutation wiring"]
  },
  {
    version: "1.8.0",
    title: "API-backed UI Store Integration Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["API UI store readiness", "integration plan", "hybrid store docs"],
    missing: ["feature flag rollout in /taskuri"]
  },
  {
    version: "1.9.0",
    title: "UI Task Store Feature Flag Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["feature flags", "UI task store health", "rollout plan"],
    missing: ["runtime flag toggles", "gradual user rollout"]
  },
  {
    version: "2.0.0",
    title: "Enterprise Beta Stabilization",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "medium",
    done: ["beta stabilization page", "route audit", "release checklist"],
    missing: ["full E2E browser QA"]
  },
  {
    version: "2.1.0",
    title: "DB Provider Wiring & Prisma Runtime Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["provider runtime plan", "prisma runtime checklist", "db provider admin page"],
    missing: ["DATABASE_URL + real Prisma runtime"]
  },
  {
    version: "2.2.0",
    title: "Prisma Schema & Seed Pack",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["Prisma schema/seed readiness", "seed plan", "prisma seed admin page"],
    missing: ["seed execution against real DB"]
  },
  {
    version: "2.3.0",
    title: "Prisma Runtime Shadow Mode + Task Functionality Status",
    date: "2026-06-05",
    type: "major",
    status: "shipped",
    risk: "high",
    done: ["prisma shadow mode", "task completeness dashboard", "task functionality status API"],
    missing: ["shadow write comparison", "repository adapter execution"]
  },
  {
    version: "2.4.0",
    title: "Prisma Seed Execution & Repository Adapter Pack",
    date: "2026-06-05",
    type: "major",
    status: "in-progress",
    risk: "high",
    done: ["seed execution dashboard", "repository adapter plan", "site changelog/status dashboard"],
    missing: ["real prisma seed command", "adapter wired to DB in production", "DB-backed task mutations"]
  }
];

export const nextUpdates: NextUpdate[] = [
  {
    version: "2.5.0",
    title: "DB-backed Task Mutations Pack",
    goal: "Primul build în care create/update/delete task poate trece prin repository adapter și poate fi comparat cu mock-memory.",
    mustDeliver: ["POST/PATCH/DELETE task server-side", "validation schema", "audit event per mutation", "feature flag for DB write shadow"],
    acceptanceCriteria: ["build verde Vercel", "API contract stable", "no UI regression in /taskuri", "shadow comparison report visible"]
  },
  {
    version: "2.6.0",
    title: "Task UI API Wiring Pack",
    goal: "Leagă treptat pagina /taskuri la API-backed store cu fallback localStorage.",
    mustDeliver: ["load tasks from /api/v1/tasks", "create task modal -> API", "status change -> PATCH API", "offline fallback"],
    acceptanceCriteria: ["task create visible after refresh", "status change persists in mock-memory or DB provider", "no browser freeze"]
  },
  {
    version: "2.7.0",
    title: "Subtasks, Comments & Activity Log Pack",
    goal: "Extinde task detail cu date persistente pentru subtaskuri, comentarii și activitate.",
    mustDeliver: ["subtask CRUD", "comments CRUD", "activity log on every mutation", "timeline in task drawer"],
    acceptanceCriteria: ["all actions show audit trail", "server validation", "RBAC hooks prepared"]
  },
  {
    version: "2.8.0",
    title: "Mobile Field Technician Foundation",
    goal: "Începe aplicația mobilă reală: ecrane teren, check-in, checklist, offline queue mock.",
    mustDeliver: ["Expo screens", "task list mobile", "field technician flow", "offline queue interface"],
    acceptanceCriteria: ["mobile app runs", "screens match Work OS design", "offline state visible"]
  }
];

export function getOverallProductStatus() {
  const websiteAreas = completionAreas.filter((area) => area.category !== "mobile");
  const mobileAreas = completionAreas.filter((area) => area.category === "mobile");
  const websitePercent = Math.round(websiteAreas.reduce((sum, area) => sum + area.percent, 0) / websiteAreas.length);
  const mobilePercent = Math.round(mobileAreas.reduce((sum, area) => sum + area.percent, 0) / Math.max(1, mobileAreas.length));
  const totalPercent = Math.round(completionAreas.reduce((sum, area) => sum + area.percent, 0) / completionAreas.length);

  return {
    ok: true,
    version: currentEnterpriseVersion,
    generatedAt: new Date().toISOString(),
    websitePercent,
    mobilePercent,
    totalPercent,
    websiteStatus: websitePercent >= 90 ? "near-production" : websitePercent >= 60 ? "advanced-beta" : "foundation",
    mobileStatus: mobilePercent >= 90 ? "near-production" : mobilePercent >= 50 ? "beta" : "early-foundation",
    taskModulePercent: completionAreas.find((area) => area.id === "task-core")?.percent ?? 0,
    appIsProductionReady: false,
    honestSummary:
      "Website-ul este beta enterprise avansat, dar taskurile/proiectele nu sunt încă full DB-backed production. Aplicația mobilă este încă la nivel de schelet/concept."
  };
}

export function getReleaseStatusDashboard() {
  return {
    ...getOverallProductStatus(),
    currentRelease: releaseChangelog.find((release) => release.version === currentEnterpriseVersion),
    completionAreas,
    releaseChangelog,
    nextUpdates
  };
}
