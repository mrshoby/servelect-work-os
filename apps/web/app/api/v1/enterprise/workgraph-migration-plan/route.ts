import { NextResponse } from "next/server";

import { getWorkGraphMigrationPlan } from "@/lib/enterprise/workgraph-persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    migrationPlan: getWorkGraphMigrationPlan()
  });
}
