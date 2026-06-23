export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ section: string }>;
};

const sections = ['overview', 'views', 'drawer', 'board', 'table', 'calendar-gantt', 'workload', 'inbox', 'timesheets', 'reports'];

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  return Response.json({ ok: true, release: 'v11.0.0', fixedBy: 'v22.0.7', marker: 'GOODDAY_TASKURI_WORKSPACE_REDESIGN', section, sections });
}

export async function POST(request: Request, context: RouteContext) {
  const { section } = await context.params;
  const payload = await request.json().catch(() => ({}));
  return Response.json({ ok: true, release: 'v11.0.0', fixedBy: 'v22.0.7', marker: 'GOODDAY_TASKURI_WORKSPACE_REDESIGN', section, payload, sections });
}
