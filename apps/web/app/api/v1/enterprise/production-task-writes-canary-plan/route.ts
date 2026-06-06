import { NextResponse } from "next/server";

import { getProductionTaskWritesCanaryPlan } from "@/lib/enterprise/production-task-writes-canary-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesCanaryPlan());
}
