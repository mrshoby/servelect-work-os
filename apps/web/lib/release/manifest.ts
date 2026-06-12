import { v70ProgressScores, v70RouteList, V70_RELEASE_VERSION } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";

export type ReleaseGate = {
  id: string;
  title: string;
  status: ReleaseGateStatus;
  owner: string;
  evidence: string;
  action: string;
};

export type ReleaseMilestone = {
  id: string;
  title: string;
  version: string;
  date: string;
  summary: string;
  routes: string[];
};

export const SERVELECT_RELEASE_VERSION = "7.0.2";
export const SERVELECT_RELEASE_CHANNEL = "v7.0.2 GoodDay Functional Parity Hardening Typecheck Fix";

export const releaseMilestones: ReleaseMilestone[] = [
  {
    id: "v67",
    title: "Global Command Integration",
    version: "6.7.2",
    date: "2026-06-12",
    summary: "Taskuri core linked to global dashboard, notifications, approvals, search and action center.",
    routes: ["/work-os/dashboard", "/notifications", "/search", "/api/v1/work-os/global-command"]
  },
  {
    id: "v68",
    title: "Real Persistence API Unification",
    version: "6.8.3",
    date: "2026-06-12",
    summary: "Persistence/API unification layer for local adapter, API adapter and Prisma readiness gates.",
    routes: ["/work-os/persistence-api", "/api/v1/work-os/persistence-api"]
  },
  {
    id: "v69",
    title: "Production Runtime Readiness",
    version: "6.9.0",
    date: "2026-06-12",
    summary: "Runtime/deployment command center for GitHub to Vercel readiness and production route probes.",
    routes: ["/work-os/production-runtime", "/work-os/deployment-command", "/api/v1/work-os/production-runtime"]
  },
  {
    id: "v70",
    title: "GoodDay Functional Parity Hardening",
    version: "7.0.0",
    date: "2026-06-12",
    summary: "Tickets, request forms, workflows, custom fields, saved views, dependencies, time tracking, workload, reports and automations integrated into real Taskuri routes with local persistent adapter and API contracts.",
    routes: v70RouteList()
  }
];

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally. ChatGPT environment did not execute local repo QA.", action: "Run apply script and keep build blocked if typecheck fails." },
  { id: "build", title: "Next.js production build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally before push.", action: "Run pnpm build and Vercel build after push." },
  { id: "taskuri-routes", title: "Taskuri route coverage", status: "warning", owner: "Product", evidence: "v7 route smoke script covers Taskuri and admin parity routes.", action: "Run scripts/work-os-v700-functional-test.ps1 after local/prod start." },
  { id: "screenshots", title: "Screenshot audit", status: "warning", owner: "QA", evidence: "Playwright screenshot script included; coverage only confirmed after PNG output exists.", action: "Run node scripts/audit-v700-screenshots.mjs and attach PNG report." },
  { id: "backend", title: "Backend/API primary persistence", status: "blocked", owner: "Backend", evidence: "v7.0.0 is real local persistent + API-prepared, not primary multi-user DB writes.", action: "v7.1.0 must implement mutation adapter and server notifications." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => {
    acc[gate.status] += 1;
    return acc;
  }, { passed: 0, warning: 0, blocked: 0, planned: 0 });

  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return {
    version: SERVELECT_RELEASE_VERSION,
    channel: SERVELECT_RELEASE_CHANNEL,
    productionScore,
    totals,
    gates: releaseGates,
    blockers: releaseGates.filter((gate) => gate.status === "blocked"),
    warnings: releaseGates.filter((gate) => gate.status === "warning"),
    planned: releaseGates.filter((gate) => gate.status === "planned")
  };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: {
      name: "SERVELECT WORK OS / SERVELECT EMP",
      version: SERVELECT_RELEASE_VERSION,
      channel: SERVELECT_RELEASE_CHANNEL,
      releaseType: "goodday-parity-hardening"
    },
    summary: {
      productionScore: checklist.productionScore,
      routes: v70RouteList().length,
      scoreRows: v70ProgressScores().length,
      releaseGates: releaseGates.length,
      capabilities: v70RouteList().length,
      actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length,
      criticalActions: checklist.blockers.length,
      workflowExecutions: v70ProgressScores().length
    },
    milestones: releaseMilestones,
    checklist,
    progressScores: v70ProgressScores(),
    nextRecommendedVersions: [
      {
        version: "7.1.0",
        title: "Backend Mutation Adapter, Multi-User Records & Server Notifications",
        focus: "Move v7 local persistent entities to API/repository adapter with Prisma shadow writes, notification storage, auth/RBAC enforcement and audit events."
      }
    ]
  };
}
