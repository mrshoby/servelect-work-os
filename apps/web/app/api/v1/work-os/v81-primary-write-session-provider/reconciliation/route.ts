import { NextResponse } from "next/server";
import { v81ReconciliationLanes } from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  return NextResponse.json({ ok: true, lanes: v81ReconciliationLanes });
}
