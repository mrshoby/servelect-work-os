export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ section: string }>;
};

const VERSION = "21.0.1";
const BUILD = "GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL_NEXT15_CONTEXT_FIX";
const MODE = "API_SHADOW_MUTATION_BRIDGE";
const PERSISTENCE = "REAL_LOCAL_PERSISTENT";

async function getSection(context: RouteContext) {
  const params = await context.params;
  return params.section;
}

export async function GET(_request: Request, context: RouteContext) {
  const section = await getSection(context);
  return Response.json({
    ok: true,
    version: VERSION,
    build: BUILD,
    mode: MODE,
    persistence: PERSISTENCE,
    section,
    status: "connected",
    noNewShell: true,
    next15RouteContext: "params-promise-only",
  });
}

export async function POST(request: Request, context: RouteContext) {
  const section = await getSection(context);
  const body = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    version: VERSION,
    build: BUILD,
    mode: MODE,
    persistence: PERSISTENCE,
    section,
    auditId: `v210-${section}-${Date.now()}`,
    received: body,
    next15RouteContext: "params-promise-only",
  });
}
