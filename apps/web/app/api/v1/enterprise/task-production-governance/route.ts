import { NextResponse } from "next/server";

import { getTaskProductionGovernanceRelease } from "@/lib/enterprise/task-production-governance";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskProductionGovernanceRelease());
}
