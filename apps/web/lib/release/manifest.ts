import { v70ProgressScores, v70RouteList } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";
import { v71GlobalScores, v71ProgressScores, v71RouteList } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";
import { v72CurrentReadiness, v72GlobalScores, v72ProgressScores, v72RouteList, V72_RELEASE_VERSION } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

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

export const SERVELECT_RELEASE_VERSION = V72_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.2.2 Prisma Shadow Records, Rollback Evidence & Server Notification Store";

export const releaseMilestones: ReleaseMilestone[] = [
  { id: "v70", title: "GoodDay Functional Parity Hardening", version: "7.0.2", date: "2026-06-12", summary: "Tickets, forms, workflows, custom fields, saved views, dependencies, time tracking, workload, reports and automations integrated into real Taskuri routes.", routes: v70RouteList() },
  { id: "v71", title: "Backend Mutation Adapter, Server Notifications & Multi-User Records", version: "7.1.1", date: "2026-06-12", summary: "Mutation adapter for tasks, tickets, forms, notifications, approvals and saved views with API shadow, RBAC and audit.", routes: v71RouteList() },
  { id: "v72", title: "Prisma Shadow Records, Rollback Evidence & Server Notification Store", version: V72_RELEASE_VERSION, date: "2026-06-12", summary: "Shadow record ledger, rollback evidence and server notification store added before primary Prisma rollout.", routes: v72RouteList() }
];

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally. Build is not accepted if this fails.", action: "Run apply script and fix any new errors before push." },
  { id: "build", title: "Next.js production build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally before push.", action: "Run pnpm build and wait for Vercel build after push." },
  { id: "v70-screenshots", title: "v7.0.2 screenshot baseline", status: "passed", owner: "QA", evidence: "V7 screenshot report confirmed 12/12 PNG on Vercel.", action: "Keep baseline and extend screenshots after backend builds." },
  { id: "v71-screenshots", title: "v7.1.1 backend mutation screenshot baseline", status: "passed", owner: "QA", evidence: "V7.1 screenshot report confirmed 7/7 PNG on Vercel.", action: "Extend with v7.2 shadow record routes." },
  { id: "v72-shadow", title: "Prisma shadow records", status: "warning", owner: "Backend", evidence: "v7.2 adds shadow records and rollback evidence but primary writes remain gated.", action: "Run v7.2 smoke and screenshot audit." },
  { id: "primary-db", title: "Primary DB writes", status: "blocked", owner: "Backend", evidence: "Prisma primary writes are intentionally gated.", action: "v7.3 must add schema migration and controlled shadow table writes before primary enablement." }
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
  const routes = [...v70RouteList(), ...v71RouteList(), ...v72RouteList()];
  const scores = v72ProgressScores();
  const global = v72GlobalScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "prisma-shadow-records" },
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
    previousProgressScores: v71ProgressScores(),
    baselineProgressScores: v70ProgressScores(),
    globalScores: global,
    previousGlobalScores: v71GlobalScores(),
    readiness: v72CurrentReadiness(),
    nextRecommendedVersions: [
      { version: "7.3.0", title: "Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue", focus: "Create actual Prisma schema/migration scaffolding for shadow records, rollback evidence and notification delivery queue." }
    ]
  };
}


