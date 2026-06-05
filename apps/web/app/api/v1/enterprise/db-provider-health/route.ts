import { NextResponse } from "next/server";

import { getDbProviderRuntimeHealth } from "@/lib/enterprise/db-provider-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getDbProviderRuntimeHealth());
}
