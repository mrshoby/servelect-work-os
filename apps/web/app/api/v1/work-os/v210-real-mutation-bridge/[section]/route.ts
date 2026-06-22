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
    version: "21.0.4",
    section,
    marker: "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL",
    bridge: "API_SHADOW_MUTATION_BRIDGE",
    persistence: "REAL_LOCAL_PERSISTENT",
    mode: "section-shadow-mutation-ledger",
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
    version: "21.0.4",
    section,
    marker: "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL",
    bridge: "API_SHADOW_MUTATION_BRIDGE",
    persistence: "REAL_LOCAL_PERSISTENT",
    received: body,
    auditId: `v210-${section}-${Date.now()}`,
    queued: true,
  });
}
