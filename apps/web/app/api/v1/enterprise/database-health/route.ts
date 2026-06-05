import { NextResponse } from "next/server";

import { getDatabaseHealth } from "@/lib/enterprise/database-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.3.0",
    generatedAt: new Date().toISOString(),
    health: getDatabaseHealth()
  });
}
