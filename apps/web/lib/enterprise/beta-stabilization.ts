export type BetaAreaStatus = "stable" | "controlled" | "needs-work" | "blocked";
export type BetaAreaRisk = "low" | "medium" | "high" | "critical";
export type BetaRouteCriticality = "critical" | "high" | "normal";

export type BetaStabilizationArea = {
  id: string;
  label: string;
  module: string;
  status: BetaAreaStatus;
  readiness: number;
  risk: BetaAreaRisk;
  owner: string;
  scope: string;
  currentState: string;
  betaGate: string;
  nextActions: string[];
};

export type BetaCriticalRoute = {
  path: string;
  label: string;
  criticality: BetaRouteCriticality;
  expected: "page" | "api";
  budgetMs: number;
  status: BetaAreaStatus;
  notes: string;
};

export type BetaReleaseChecklistItem = {
  id: string;
  label: string;
  status: "done" | "active" | "next" | "blocked";
  owner: string;
  evidence: string;
};

const areas: BetaStabilizationArea[] = [
  {
    id: "web_shell",
    label: "Web shell & navigation",
    module: "Platformă web",
    status: "controlled",
    readiness: 84,
    risk: "medium",
    owner: "Platform UI",
    scope: "AppShell, Sidebar, Topbar, responsive layout, route consistency",
    currentState: "Layout-ul web este funcțional, topbar-ul a fost curățat, iar rutele admin noi pot fi accesate direct.",
    betaGate: "Toate rutele critice trebuie să răspundă sub buget și fără build warnings blocate de TypeScript.",
    nextActions: ["Adaugă link-uri vizibile pentru toate consolele admin", "Rulează smoke test după fiecare build", "Verifică responsive desktop/tablet/mobile"]
  },
  {
    id: "task_core",
    label: "Task core",
    module: "Taskuri",
    status: "controlled",
    readiness: 78,
    risk: "medium",
    owner: "Work OS Core",
    scope: "Task list, Kanban light, task drawer, create modal, timer demo, API CRUD contract",
    currentState: "Pagina /taskuri a fost optimizată pentru a nu mai bloca browserul și există contract API pentru taskuri.",
    betaGate: "API-backed reads/writes trebuie activate gradual prin feature flags, cu fallback localStorage.",
    nextActions: ["Conectează TaskTable la GET /api/v1/tasks în shadow mode", "Activează create/update prin API în spatele flag-ului", "Adaugă toast/rollback pentru write failure"]
  },
  {
    id: "project_core",
    label: "Project core",
    module: "Proiecte",
    status: "controlled",
    readiness: 74,
    risk: "medium",
    owner: "Project Management",
    scope: "Project list, project metadata, timeline mock, task/project mapping, API contract",
    currentState: "Proiectele există în UI și API, dar persistarea reală DB încă nu este activă.",
    betaGate: "Project detail și task relation trebuie migrate către API-backed store înainte de beta extern.",
    nextActions: ["Adaugă project detail route", "Conectează GET /api/v1/projects", "Definește owner/deadline/budget persistence"]
  },
  {
    id: "data_foundation",
    label: "Data foundation",
    module: "Database / Prisma",
    status: "needs-work",
    readiness: 68,
    risk: "high",
    owner: "Backend",
    scope: "PostgreSQL, Prisma schema, seed, repository provider, migration plan",
    currentState: "Există console și contracte de readiness, dar providerul live este încă mock/localStorage/memory.",
    betaGate: "DATABASE_URL + Prisma migrations + seed + rollback trebuie configurate înainte de producție reală.",
    nextActions: ["Activează provider PostgreSQL într-un environment separat", "Rulează prisma migrate deploy", "Adaugă seed determinist pentru demo"]
  },
  {
    id: "auth_rbac",
    label: "Auth & RBAC",
    module: "Administrare",
    status: "needs-work",
    readiness: 66,
    risk: "high",
    owner: "Security",
    scope: "Auth.js, demo auth, permissions, user management, route guards, API gates",
    currentState: "RBAC foundation există, dar SSO/DB-backed sessions nu sunt activate complet.",
    betaGate: "Write APIs trebuie protejate server-side cu role/permission checks reale.",
    nextActions: ["Configurează Auth.js provider", "Persistă users/roles în DB", "Aplică permission gates pe POST/PATCH/DELETE"]
  },
  {
    id: "operations_modules",
    label: "Operational modules",
    module: "CRM / IoT / Echipamente / Mentenanță / ESG / HR",
    status: "controlled",
    readiness: 70,
    risk: "medium",
    owner: "Operations",
    scope: "Module operaționale integrate task-first, mock data, action center, workflow templates",
    currentState: "Modulele există ca experiență MVP integrată, dar nu au încă toate fluxurile persistente production.",
    betaGate: "Alarmele, ticketele și aprobările trebuie să poată crea taskuri/tickete reale prin API.",
    nextActions: ["Leagă IoT alerts de task/ticket API", "Adaugă audit event pentru approvals", "Definește document workflow pentru fiecare modul"]
  },
  {
    id: "mobile_app",
    label: "Mobile app",
    module: "Expo / field app",
    status: "blocked",
    readiness: 38,
    risk: "critical",
    owner: "Mobile",
    scope: "Expo shell, field technician flows, timesheet mobile, dispatch mobile, offline sync",
    currentState: "Mobile există ca schelet și concept, nu ca aplicație completă production.",
    betaGate: "Pentru beta extern este nevoie de ecrane mobile reale și cel puțin sync offline pentru task/checklist.",
    nextActions: ["Prioritizează Field Technician Core", "Adaugă bottom tabs + task detail mobile", "Definește offline queue pentru checklists/photos"]
  },
  {
    id: "quality_observability",
    label: "Quality & observability",
    module: "QA / Audit / Release",
    status: "controlled",
    readiness: 82,
    risk: "medium",
    owner: "Release Manager",
    scope: "Performance audit, route smoke tests, release console, continuation docs",
    currentState: "Există audit scripts și MD de continuitate; încă lipsește E2E Playwright complet.",
    betaGate: "Build local + Vercel build + route audit trebuie să treacă înainte de orice tag major.",
    nextActions: ["Rulează site-deep-audit", "Adaugă Playwright task flow", "Publică raport beta în docs"]
  }
];

