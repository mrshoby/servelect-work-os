import { NextResponse } from "next/server";

import { getUnifiedWorkOsHealth } from "@/lib/enterprise/unified-work-os-command-center";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getUnifiedWorkOsHealth());
}
