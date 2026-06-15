import { NextResponse } from "next/server";
import { v82ReplayDrill, v82ReadinessSummary } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, replay: v82ReplayDrill, readiness: v82ReadinessSummary() });
}
