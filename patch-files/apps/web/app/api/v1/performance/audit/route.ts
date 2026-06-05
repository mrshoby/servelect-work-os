import { NextResponse } from "next/server";

import { getSiteAuditSummary, siteAuditItems } from "@/lib/performance/site-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.0.1",
    summary: getSiteAuditSummary(),
    items: siteAuditItems
  });
}
