import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const payload = {
  ok: true,
  version: "21.0.4",
  marker: "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL",
  bridge: "API_SHADOW_MUTATION_BRIDGE",
  persistence: "REAL_LOCAL_PERSISTENT",
  shell: "V15_V200_PRESERVED_NO_NEW_VISUAL_SHELL",
  forbiddenShells: {
    taskuriWorkspace: false,
    workspaceHierarchy: false,
    v160: false,
  },
  actions: [
    "createWorkItem",
    "saveView",
    "resetFilter",
    "sortTable",
    "markRead",
    "approve",
    "reject",
    "drawerSave",
    "timer",
    "bulkAction",
    "boardMove",
    "ganttReschedule",
    "workloadRebalance",
    "procurementRequest",
  ],
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
    auditId: `v210-${Date.now()}`,
    queued: true,
  });
}
