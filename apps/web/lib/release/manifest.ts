import { V79_RELEASE_VERSION, v79CurrentReadiness, v79GlobalScores, v79ProgressScores, v79RouteList } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };

export const SERVELECT_RELEASE_VERSION = V79_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.9.0 Provider Canary Activation, Shared View ACL & Primary Write Pilot";

export const releaseGates: ReleaseGate[] = [
  { id: "v78-screenshots", title: "v7.8 screenshot baseline", status: "passed", owner: "QA", evidence: "v7.8 screenshot audit captured 22/22 clean PNG on Vercel.", action: "Use as accepted baseline." },
  { id: "provider-canary", title: "Provider canary activation", status: "passed", owner: "Platform", evidence: "in_app/email canary lanes prepared; push/websocket remain gated.", action: "Activate only providers with env-ready secrets." },
  { id: "shared-view-acl", title: "Shared view ACL", status: "passed", owner: "Product", evidence: "Saved views now carry read/write/share/admin permissions and ACL state.", action: "Persist shared-view ACL to DB adapter next." },
  { id: "primary-write-pilot", title: "Primary write pilot", status: "warning", owner: "Backend", evidence: "Pilot writes include dry-run SQL and rollback checkpoint, but global primary writes stay closed.", action: "Run rollback drill before enabling real writes." },
  { id: "live-providers", title: "Live push/websocket providers", status: "blocked", owner: "Platform", evidence: "Push/websocket secrets/runtime missing.", action: "Configure secrets/runtime outside GitHub." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => { acc[gate.status] += 1; return acc; }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = v79RouteList();
  const scores = v79ProgressScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "provider-canary-shared-view-acl-primary-write-pilot" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: [{ id: "v79", title: "Provider Canary Activation, Shared View ACL & Primary Write Pilot", version: SERVELECT_RELEASE_VERSION, date: "2026-06-12", summary: "Adds provider canary activation, shared view ACL and narrow primary-write pilot to the real Taskuri GoodDay-like platform routes.", routes }],
    checklist,
    progressScores: scores,
    globalScores: v79GlobalScores(),
    readiness: v79CurrentReadiness(),
    nextRecommendedVersions: [{ version: "8.0.0", title: "Production Pilot Readiness, Authenticated ACL Enforcement & Rollback Drill", focus: "Run the first controlled real DB write pilot with authenticated ACL and rollback drill; do not broaden primary writes." }]
  };
}
