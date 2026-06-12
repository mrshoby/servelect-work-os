import { V77_RELEASE_VERSION, v77CurrentReadiness, v77GlobalScores, v77ProgressScores, v77RouteList } from "@/lib/enterprise/work-os-v77-goodday-ui-parity";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };

export const SERVELECT_RELEASE_VERSION = V77_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = "v7.7.4 GoodDay-like UI Functional Parity, Provider Rehearsal & Observability";

export const releaseGates: ReleaseGate[] = [
  { id: "typecheck", title: "TypeScript typecheck", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm typecheck locally.", action: "Fix any new error before push." },
  { id: "build", title: "Next.js build", status: "warning", owner: "Engineering", evidence: "Apply script runs pnpm build locally.", action: "Wait for Vercel check after push." },
  { id: "v76-screenshots", title: "v7.6 screenshot baseline", status: "passed", owner: "QA", evidence: "V7.6 screenshot audit confirmed 12/12 PNG on Vercel.", action: "Extend audit to v7.7 Taskuri UX routes." },
  { id: "goodday-ui", title: "GoodDay-like UI discipline", status: "passed", owner: "Product", evidence: "v7.7 applies a compact Work OS shell to real Taskuri routes.", action: "Continue refinement without copying GoodDay branding." },
  { id: "primary-writes", title: "Primary Prisma writes", status: "blocked", owner: "Backend", evidence: "Primary writes remain gated; dry-run only.", action: "No primary writes without rollback replay and backup." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => { acc[gate.status] += 1; return acc; }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = v77RouteList();
  const scores = v77ProgressScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "goodday-ui-functional-parity" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: [{ id: "v77", title: "GoodDay-like UI Functional Parity, Provider Rehearsal & Observability", version: SERVELECT_RELEASE_VERSION, date: "2026-06-12", summary: "Taskuri real routes receive compact GoodDay-like Work OS shell, stronger interaction and provider rehearsal visibility.", routes }],
    checklist,
    progressScores: scores,
    globalScores: v77GlobalScores(),
    readiness: v77CurrentReadiness(),
    nextRecommendedVersions: [{ version: "7.8.0", title: "Provider Telemetry, Mutation Canary & Server-Side Saved Views", focus: "Start controlled provider telemetry and API canary while moving saved views/notifications server-side." }]
  };
}



