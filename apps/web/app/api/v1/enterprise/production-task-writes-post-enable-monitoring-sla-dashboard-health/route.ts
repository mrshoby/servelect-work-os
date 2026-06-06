import { NextResponse } from "next/server";

import { getProductionTaskWritesPostEnableMonitoringSlaDashboard } from "@/lib/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesPostEnableMonitoringSlaDashboard().health);
}
