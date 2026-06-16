import { NextResponse } from "next/server";

const v100Routes = [
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
];

const v100Scores = {
  goodDayVisualSimilarity: 0,
  goodDayUiDensity: 0,
  taskuriContentDensity: 0,
  functionalParity: 0,
  routeApiHealthTarget: 27,
  manualUiDensityPass: 0,
  productionReadiness: 0,
  note: "v10.0.2 fixes build-breaking import and completes missing compatibility/API endpoints only. Manual UI density remains failed until v11.0.0 redesign is implemented and reviewed.",
};

const v100Buttons = [
  { button: "New Task", page: "/taskuri", handler: "createTask", stateChange: true, persistence: "localStorage", status: "needs browser verification" },
  { button: "New Ticket", page: "/taskuri/tickets", handler: "createTicket", stateChange: true, persistence: "localStorage", status: "needs browser verification" },
  { button: "Save View", page: "/taskuri/tabel", handler: "saveView", stateChange: true, persistence: "localStorage", status: "needs browser verification" },
  { button: "Bulk Action", page: "/taskuri/tabel", handler: "applyBulkAction", stateChange: true, persistence: "localStorage", status: "needs browser verification" },
  { button: "Start Timer", page: "/taskuri/my-work", handler: "startTimer", stateChange: true, persistence: "localStorage", status: "needs browser verification" },
];

const v100Flows = [
  { flow: "Open task drawer", page: "/taskuri", local: "pending", vercel: "pending", persisted: "pending", note: "Must be retested after v11.0.0 density rebuild." },
  { flow: "Move task on board", page: "/taskuri/board", local: "pending", vercel: "pending", persisted: "pending", note: "Must update board/table/my-work shared state." },
  { flow: "Create ticket and convert to task", page: "/taskuri/tickets", local: "pending", vercel: "pending", persisted: "pending", note: "Must create notification and linked task." },
  { flow: "Saved view survives refresh", page: "/taskuri/tabel", local: "pending", vercel: "pending", persisted: "pending", note: "localStorage/API pilot required." },
];

const v100Readiness = {
  ok: false,
  routeApiHotfix: true,
  buildImportFix: true,
  manualUiAudit: "failed 0/19 in uploaded report",
  blocker: "GoodDay density and UI parity remain unacceptable until a v11.0.0 redesign replaces the simple workspace surfaces.",
  nextRequiredBuild: "v11.0.0 — Major GoodDay Taskuri Workspace Redesign, Browser Flow QA & Shared State Hardening",
};

function payload(kind: string) {
  return {
    ok: kind === "readiness" ? false : true,
    version: "10.0.2",
    build: "Route/API + Table Import Completion Hotfix",
    warning: "This is not a GoodDay visual parity pass. It fixes a build-breaking table import and missing v10 route/API endpoints.",
    kind,
    routes: v100Routes,
    scores: v100Scores,
    buttons: v100Buttons,
    flows: v100Flows,
    readiness: v100Readiness,
    updatedAt: "2026-06-16",
  };
}

export async function GET() {
  return NextResponse.json(payload("flows"));
}
