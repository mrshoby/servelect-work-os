import { v70ProgressScores, v70RouteList } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";
import { v71GlobalScores, v71ProgressScores, v71RouteList } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";
import { v72CurrentReadiness, v72GlobalScores, v72ProgressScores, v72RouteList } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";
import { v73CurrentReadiness, v73GlobalScores, v73ProgressScores, v73RouteList } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";
import { V74_RELEASE_VERSION, v74CurrentReadiness, v74GlobalScores, v74ProgressScores, v74RouteList } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };
export type ReleaseMilestone = { id: string; title: string; version: string; date: string; summary: string; routes: string[] };

export const SERVELECT_RELEASE_VERSION = V74_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.4.0 DB-backed Shadow Writes, Notification Worker & Optimistic Locking";

export const releaseMilestones: ReleaseMilestone[] = [
  { id: "v70", title: "GoodDay Functional Parity Hardening", version: "7.0.2", date: "2026-06-12", summary: "Taskuri GoodDay-like functionality integrated into real routes.", routes: v70RouteList() },
  { id: "v71", title: "Backend Mutation Adapter, Server Notifications & Multi-User Records", version: "7.1.1", date: "2026-06-12", summary: "Mutation adapter with API shadow, RBAC and audit readiness.", routes: v71RouteList() },
  { id: "v72", title: "Prisma Shadow Records, Rollback Evidence & Server Notification Store", version: "7.2.3", date: "2026-06-12", summary: "Shadow record ledger, rollback evidence and server notification store.", routes: v72RouteList() },
  { id: "v73", title: "Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue", version: "7.3.0", date: "2026-06-12", summary: "Schema migration scaffold and notification delivery queue.", routes: v73RouteList() },
  { id: "v74", title: "DB-backed Shadow Writes, Notification Worker & Optimistic Locking", version: V74_RELEASE_VERSION, date: "2026-06-12", summary: "DB-shadow write contracts, optimistic locks, notification worker semantics and rollback replay evidence while primary writes remain gated.", routes: v74RouteList() }
];

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally.", action: "Fix any new typecheck error before push." },
  { id: "build", title: "Next.js production build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally before push.", action: "Wait for Vercel build after push." },
  { id: "v73-screenshots", title: "v7.3.0 screenshot baseline", status: "passed", owner: "QA", evidence: "V7.3.0 screenshot report confirmed 10/10 PNG on Vercel.", action: "Extend screenshot set with v7.4 routes." },
  { id: "db-shadow-adapter", title: "DB-backed shadow write adapter", status: "warning", owner: "Backend", evidence: "v7.4.0 adds DB-shadow contracts and lock table scaffold but primary writes are not enabled.", action: "Verify DATABASE_URL and Prisma adapter in a controlled environment." },
  { id: "notification-worker", title: "Notification worker", status: "warning", owner: "Platform", evidence: "v7.4.0 adds in-app queue processing semantics. Email/push/websocket providers are not enabled yet.", action: "Add provider switchboard before production notifications." },
  { id: "primary-db", title: "Primary DB writes", status: "blocked", owner: "Backend", evidence: "Primary writes remain intentionally gated.", action: "Do not enable primary writes without backup, rollback replay and access audit." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => { acc[gate.status] += 1; return acc; }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = [...v70RouteList(), ...v71RouteList(), ...v72RouteList(), ...v73RouteList(), ...v74RouteList()];
  const scores = v74ProgressScores();
  const global = v74GlobalScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "db-backed-shadow-writes" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: releaseMilestones,
    checklist,
    progressScores: scores,
    previousProgressScores: v73ProgressScores(),
    previousProgressScoresV72: v72ProgressScores(),
    baselineProgressScores: v70ProgressScores(),
    globalScores: global,
    previousGlobalScores: v73GlobalScores(),
    previousGlobalScoresV72: v72GlobalScores(),
    v71GlobalScores: v71GlobalScores(),
    readiness: v74CurrentReadiness(),
    previousReadiness: v73CurrentReadiness(),
    previousReadinessV72: v72CurrentReadiness(),
    nextRecommendedVersions: [{ version: "7.5.0", title: "Conflict Resolution, Access Inheritance & Real Attachment Storage", focus: "Add merge/conflict UI, role inheritance and DB/R2-ready attachment evidence." }]
  };
}
