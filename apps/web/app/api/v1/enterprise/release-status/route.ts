import { NextResponse } from "next/server";

import { getReleaseStatusDashboard } from "@/lib/enterprise/release-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getReleaseStatusDashboard());
}
