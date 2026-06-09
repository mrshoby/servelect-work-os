export type V69RuntimeDomain =
  | "taskuri"
  | "globalCommand"
  | "persistenceApi"
  | "notifications"
  | "approvals"
  | "projects"
  | "crm"
  | "stock"
  | "iot"
  | "pontaj"
  | "documents";

export type V69GateStatus = "passed" | "warning" | "blocked" | "manual";
export type V69RiskLevel = "low" | "medium" | "high" | "critical";
export type V69DeploymentStage = "local" | "github" | "vercel-preview" | "vercel-production" | "post-deploy";

export type V69RuntimeGate = {
  id: string;
  domain: V69RuntimeDomain;
  title: string;
  description: string;
  status: V69GateStatus;
  risk: V69RiskLevel;
  owner: string;
  evidence: string[];
  nextAction: string;
};

export type V69RouteProbe = {
  route: string;
  area: "taskuri" | "global" | "persistence" | "admin" | "api";
  expectedStatus: number;
  required: boolean;
};

export type V69DeploymentStep = {
  id: string;
  stage: V69DeploymentStage;
  title: string;
  command: string;
  expectedResult: string;
  automatedByVercel: boolean;
  status: V69GateStatus;
};

export type V69ReleaseMetric = {
  label: string;
  value: string;
  tone: V69GateStatus;
};

export const v69RouteProbes: V69RouteProbe[] = [
  { route: "/taskuri/overview", area: "taskuri", expectedStatus: 200, required: true },
  { route: "/taskuri/board", area: "taskuri", expectedStatus: 200, required: true },
  { route: "/taskuri/tabel", area: "taskuri", expectedStatus: 200, required: true },
  { route: "/taskuri/tickets-notificari", area: "taskuri", expectedStatus: 200, required: true },
  { route: "/taskuri/workload-aprobari", area: "taskuri", expectedStatus: 200, required: true },
  { route: "/work-os/dashboard", area: "global", expectedStatus: 200, required: true },
  { route: "/notifications", area: "global", expectedStatus: 200, required: true },
  { route: "/work-os/notification-center", area: "global", expectedStatus: 200, required: true },
  { route: "/work-os/approvals", area: "global", expectedStatus: 200, required: true },
  { route: "/search", area: "global", expectedStatus: 200, required: true },
  { route: "/action-center", area: "global", expectedStatus: 200, required: true },
  { route: "/work-os/persistence-api", area: "persistence", expectedStatus: 200, required: true },
  { route: "/work-os/real-api-unification", area: "persistence", expectedStatus: 200, required: true },
  { route: "/admin/persistence-api", area: "admin", expectedStatus: 200, required: true },
  { route: "/api/v1/work-os/global-command", area: "api", expectedStatus: 200, required: true },
  { route: "/api/v1/work-os/persistence-api", area: "api", expectedStatus: 200, required: true },
  { route: "/api/v1/work-os/persistence-api/health", area: "api", expectedStatus: 200, required: true },
  { route: "/api/v1/work-os/production-runtime", area: "api", expectedStatus: 200, required: true },
];

export const v69RuntimeGates: V69RuntimeGate[] = [
  {
    id: "local-qa",
    domain: "taskuri",
    title: "Local QA gate",
    description: "TypeScript, lint, production build and route smoke must pass before push.",
    status: "passed",
    risk: "low",
    owner: "Engineering",
    evidence: ["v6.6.2 Taskuri routes 11/11", "v6.7.2 global routes 10/10", "v6.8.3 build passed locally"],
    nextAction: "Keep running pnpm typecheck, pnpm lint and pnpm build before GitHub push.",
  },
  {
    id: "github-push",
    domain: "globalCommand",
    title: "GitHub push gate",
    description: "Local build is not enough. Vercel receives changes only after git push origin main.",
    status: "manual",
    risk: "medium",
    owner: "Release owner",
    evidence: ["GitHub main previously showed v6.7.2 until v6.8 was pushed"],
    nextAction: "Run git status, git add -A, git commit and git push origin HEAD:main after each accepted build.",
  },
  {
    id: "vercel-auto-deploy",
    domain: "globalCommand",
    title: "Vercel deployment gate",
    description: "Vercel should deploy automatically from GitHub main. Local server is not required for public deploy.",
    status: "manual",
    risk: "medium",
    owner: "DevOps",
    evidence: ["GitHub-to-Vercel integration expected", "Local 127.0.0.1:3100 only used for QA"],
    nextAction: "Check Vercel deployment after push and verify production URL route health.",
  },
  {
    id: "persistence-shadow",
    domain: "persistenceApi",
    title: "Persistence API shadow gate",
    description: "Taskuri, notifications and approvals may move to Prisma shadow only with audit and rollback payloads.",
    status: "warning",
    risk: "high",
    owner: "Backend/API",
    evidence: ["v6.8 persistence switchboard added", "Primary writes still protected"],
    nextAction: "Run shadow parity for tasks, notifications and approvals before enabling primary writes.",
  },
  {
    id: "stock-ledger",
    domain: "stock",
    title: "Stock primary-write block",
    description: "Stock movements must stay blocked until reservations, consumed stock and real ledger are separated.",
    status: "blocked",
    risk: "critical",
    owner: "Logistică + Backend",
    evidence: ["Stock domain marked blocked in v6.8", "Reservations must not affect real stock incorrectly"],
    nextAction: "Create stock movement ledger and reservation ledger before primary DB writes.",
  },
  {
    id: "documents-storage",
    domain: "documents",
    title: "Documents storage block",
    description: "Documents/files require R2/S3 storage and permission isolation before production writes.",
    status: "blocked",
    risk: "high",
    owner: "Administrativ + DevOps",
    evidence: ["R2/S3 not connected yet", "Document domain remains protected"],
    nextAction: "Add storage adapter contract, upload audit and per-project document permissions.",
  },
  {
    id: "department-rbac",
    domain: "approvals",
    title: "Department-aware RBAC gate",
    description: "Super Admin sees everything; department admins and managers remain scoped to departments/teams.",
    status: "passed",
    risk: "medium",
    owner: "Security/RBAC",
    evidence: ["Departments modeled from Servelect context", "Audit department separated from audit log"],
    nextAction: "Apply the same scope checks to every mutation endpoint before real DB writes.",
  },
];

