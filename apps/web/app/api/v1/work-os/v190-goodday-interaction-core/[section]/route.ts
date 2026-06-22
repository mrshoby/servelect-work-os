import { NextResponse } from "next/server";

const sections: Record<string, string[]> = {
  taskuri: ["new-task", "filters", "saved-views", "drawer-save", "comments", "timer", "export", "import"],
  board: ["move-card", "status-transition", "column-count", "sync-table-my-work"],
  tabel: ["sort", "bulk-actions", "row-actions", "export"],
  inbox: ["mark-read", "mark-all-read", "open-related-entity"],
  tickets: ["new-ticket", "severity", "escalate", "comment", "attach-file", "convert-to-task"],
  workload: ["estimate-change", "tracked-time", "capacity-feedback"],
  procurement: ["request", "materials", "rfq", "offers", "purchase-order", "invoice", "warranty"],
};

export async function GET(_request: Request, context: { params: Promise<{ section: string }> }) {
  const { section } = await context.params;
  return NextResponse.json({
    ok: true,
    version: "19.0.2",
    section,
    build: "GOODDAY_IN_PLACE_INTERACTION_CORE_ON_V15_SHELL",
    capabilities: sections[section] ?? ["runtime", "feedback", "local-persistence"],
    persistence: "REAL_LOCAL_PERSISTENT",
  });
}
