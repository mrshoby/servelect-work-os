import { NextResponse } from "next/server";

import { getApiUiStoreHealth } from "@/lib/enterprise/api-ui-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getApiUiStoreHealth());
}
