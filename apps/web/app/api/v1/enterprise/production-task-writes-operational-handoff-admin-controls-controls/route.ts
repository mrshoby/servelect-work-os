import { NextResponse } from "next/server";

import { getProductionTaskWritesOperationalHandoffAdminControls } from "@/lib/enterprise/production-task-writes-operational-handoff-admin-controls";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getProductionTaskWritesOperationalHandoffAdminControls();
  return NextResponse.json({
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    adminControls: release.adminControls,
    metrics: release.metrics
  });
}
