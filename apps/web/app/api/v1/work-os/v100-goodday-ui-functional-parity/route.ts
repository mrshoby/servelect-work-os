import { NextResponse } from "next/server";

const parityPayload = {
  version: "10.0.3",
  status: "route-api-build-hotfix",
  canonicalSurface: "Taskuri",
  visualAcceptance: "not-final",
  globalProductionWrites: "off-pilot-gated",
  routes: [
    "/taskuri",
    "/taskuri/overview",
    "/taskuri/my-work",
    "/taskuri/inbox",
    "/taskuri/tickets",
    "/taskuri/tickets-notificari",
    "/taskuri/proiecte-active",
    "/taskuri/proiecte-viitoare",
    "/taskuri/proiecte-finalizate",
    "/taskuri/board",
    "/taskuri/tabel",
    "/taskuri/table",
    "/taskuri/calendar",
    "/taskuri/calendar-gantt",
    "/taskuri/workload",
    "/taskuri/workload-aprobari",
    "/taskuri/forms",
    "/taskuri/timesheets",
    "/taskuri/reports",
    "/taskuri/automations",
  ],
  scores: {
    gooddayVisualSimilarity: 0,
    gooddayFunctionalParity: 0,
    routeApiCompletenessTarget: 27,
    routeApiCompletenessExpectedAfterDeploy: 27,
  },
};

export async function GET() {
  return NextResponse.json(parityPayload);
}
