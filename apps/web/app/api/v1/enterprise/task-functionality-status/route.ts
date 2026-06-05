import { NextResponse } from "next/server";

import { getTaskFunctionalityStatus } from "@/lib/enterprise/task-functionality-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskFunctionalityStatus());
}