export const v69DeploymentSteps: V69DeploymentStep[] = [
  {
    id: "qa-typecheck",
    stage: "local",
    title: "TypeScript strict validation",
    command: "pnpm typecheck",
    expectedResult: "Exit code 0",
    automatedByVercel: false,
    status: "passed",
  },
  {
    id: "qa-lint",
    stage: "local",
    title: "Lint validation",
    command: "pnpm lint",
    expectedResult: "No blocking errors. Existing unused warnings are non-blocking.",
    automatedByVercel: false,
    status: "warning",
  },
  {
    id: "qa-build",
    stage: "local",
    title: "Production build",
    command: "pnpm build",
    expectedResult: "Next.js production build succeeds.",
    automatedByVercel: true,
    status: "passed",
  },
  {
    id: "qa-smoke",
    stage: "local",
    title: "Route smoke tests",
    command: ".\\scripts\\work-os-v690-production-runtime-functional-test.ps1 -BaseUrl http://127.0.0.1:3100",
    expectedResult: "All required Taskuri, global, persistence and runtime routes return HTTP 200.",
    automatedByVercel: false,
    status: "manual",
  },
  {
    id: "git-push",
    stage: "github",
    title: "Commit and push to GitHub main",
    command: "git add -A; git commit -m \"v6.9.0 - Production runtime readiness and deployment command center\"; git push origin HEAD:main",
    expectedResult: "GitHub main shows latest v6.9.0 commit.",
    automatedByVercel: false,
    status: "manual",
  },
  {
    id: "vercel-prod",
    stage: "vercel-production",
    title: "Vercel production deploy",
    command: "Automatic after GitHub push when project is linked to main branch.",
    expectedResult: "Vercel build succeeds and production URL serves v6.9.0 pages.",
    automatedByVercel: true,
    status: "manual",
  },
  {
    id: "post-deploy-smoke",
    stage: "post-deploy",
    title: "Production route verification",
    command: "Run the route smoke against the Vercel production URL.",
    expectedResult: "No 404 on new Work OS runtime/API routes.",
    automatedByVercel: false,
    status: "manual",
  },
];

export function v69GateTone(status: V69GateStatus): string {
  if (status === "passed") return "emerald";
  if (status === "warning") return "amber";
  if (status === "blocked") return "red";
  return "sky";
}

export function getV69RuntimeSummary() {
  const passed = v69RuntimeGates.filter((gate) => gate.status === "passed").length;
  const warnings = v69RuntimeGates.filter((gate) => gate.status === "warning").length;
  const blocked = v69RuntimeGates.filter((gate) => gate.status === "blocked").length;
  const manual = v69RuntimeGates.filter((gate) => gate.status === "manual").length;
  const requiredRoutes = v69RouteProbes.filter((probe) => probe.required).length;
  const apiRoutes = v69RouteProbes.filter((probe) => probe.area === "api").length;
  const releaseScore = Math.max(0, Math.min(100, Math.round(((passed * 18) + (warnings * 9) + (manual * 6) - (blocked * 14) + 54))));

  const metrics: V69ReleaseMetric[] = [
    { label: "Release readiness", value: `${releaseScore}%`, tone: releaseScore >= 80 ? "passed" : releaseScore >= 65 ? "warning" : "blocked" },
    { label: "Required routes", value: String(requiredRoutes), tone: "passed" },
    { label: "API probes", value: String(apiRoutes), tone: "passed" },
    { label: "Manual gates", value: String(manual), tone: "manual" },
    { label: "Blocked gates", value: String(blocked), tone: blocked === 0 ? "passed" : "blocked" },
  ];

  return {
    version: "6.9.0",
    release: "Production Runtime Readiness & Deployment Command Center",
    generatedAt: new Date().toISOString(),
    releaseScore,
    passed,
    warnings,
    blocked,
    manual,
    requiredRoutes,
    apiRoutes,
    metrics,
    gates: v69RuntimeGates,
    routes: v69RouteProbes,
    deploymentSteps: v69DeploymentSteps,
    nextBuildCandidates: [
      "v7.0.0 Real Prisma Shadow Runtime for tasks, notifications and approvals",
      "v7.1.0 Stock reservation ledger and protected movement history",
      "v7.2.0 Documents/R2 storage adapter with permission-isolated uploads",
      "v7.3.0 Production observability dashboard with Vercel, audit and SLA incidents",
    ],
  };
}
