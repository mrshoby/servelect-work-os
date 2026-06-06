import { NextResponse } from "next/server";

import { getProductionTaskWritesLimitedGaMonitoring } from "@/lib/enterprise/production-task-writes-limited-ga-rollout";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesLimitedGaMonitoring());
}
