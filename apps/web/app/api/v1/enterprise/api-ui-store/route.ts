import { NextResponse } from "next/server";

import { getApiUiStoreRelease } from "@/lib/enterprise/api-ui-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getApiUiStoreRelease());
}
