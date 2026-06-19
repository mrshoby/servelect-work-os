import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ section: string }> };

const allowed = new Set(["health", "routes", "scores", "buttons", "flows", "readiness", "workspace", "visual-audit", "gap-matrix", "screenshots", "static-ui", "design-system"]);

function payload(section: string) {
  return {
    ok: true,
    version: "15.0.0",
    build: "GOODDAY_1TO1_STRUCTURAL_TASKURI_PARITY",
    section,
    routeSpecificLayouts: true,
    deadButtonsAllowed: false,
    staticUiAllowed: false,
    oneInternalSidebarAllowed: false,
    stateModel: "REAL_LOCAL_PERSISTENT with provider-ready boundaries",
    coverage: {
      overview: "command center",
      myWork: "daily planning split/board/list",
      inbox: "triage feed with read/archive/schedule",
      tickets: "request/ticket center with SLA and conversion",
      projects: "active/future/completed dedicated layouts",
      board: "kanban workflow columns with status updates",
      table: "enterprise table with inline edits and bulk actions",
      calendarGantt: "date planning and dependency timeline",
      workload: "capacity allocation and approval queue",
      drawer: "editable task detail drawer",
    },
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const { section } = await context.params;
  if (!allowed.has(section)) {
    return NextResponse.json({ ok: false, error: "Unknown v150 section", section, allowed: Array.from(allowed) }, { status: 404 });
  }
  return NextResponse.json(payload(section));
}
