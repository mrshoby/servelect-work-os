import { NextResponse } from "next/server";

import { getWorkOsOperationsFabricRisks } from "@/lib/enterprise/work-os-operations-fabric";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWorkOsOperationsFabricRisks());
}
