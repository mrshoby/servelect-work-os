import { NextResponse } from "next/server";

import { getWorkOsOperationsFabricAutomations } from "@/lib/enterprise/work-os-operations-fabric";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOsOperationsFabricAutomations());
}
