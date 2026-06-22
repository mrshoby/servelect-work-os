import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const sections: Record<string, string[]> = {
  taskuri: ["New Task", "drawer save", "comments", "timer", "dependency", "saved views"],
  board: ["board move", "status update", "column counts", "activity log"],
  tabel: ["sort", "bulk action", "export", "import"],
  inbox: ["Action Required", "mark read", "mark all read", "open related entity"],
  workload: ["estimate update", "timer impact", "resource planning"],
  tickets: ["new ticket", "severity", "escalate", "convert to task"],
  procurement: ["request", "RFQ", "supplier comparison", "PO", "invoice", "warranty"],
};

export async function GET(_request: Request, context: { params: Promise<{ section: string }> }) {
  const { section } = await context.params;
  return NextResponse.json({
    ok: true,
    version: "20.0.0",
    section,
    build: "GOODDAY_COMPLETE_INTERACTION_LAYER_ON_V15_SHELL",
    persistence: "REAL_LOCAL_PERSISTENT",
    capabilities: sections[section] ?? ["connected views", "handlers", "activity log"],
  });
}
