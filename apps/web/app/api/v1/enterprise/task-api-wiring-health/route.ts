import { NextResponse } from "next/server";

import { getTaskApiWiringHealth, getTaskApiWiringStatus, taskApiWiringPlan } from "@/lib/enterprise/task-api-wiring";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskApiWiringHealth());
}
