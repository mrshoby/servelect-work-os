import { NextResponse } from "next/server";

import { getReleaseChecklist } from "@/lib/release/manifest";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    checklist: getReleaseChecklist()
  });
}
