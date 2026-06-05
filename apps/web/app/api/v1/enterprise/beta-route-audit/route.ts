import { NextResponse } from "next/server";

import { getBetaRouteAuditManifest } from "@/lib/enterprise/beta-stabilization";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBetaRouteAuditManifest());
}
