import { NextResponse } from "next/server";

import { getProductionTaskWritesPostEnableMonitoringSlaDashboard } from "@/lib/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getProductionTaskWritesPostEnableMonitoringSlaDashboard();
  return NextResponse.json({ ok: true, version: release.version, incidentCommands: release.incidentCommands });
}
