import { NextResponse } from "next/server";

import { getProductionTaskCrudPlan } from "@/lib/enterprise/production-task-crud-write-gate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProductionTaskCrudPlan());
}
