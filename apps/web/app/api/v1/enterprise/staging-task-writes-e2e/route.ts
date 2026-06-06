import { NextResponse } from "next/server";

import { getStagingTaskWritesE2EValidation } from "@/lib/enterprise/staging-task-writes-e2e-validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getStagingTaskWritesE2EValidation());
}
