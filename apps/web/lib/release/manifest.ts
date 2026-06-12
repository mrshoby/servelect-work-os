import { V78_RELEASE_VERSION, v78CurrentReadiness, v78GlobalScores, v78ProgressScores, v78RouteList } from "@/lib/enterprise/work-os-v78-provider-telemetry-saved-views";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };

export const SERVELECT_RELEASE_VERSION = V78_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.8.0 Provider Telemetry, Mutation Canary & Server-Side Saved Views";

export const releaseGates: ReleaseGate[] = [
  { id: "v77-screenshots", title: "v7.7 screenshot baseline", status: "passed", owner: "QA", evidence: "v7.7.0/v7.7.3 screenshot audit captured 18/18 clean PNG on Vercel.", action: "Use as accepted UI baseline." },
  { id: "provider-telemetry", title: "Provider telemetry", status: "passed", owner: "Platform", evidence: "v7.8 adds provider status, p95, success rate, delivery events and retry state.", action: "Connect live credentials only through environment variables." },
  { id: "server-saved-views", title: "Server-side saved views", status: "passed", owner: "Product", evidence: "Saved views now include route, scope, columns, filters, server state and version.", action: "Persist to DB adapter in the next build." },
  { id: "mutation-canary", title: "Mutation canary", status: "warning", owner: "Backend", evidence: "Canary records include lockVersion and rollback checkpoint but primary writes remain disabled.", action: "Do not enable primary writes until rollback drill passes." },
  { id: "primary-writes", title: "Primary Prisma writes", status: "blocked", owner: "Engineering", evidence: "Primary writes remain gated by design.", action: "Prepare v7.9 provider canary activation and ACL enforcement first." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => { acc[gate.status] += 1; return acc; }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = v78RouteList();
  const scores = v78ProgressScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "provider-telemetry-mutation-canary-saved-views" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: [{ id: "v78", title: "Provider Telemetry, Mutation Canary & Server-Side Saved Views", version: SERVELECT_RELEASE_VERSION, date: "2026-06-12", summary: "Adds provider telemetry, mutation canary and server-saved-view control layer to the real Taskuri GoodDay-like UI routes.", routes }],
    checklist,
    progressScores: scores,
    globalScores: v78GlobalScores(),
    readiness: v78CurrentReadiness(),
    nextRecommendedVersions: [{ version: "7.9.0", title: "Provider Canary Activation, Shared View ACL & Primary Write Pilot", focus: "Activate provider canary with secrets, enforce saved-view ACL and begin a narrow primary-write pilot with rollback." }]
  };
}
