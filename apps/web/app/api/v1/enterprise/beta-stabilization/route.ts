import { NextResponse } from "next/server";

import { getBetaStabilizationRelease } from "@/lib/enterprise/beta-stabilization";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBetaStabilizationRelease());
}
