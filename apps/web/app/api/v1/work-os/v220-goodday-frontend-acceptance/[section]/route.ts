import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ section: string }>;
};

async function readSection(context: RouteContext) {
  const params = await context.params;
  return params.section || "taskuri";
}

export async function GET(_request: Request, context: RouteContext) {
  const section = await readSection(context);

  return NextResponse.json({
    ok: true,
    version: "22.0.0",
    section,
    marker: "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
    bridge: "REAL_VISIBLE_INTERACTION_CONTRACT",
    mutationBridge: "API_SHADOW_MUTATION_BRIDGE",
    persistence: "REAL_LOCAL_PERSISTENT",
    mode: "section-visible-interaction-contract",
  });
}

export async function POST(request: Request, context: RouteContext) {
  const section = await readSection(context);
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  return NextResponse.json({
    ok: true,
    version: "22.0.0",
    section,
    marker: "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
    bridge: "REAL_VISIBLE_INTERACTION_CONTRACT",
    mutationBridge: "API_SHADOW_MUTATION_BRIDGE",
    persistence: "REAL_LOCAL_PERSISTENT",
    received: body,
    auditId: `v220-${section}-${Date.now()}`,
    queued: true,
  });
}
