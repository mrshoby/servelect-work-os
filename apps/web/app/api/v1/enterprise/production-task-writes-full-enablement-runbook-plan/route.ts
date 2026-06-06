import { NextResponse } from "next/server";

import { getProductionTaskWritesFullEnablementPlan } from "@/lib/enterprise/production-task-writes-full-enablement-runbook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesFullEnablementPlan());
}