const criticalRoutes: BetaCriticalRoute[] = [
  { path: "/", label: "Dashboard", criticality: "critical", expected: "page", budgetMs: 1800, status: "controlled", notes: "Home Command Center trebuie să rămână rapid și task-first." },
  { path: "/taskuri", label: "Task Center", criticality: "critical", expected: "page", budgetMs: 2200, status: "controlled", notes: "A fost optimizat prin randare light și view activ." },
  { path: "/proiecte", label: "Projects", criticality: "critical", expected: "page", budgetMs: 2200, status: "controlled", notes: "Project core rămâne MVP până la persistence complet." },
  { path: "/enterprise", label: "Enterprise console", criticality: "high", expected: "page", budgetMs: 2000, status: "controlled", notes: "Trebuie actualizată constant cu versiunea curentă." },
  { path: "/admin/performance", label: "Performance console", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "Manifest audit și smoke tests." },
  { path: "/admin/database", label: "Database readiness", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "DB provider încă nu este production active." },
  { path: "/admin/workgraph", label: "WorkGraph persistence", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "Entități și plan de migrare." },
  { path: "/admin/auth-rbac", label: "Auth/RBAC", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "SSO real încă nu este activat." },
  { path: "/admin/task-projects", label: "Task/Project persistence", criticality: "critical", expected: "page", budgetMs: 2200, status: "controlled", notes: "Contract migration mock -> API/DB." },
  { path: "/admin/task-crud", label: "Task CRUD API", criticality: "critical", expected: "page", budgetMs: 2200, status: "controlled", notes: "Contract CRUD mock-memory." },
  { path: "/admin/api-ui-store", label: "API UI Store", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "Hybrid local/API store strategy." },
  { path: "/admin/ui-task-store", label: "UI Task Store Flags", criticality: "high", expected: "page", budgetMs: 2200, status: "controlled", notes: "Feature flags pentru API-backed rollout." },
  { path: "/admin/beta-stabilization", label: "Beta Stabilization", criticality: "critical", expected: "page", budgetMs: 2200, status: "controlled", notes: "Punctul central v2.0." },
  { path: "/api/v1/tasks", label: "Tasks API", criticality: "critical", expected: "api", budgetMs: 1200, status: "controlled", notes: "GET trebuie să fie stabil; writes rămân feature-flagged." },
  { path: "/api/v1/projects", label: "Projects API", criticality: "critical", expected: "api", budgetMs: 1200, status: "controlled", notes: "GET projects pentru UI store." },
  { path: "/api/v1/enterprise/beta-health", label: "Beta health", criticality: "critical", expected: "api", budgetMs: 1000, status: "stable", notes: "Health endpoint v2.0." }
];

