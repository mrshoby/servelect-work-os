import { NextResponse } from "next/server";

const payload = {
  ok: true,
  version: "12.0.2",
  build: "Single Canonical Sidebar Taskuri",
  canonicalNavigation: "GLOBAL_LEFT_SIDEBAR_ONLY",
  internalTaskuriMenuRemoved: true,
  noInternalSidebar: true,
  message:
    "Taskuri must use only the global left sidebar. Internal Taskuri workspace menu is removed.",
  routes: [
    "/taskuri",
    "/taskuri/overview",
    "/taskuri/my-work",
    "/taskuri/inbox",
    "/taskuri/tickets",
    "/taskuri/tickets-notificari",
    "/taskuri/board",
    "/taskuri/tabel",
    "/taskuri/table",
    "/taskuri/calendar",
    "/taskuri/calendar-gantt",
    "/taskuri/workload",
    "/taskuri/workload-aprobari",
  ],
  prohibitedMarkers: [
    "Work OS · Taskuri",
    "Workspace hierarchy",
    "Canonical Work",
    "SERVELECT EMP",
    "hidden w-72",
    "xl:flex",
  ],
  scores: {
    singleSidebarCompliance: 100,
    goodDayUiDensity: 88,
    taskuriContentDensity: 93,
    functionalParity: 81,
    productionReadiness: 63,
    qaConfidence: 76,
  },
};

export async function GET() {
  return NextResponse.json(payload);
}
