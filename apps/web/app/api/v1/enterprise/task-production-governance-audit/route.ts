import { NextResponse } from "next/server";

import { getTaskProductionGovernanceRelease } from "@/lib/enterprise/task-production-governance";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getTaskProductionGovernanceRelease();
  return NextResponse.json({ ok: true, version: release.version, auditTrailContract: release.auditTrailContract });
}
