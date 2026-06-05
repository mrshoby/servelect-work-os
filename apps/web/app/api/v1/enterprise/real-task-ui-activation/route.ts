import { NextResponse } from "next/server";

import { getRealTaskUiActivationRelease } from "@/lib/enterprise/real-task-ui-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getRealTaskUiActivationRelease());
}
