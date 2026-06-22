import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "19.0.2",
    build: "GOODDAY_IN_PLACE_INTERACTION_CORE_ON_V15_SHELL",
    mode: "REAL_LOCAL_PERSISTENT_FRONTEND_RUNTIME",
    shellPolicy: "V15 shell preserved; no new visual shell; no demo route.",
    systems: [
      "task-management",
      "project-management",
      "my-work",
      "inbox",
      "board-kanban",
      "table-list",
      "calendar-gantt",
      "workload",
      "time-tracking",
      "tickets",
      "requests-forms",
      "notifications",
      "approvals",
      "saved-views",
      "filters-search",
      "bulk-actions",
      "comments-activity-log",
      "attachments-mock",
      "dependencies",
      "imports-exports",
      "rbac-role-switcher",
    ],
    acceptance: {
      staticUi: false,
      deadButtonsPolicy: "zero tolerance for principal actions",
      persistence: "localStorage until backend mutation adapter is connected",
      nextMajor: "v20.0.0 Backend mutation adapter + persisted DB bridge",
    },
  });
}
