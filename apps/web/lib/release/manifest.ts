import { v70ProgressScores, v70RouteList } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";
import { v71GlobalScores, v71ProgressScores, v71RouteList, V71_RELEASE_VERSION } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";

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

export const SERVELECT_RELEASE_VERSION = V71_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.1.1 Backend Mutation Adapter, Server Notifications & Multi-User Records";

export const releaseMilestones: ReleaseMilestone[] = [
  { id: "v67", title: "Global Command Integration", version: "6.7.2", date: "2026-06-12", summary: "Taskuri core linked to global dashboard, notifications, approvals, search and action center.", routes: ["/work-os/dashboard", "/notifications", "/search", "/api/v1/work-os/global-command"] },
  { id: "v68", title: "Real Persistence API Unification", version: "6.8.3", date: "2026-06-12", summary: "Persistence/API unification layer for local adapter, API adapter and Prisma readiness gates.", routes: ["/work-os/persistence-api", "/api/v1/work-os/persistence-api"] },
  { id: "v69", title: "Production Runtime Readiness", version: "6.9.0", date: "2026-06-12", summary: "Runtime/deployment command center for GitHub to Vercel readiness and production route probes.", routes: ["/work-os/production-runtime", "/work-os/deployment-command", "/api/v1/work-os/production-runtime"] },
  { id: "v70", title: "GoodDay Functional Parity Hardening", version: "7.1.1", date: "2026-06-12", summary: "Tickets, forms, workflows, custom fields, saved views, dependencies, time tracking, workload, reports and automations integrated into real Taskuri routes.", routes: v70RouteList() },
  { id: "v71", title: "Backend Mutation Adapter, Server Notifications & Multi-User Records", version: "7.1.1", date: "2026-06-12", summary: "Mutation adapter for tasks, tickets, request forms, notifications, approvals, saved views, workflows, custom fields, time entries, timesheets and automations with RBAC/audit and Prisma-primary gated mode.", routes: v71RouteList() }
];

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally. Build is not accepted if this fails.", action: "Run apply script and fix any new errors before push." },
  { id: "build", title: "Next.js production build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally before push.", action: "Run pnpm build and wait for Vercel build after push." },
  { id: "v70-screenshots", title: "v7.1.1 screenshot baseline", status: "passed", owner: "QA", evidence: "V7 screenshot report confirmed 12/12 PNG on Vercel.", action: "Keep baseline and extend screenshot audit after v7.1 deploy." },
  { id: "v71-routes", title: "v7.1 backend mutation routes", status: "warning", owner: "QA", evidence: "scripts/work-os-v710-functional-test.ps1 covers new API and UI routes.", action: "Run smoke on local/prod BaseUrl." },
  { id: "backend-primary", title: "Primary DB writes", status: "blocked", owner: "Backend", evidence: "v7.1.1 includes local/API shadow adapter but keeps Prisma primary gated.", action: "v7.2.0 must add Prisma shadow records and rollback evidence." }
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
  const routes = [...v70RouteList(), ...v71RouteList()];
  const scores = v71ProgressScores();
  const global = v71GlobalScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "backend-mutation-adapter" },
    summary: {
      productionScore: checklist.productionScore,
      routes: routes.length,
      scoreRows: scores.length,
      releaseGates: releaseGates.length,
      capabilities: routes.length,
      actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length,
      criticalActions: checklist.blockers.length,
      workflowExecutions: scores.length
    },
    milestones: releaseMilestones,
    checklist,
    progressScores: scores,
    previousProgressScores: v70ProgressScores(),
    globalScores: global,
    nextRecommendedVersions: [
      { version: "7.2.0", title: "Prisma Shadow Records, Rollback Evidence & Server Notification Store", focus: "Move mutation adapter from API shadow into real Prisma shadow tables with rollback/audit evidence and server-side notification storage." }
    ]
  };
}

