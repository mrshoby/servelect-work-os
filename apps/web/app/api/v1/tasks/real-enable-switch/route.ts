import { NextResponse } from "next/server";

import { getTaskRealEnableSwitchPublicStatus } from "@/lib/enterprise/production-task-writes-real-enable-switch";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTaskRealEnableSwitchPublicStatus());
}
