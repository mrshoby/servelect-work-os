import { NextResponse } from "next/server";

import { completionAreas, getOverallProductStatus } from "@/lib/enterprise/release-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ...getOverallProductStatus(), completionAreas });
}
