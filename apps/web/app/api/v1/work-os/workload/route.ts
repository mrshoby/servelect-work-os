import { NextResponse } from "next/server";

import { getWorkloadView } from "@/lib/enterprise/work-os-execution-core";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkloadView());
}
