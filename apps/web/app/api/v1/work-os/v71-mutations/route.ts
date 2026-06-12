import { NextResponse } from "next/server";
import { applyV71Mutation, buildMutationRequest, createV71Snapshot, v71BuildReportStandard, v71DomainStatus, v71GlobalScores, v71RouteList, V71_RELEASE_VERSION, type V71MutationAction, type V71MutationEntity } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";

export async function GET() {
  const snapshot = createV71Snapshot("api_shadow");
  return NextResponse.json({
    ok: true,
    version: V71_RELEASE_VERSION,
    name: "SERVELECT WORK OS v7.1.0 Backend Mutation Adapter",
    mode: "api_shadow_with_prisma_primary_gated",
    warning: "Primary database writes remain gated. v7.1.0 adds mutation contracts, audit events, local/API shadow persistence and server notification readiness.",
    routes: v71RouteList(),
    domainStatus: v71DomainStatus(),
    scores: v71GlobalScores(),
    report: v71BuildReportStandard(),
    metrics: {
      users: snapshot.state.users.length,
      tasks: snapshot.state.tasks.length,
      tickets: snapshot.state.tickets.length,
      notifications: snapshot.state.notifications.length,
      approvals: snapshot.state.approvals.length,
      savedViews: snapshot.state.savedViews.length,
      workflows: snapshot.state.workflows.length,
      customFields: snapshot.state.customFields.length
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const entity = String(body.entity ?? "task") as V71MutationEntity;
  const action = String(body.action ?? "update") as V71MutationAction;
  const mutation = buildMutationRequest(entity, action, (body.payload ?? {}) as Record<string, unknown>, String(body.actorId ?? "u_andrei"), String(body.role ?? "Super Admin"), String(body.department ?? "Management"), "api_shadow");
  const result = applyV71Mutation(createV71Snapshot("api_shadow").state, mutation);
  return NextResponse.json({ ok: result.ok, version: V71_RELEASE_VERSION, result });
}