const checklist: BetaReleaseChecklistItem[] = [
  { id: "build", label: "Local pnpm build verde", status: "active", owner: "Release Manager", evidence: "pnpm --filter @servelect/web build" },
  { id: "vercel", label: "Vercel deployment verde", status: "active", owner: "Release Manager", evidence: "Vercel build logs fără TypeScript errors" },
  { id: "task_freeze", label: "/taskuri fără freeze", status: "active", owner: "Frontend", evidence: "manual Chrome + Incognito + localStorage v20" },
  { id: "route_audit", label: "Route audit complet", status: "next", owner: "QA", evidence: "scripts/beta-stabilization-test.ps1" },
  { id: "api_contracts", label: "Task/Project API contracts stabile", status: "active", owner: "Backend", evidence: "/api/v1/tasks + /api/v1/projects" },
  { id: "rbac_gate", label: "Write operations gated", status: "next", owner: "Security", evidence: "permission matrix + API write guards" },
  { id: "db_provider", label: "DB provider real", status: "blocked", owner: "Backend", evidence: "DATABASE_URL + Prisma migration + seed" },
  { id: "mobile_beta", label: "Mobile beta core", status: "blocked", owner: "Mobile", evidence: "Expo field tech flow" }
];

function average(items: Array<{ readiness: number }>) {
  return Math.round(items.reduce((sum, item) => sum + item.readiness, 0) / Math.max(items.length, 1));
}

function riskPenalty(risk: BetaAreaRisk) {
  if (risk === "critical") return 20;
  if (risk === "high") return 12;
  if (risk === "medium") return 6;
  return 0;
}

export function getBetaStabilizationRelease() {
  const rawScore = average(areas);
  const highestPenalty = Math.max(...areas.map((area) => riskPenalty(area.risk)));
  const score = Math.max(0, Math.min(100, rawScore - Math.round(highestPenalty / 2)));
  const blockers = areas.filter((area) => area.status === "blocked" || area.risk === "critical");
  const needsWork = areas.filter((area) => area.status === "needs-work");

  return {
    ok: true,
    version: "2.0.0",
    name: "Enterprise Beta Stabilization",
    generatedAt: new Date().toISOString(),
    phase: "enterprise-beta",
    summary:
      "v2.0 stabilizează platforma web Servelect Work OS pentru beta intern: rute critice, health checks, feature flags, documentație de continuitate și readiness pentru trecerea controlată la API/DB real.",
    betaReadiness: {
      score,
      label: score >= 85 ? "beta-ready" : score >= 70 ? "internal beta controlled" : "not beta-ready",
      productionMode: false,
      website: "advanced MVP / internal beta",
      mobile: "skeleton / not beta-ready",
      provider: "hybrid mock-memory + localStorage fallback + API contracts",
      criticalBlockers: blockers.map((area) => area.label),
      needsWork: needsWork.map((area) => area.label)
    },
    areas,
    criticalRoutes,
    checklist,
    nextBuild: {
      version: "2.1.0",
      name: "DB Provider Wiring & Prisma Runtime Pack",
      objective:
        "Conectarea providerului de date la PostgreSQL/Prisma într-un environment controlat, cu seed, rollback și health checks reale."
    }
  };
}

export function getBetaHealth() {
  const release = getBetaStabilizationRelease();
  const criticalRouteCount = release.criticalRoutes.filter((route) => route.criticality === "critical").length;
  const blockedAreas = release.areas.filter((area) => area.status === "blocked").length;
  const highRiskAreas = release.areas.filter((area) => area.risk === "high" || area.risk === "critical").length;

  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    betaReadinessScore: release.betaReadiness.score,
    status: release.betaReadiness.label,
    websiteStatus: release.betaReadiness.website,
    mobileStatus: release.betaReadiness.mobile,
    criticalRouteCount,
    blockedAreas,
    highRiskAreas,
    recommendation:
      blockedAreas > 0
        ? "Beta intern controlat permis; beta extern blocat până la DB provider și mobile core."
        : "Beta intern poate continua cu route audit și API-backed store rollout."
  };
}

export function getBetaRouteAuditManifest() {
  return {
    ok: true,
    version: "2.0.0",
    generatedAt: new Date().toISOString(),
    routes: criticalRoutes,
    budgets: {
      pageDefaultMs: 2200,
      apiDefaultMs: 1200,
      taskPageMs: 2200
    },
    requiredCommand: 'scripts/beta-stabilization-test.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"'
  };
}

export function getBetaReleaseChecklist() {
  const release = getBetaStabilizationRelease();

  return {
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    checklist,
    decision: {
      internalBeta: release.betaReadiness.score >= 70,
      externalBeta: release.betaReadiness.score >= 85 && release.betaReadiness.criticalBlockers.length === 0,
      production: false,
      reason: "Aplicația este suficientă pentru beta intern controlat, dar nu pentru production fără DB/Auth/Mobile complet."
    }
  };
}
