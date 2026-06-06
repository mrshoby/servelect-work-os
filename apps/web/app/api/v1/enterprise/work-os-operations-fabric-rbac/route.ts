import { NextResponse } from "next/server";

import { getWorkOsOperationsFabricRbac } from "@/lib/enterprise/work-os-operations-fabric";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOsOperationsFabricRbac());
}
