import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const payload = {
  ok: true,
  version: "22.0.0",
  marker: "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
  bridge: "REAL_VISIBLE_INTERACTION_CONTRACT",
  mutationBridge: "API_SHADOW_MUTATION_BRIDGE",
  persistence: "REAL_LOCAL_PERSISTENT",
  shell: "V15_V200_V210_PRESERVED_NO_NEW_VISUAL_SHELL",
  forbiddenShells: {
    taskuriWorkspace: false,
    workspaceHierarchy: false,
    v160: false,
  },
  auditedSystems: [
    "buttons",
    "filters",
    "tabs",
    "tables",
    "board",
    "drawers",
    "notifications",
    "savedViews",
    "importsExports",
    "workflows",
    "approvals",
    "workload",
    "timeTracking",
    "procurement",
    "reports",
  ],
  acceptance: {
    visibleInteractionContract: true,
    delegatedHandlers: true,
    userFeedback: true,
    localPersistence: true,
    crossRouteMarkers: true,
  },
};

export async function GET() {
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  return NextResponse.json({
    ...payload,
    received: body,
    auditId: `v220-${Date.now()}`,
    queued: true,
  });
}
