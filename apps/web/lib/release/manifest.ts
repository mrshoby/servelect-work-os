import { V80_RELEASE_NAME, V80_RELEASE_VERSION, v80CurrentReadiness, v80GlobalScores, v80ProgressScores, v80RouteList } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";
export type ReleaseGate = { id: string; title: string; status: ReleaseGateStatus; owner: string; evidence: string; action: string };

export const SERVELECT_RELEASE_VERSION = V80_RELEASE_VERSION;
export const SERVELECT_RELEASE_CHANNEL = `v${V80_RELEASE_VERSION} ${V80_RELEASE_NAME}`;

export const releaseGates: ReleaseGate[] = [
  { id: "v79-functional-routes", title: "v7.9 functional routes", status: "passed", owner: "QA", evidence: "35/35 route/API smoke tests passed on Vercel before v8.0 planning.", action: "Use as baseline." },
  { id: "v79-screenshots", title: "v7.9 screenshot baseline", status: "passed", owner: "QA", evidence: "29/29 clean PNG screenshots captured on Vercel; no NO_PNG baseline issue.", action: "Expand screenshot audit to v8.0 routes." },
  { id: "authenticated-acl", title: "Authenticated ACL enforcement", status: "warning", owner: "Security", evidence: "ACL evaluator models role/department/team/client scope; real session binding remains adapter-gated.", action: "Wire Auth.js/current session actor in v8.1." },
  { id: "rollback-drill", title: "Rollback drill", status: "warning", owner: "Backend", evidence: "Rollback checkpoints and lock versions are represented for pilot writes.", action: "Run first staging DB rollback drill before primary writes." },
  { id: "provider-runtime", title: "Live provider runtime", status: "blocked", owner: "Infrastructure", evidence: "Push/websocket/email live providers need real runtime credentials/secrets.", action: "Configure provider credentials outside repo." }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>((acc, gate) => {
    acc[gate.status] += 1;
    return acc;
  }, { passed: 0, warning: 0, blocked: 0, planned: 0 });
  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / Math.max(releaseGates.length, 1)) * 100);
  return { version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, productionScore, totals, gates: releaseGates, blockers: releaseGates.filter((gate) => gate.status === "blocked"), warnings: releaseGates.filter((gate) => gate.status === "warning"), planned: releaseGates.filter((gate) => gate.status === "planned") };
}

export function getReleaseManifest() {
  const checklist = getReleaseChecklist();
  const routes = v80RouteList();
  const scores = v80ProgressScores();
  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: { name: "SERVELECT WORK OS / SERVELECT EMP", version: SERVELECT_RELEASE_VERSION, channel: SERVELECT_RELEASE_CHANNEL, releaseType: "production-pilot-acl-rollback-drill" },
    summary: { productionScore: checklist.productionScore, routes: routes.length, scoreRows: scores.length, releaseGates: releaseGates.length, capabilities: routes.length, actionItems: checklist.warnings.length + checklist.blockers.length + checklist.planned.length, criticalActions: checklist.blockers.length, workflowExecutions: scores.length },
    milestones: [{ id: "v80", title: V80_RELEASE_NAME, version: SERVELECT_RELEASE_VERSION, date: "2026-06-15", summary: "Adds production pilot readiness, authenticated ACL guard and rollback drill surfaces/API without opening global primary writes.", routes }],
    checklist,
    progressScores: scores,
    globalScores: v80GlobalScores(),
    readiness: v80CurrentReadiness(),
    nextRecommendedVersions: [{ version: '8.1.0', title: "Authenticated Session Binding, Staging DB Write Pilot & Rollback Evidence", focus: "Connect the v8 ACL evaluator to real authenticated sessions and run a narrow staging DB write/rollback drill." }]
  };
}

