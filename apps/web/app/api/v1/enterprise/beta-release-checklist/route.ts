import { NextResponse } from "next/server";

import { getBetaReleaseChecklist } from "@/lib/enterprise/beta-stabilization";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBetaReleaseChecklist());
}
