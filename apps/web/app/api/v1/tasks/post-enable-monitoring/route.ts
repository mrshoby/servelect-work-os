import { NextResponse } from "next/server";

import { getTaskProductionPostEnableMonitoringPublicStatus } from "@/lib/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskProductionPostEnableMonitoringPublicStatus());
}
