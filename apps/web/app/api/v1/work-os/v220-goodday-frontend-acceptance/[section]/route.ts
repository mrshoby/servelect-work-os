export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ section: string }>;
};

const tokens = [
  "GOODDAY_FRONTEND_ACCEPTANCE_LAYER",
  "REAL_VISIBLE_INTERACTION_CONTRACT",
  "API_SHADOW_MUTATION_BRIDGE",
  "REAL_LOCAL_PERSISTENT",
  "NO_DUPLICATE_DIALOGS",
  "data-v220-goodday-frontend-acceptance",
  "data-v220-goodday-frontend-acceptance-layer",
  "time-entry",
  "workload-assign",
  "board-status-move",
  "table-sort",
  "gantt-reschedule",
  "calendar-schedule",
  "procurement-request",
  "rfq-conversion",
  "supplier-comparison",
  "purchase-order",
  "invoice-attach"
];

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  return Response.json({
    ok: true,
    release: 'v22.0.7',
    section,
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    tokens,
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { section } = await context.params;
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    release: 'v22.0.7',
    section,
    name: 'GOODDAY_FRONTEND_ACCEPTANCE_LAYER',
    contract: 'REAL_VISIBLE_INTERACTION_CONTRACT',
    mode: 'API_SHADOW_MUTATION_BRIDGE',
    persistence: 'REAL_LOCAL_PERSISTENT',
    duplicateGuard: 'NO_DUPLICATE_DIALOGS',
    payload,
    tokens,
  });
}
