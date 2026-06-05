import { NextResponse } from "next/server";

import { getSitePerformanceAudit } from "@/lib/performance/site-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSitePerformanceAudit());
}
