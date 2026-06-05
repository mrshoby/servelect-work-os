import { NextResponse } from "next/server";

import { getRouteAuditManifest } from "@/lib/performance/audit-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.1.0",
    data: getRouteAuditManifest()
  });
}
