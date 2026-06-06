import { NextResponse } from "next/server";

import { getExecutionHealth } from "@/lib/enterprise/work-os-execution-core";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getExecutionHealth());
}
