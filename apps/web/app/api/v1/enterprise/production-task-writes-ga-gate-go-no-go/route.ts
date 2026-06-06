import { NextResponse } from "next/server";

import { getProductionTaskWritesGaGoNoGo } from "@/lib/enterprise/production-task-writes-ga-gate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesGaGoNoGo());
}
