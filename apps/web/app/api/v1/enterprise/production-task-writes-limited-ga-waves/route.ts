import { NextResponse } from "next/server";

import { getProductionTaskWritesLimitedGaWaves } from "@/lib/enterprise/production-task-writes-limited-ga-rollout";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesLimitedGaWaves());
}
