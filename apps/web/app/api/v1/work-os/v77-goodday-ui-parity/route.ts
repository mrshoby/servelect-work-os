import { createV77RuntimeState, v77CurrentReadiness, v77GlobalScores, v77ProgressScores, v77RouteList } from "@/lib/enterprise/work-os-v77-goodday-ui-parity";

export async function GET() {
  const state = createV77RuntimeState();
  return Response.json({ ok: true, version: state.version, module: "v77-goodday-ui-functional-parity", routes: v77RouteList(), scores: v77GlobalScores(), progress: v77ProgressScores(), readiness: v77CurrentReadiness(), stateSummary: { tasks: state.tasks.length, tickets: state.tickets.length, notifications: state.notifications.length, savedViews: state.savedViews.length } });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return Response.json({ ok: true, version: "7.7.0", accepted: true, writeMode: "provider_dry_run", payload, evidence: "v7.7 POST accepted in safe dry-run mode only." });
}
