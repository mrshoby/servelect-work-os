import { v70ProgressScores, v70RouteList } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";
import { v71GlobalScores, v71ProgressScores, v71RouteList } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";
import { v72CurrentReadiness, v72GlobalScores, v72ProgressScores, v72RouteList } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";
import { v73CurrentReadiness, v73GlobalScores, v73ProgressScores, v73RouteList } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";
import { v74CurrentReadiness, v74GlobalScores, v74ProgressScores, v74RouteList } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";
import { v75GlobalScores, v75ProgressScores, v75RouteList } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";
import { V76_RELEASE_VERSION, v76CurrentReadiness, v76GlobalScores, v76ProgressScores, v76RouteList } from "@/lib/enterprise/work-os-v76-provider-storage";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };
export type ReleaseMilestone = { id: string; title: string; version: string; date: string; summary: string; routes: string[] };

export const SERVELECT_RELEASE_VERSION = V76_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.6.0 Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API";

export const releaseMilestones: ReleaseMilestone[] = [
  { id: "v70", title: "GoodDay Functional Parity Hardening", version: "7.0.2", date: "2026-06-12", summary: "Taskuri GoodDay-like functionality integrated into real routes.", routes: v70RouteList() },
  { id: "v71", title: "Backend Mutation Adapter, Server Notifications & Multi-User Records", version: "7.1.1", date: "2026-06-12", summary: "Mutation adapter with API shadow, RBAC and audit readiness.", routes: v71RouteList() },
  { id: "v72", title: "Prisma Shadow Records, Rollback Evidence & Server Notification Store", version: "7.2.3", date: "2026-06-12", summary: "Shadow record ledger, rollback evidence and server notification store.", routes: v72RouteList() },
  { id: "v73", title: "Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue", version: "7.3.0", date: "2026-06-12", summary: "Schema migration scaffold and notification delivery queue.", routes: v73RouteList() },
  { id: "v74", title: "DB-backed Shadow Writes, Notification Worker & Optimistic Locking", version: "7.4.0", date: "2026-06-12", summary: "DB-shadow write contracts, optimistic locks and notification worker semantics.", routes: v74RouteList() },
  { id: "v75", title: "Conflict Resolution, Access Inheritance & Real Attachment Storage", version: "7.5.1", date: "2026-06-12", summary: "Conflict merge UI, inherited access and R2/S3-ready attachment metadata.", routes: v75RouteList() },
  { id: "v76", title: "Signed Attachment URLs, Provider Delivery & Access-Enforced Mutation API", version: V76_RELEASE_VERSION, date: "2026-06-12", summary: "Signed upload/download URL contracts, notification provider switchboard and access-enforced storage mutations.", routes: v76RouteList() }
];

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally.", action: "Fix any new typecheck error before push." },
  { id: "build", title: "Next.js production build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally before push.", action: "Wait for Vercel build after push." },
  { id: "v75-screenshots", title: "v7.5 screenshot baseline", status: "passed", owner: "QA", evidence: "V7.5 screenshot report confirmed 13/13 PNG on Vercel.", action: "Extend screenshot set with v7.6 routes." },
  { id: "signed-urls", title: "Signed attachment URLs", status: "passed", owner: "Platform", evidence: "v7.6 adds signed upload/download contracts for R2/S3-ready attachments.", action: "Configure provider credentials in production environment." },
  { id: "provider-delivery", title: "Provider delivery switchboard", status: "passed", owner: "Platform", evidence: "Email/push/websocket delivery queue states and retries are modeled.", action: "Connect real providers and telemetry." },
  { id: "access-enforced-mutations", title: "Access-enforced mutation API", status: "passed", owner: "Security", evidence: "Inherited access checks guard signed URL and file version operations.", action: "Apply access guards to all domain mutations." },
  { id: "primary-db", title: "Primary DB writes", status: "blocked", owner: "Backend", evidence: "Primary writes remain intentionally gated.", action: "Do not enable primary writes without backup, rollback replay and access audit." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => { acc[gate.status] += 1; return acc; }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = [...v70RouteList(), ...v71RouteList(), ...v72RouteList(), ...v73RouteList(), ...v74RouteList(), ...v75RouteList(), ...v76RouteList()];
  const scores = v76ProgressScores();
  const global = v76GlobalScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "provider-storage-delivery-access" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: releaseMilestones,
    checklist,
    progressScores: scores,
    previousProgressScores: v75ProgressScores(),
    previousProgressScoresV74: v74ProgressScores(),
    previousProgressScoresV73: v73ProgressScores(),
    previousProgressScoresV72: v72ProgressScores(),
    baselineProgressScores: v70ProgressScores(),
    globalScores: global,
    previousGlobalScores: v75GlobalScores(),
    previousGlobalScoresV74: v74GlobalScores(),
    previousGlobalScoresV73: v73GlobalScores(),
    previousGlobalScoresV72: v72GlobalScores(),
    v71GlobalScores: v71GlobalScores(),
    readiness: v76CurrentReadiness(),
    previousReadiness: v74CurrentReadiness(),
    previousReadinessV73: v73CurrentReadiness(),
    previousReadinessV72: v72CurrentReadiness(),
    nextRecommendedVersions: [{ version: "7.7.0", title: "Provider Rehearsal, Primary Write Dry Run & Observability", focus: "Run provider delivery rehearsal, primary write dry-run and add telemetry dashboards before primary enablement." }]
  };
}
