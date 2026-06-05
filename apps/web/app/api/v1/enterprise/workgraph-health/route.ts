import { NextResponse } from "next/server";

import { getWorkGraphHealth } from "@/lib/enterprise/workgraph-persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    health: getWorkGraphHealth()
  });
}
