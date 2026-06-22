import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "20.0.0",
    build: "GOODDAY_COMPLETE_INTERACTION_LAYER_ON_V15_SHELL",
    shell: "V150_IN_PLACE_NO_NEW_VISUAL_SHELL",
    mode: "REAL_LOCAL_PERSISTENT_FRONTEND",
    parityFocus: [
      "Action Required",
      "My Work",
      "Table/List",
      "Board/Kanban",
      "Calendar/Gantt",
      "Workload",
      "Task drawer",
      "Saved views",
      "Notifications",
      "Approvals",
      "Time tracking",
      "Imports/Exports",
      "Procurement workflow",
      "Activity log",
      "Attachments mock",
      "RBAC visibility",
    ],
    acceptance: {
      noTaskuriWorkspaceShell: true,
      noWorkspaceHierarchyPanel: true,
      noV160VisualShell: true,
      noV170VisualShell: true,
      visibleButtonsRequireHandlers: true,
    },
  });
}
