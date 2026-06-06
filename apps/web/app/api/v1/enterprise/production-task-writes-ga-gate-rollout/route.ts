import { NextResponse } from "next/server";

import { getProductionTaskWritesGaRollout } from "@/lib/enterprise/production-task-writes-ga-gate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskWritesGaRollout());
}
