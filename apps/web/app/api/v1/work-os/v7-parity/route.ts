import { NextResponse } from "next/server";
import { buildV70Seed, calculateV70Workload, v70ParityFeatureMatrix, v70ProgressScores, v70RouteList, V70_RELEASE_VERSION } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export async function GET() {
  const state = buildV70Seed();
  const workload = calculateV70Workload(state);
  return NextResponse.json({
    ok: true,
    version: V70_RELEASE_VERSION,
    name: "SERVELECT WORK OS v7.0.0 GoodDay Functional Parity Hardening",
    mode: "real-local-persistent-plus-api-prepared",
    warning: "Primary multi-user backend writes are not enabled in v7.0.0. Local persistent adapter and API readiness are included.",
    metrics: {
      users: state.users.length,
      projects: state.projects.length,
      tasks: state.tasks.length,
      tickets: state.tickets.length,
      requestForms: state.requestForms.length,
      notifications: state.notifications.length,
      approvals: state.approvals.length,
      savedViews: state.savedViews.length,
      customFields: state.customFields.length,
      taskTypes: state.taskTypes.length,
      timeEntries: state.timeEntries.length,
      timesheets: state.timesheets.length,
      automations: state.automations.length,
      overloadedUsers: workload.filter((row) => row.overloaded).length
    },
    routes: v70RouteList(),
    featureMatrix: v70ParityFeatureMatrix(),
    progressScores: v70ProgressScores(),
    nextBuild: {
      version: "7.1.0",
      name: "Backend Mutation Adapter, Multi-User Records & Server Notifications",
      priority: "Move v7 local persistent entities to API/repository adapter with Prisma shadow writes."
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    version: V70_RELEASE_VERSION,
    accepted: true,
    writeMode: "shadow/local-adapter",
    message: "Mutation contract accepted for v7.0.0. Primary DB writes remain gated until v7.1.",
    mutation: body
  });
}
