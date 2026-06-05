import { NextResponse } from "next/server";

import { getRealTaskUiActivationHealth } from "@/lib/enterprise/real-task-ui-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getRealTaskUiActivationHealth());
}
