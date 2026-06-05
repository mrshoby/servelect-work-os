import { NextResponse } from "next/server";

import { getUiTaskStoreFeatureFlagRelease } from "@/lib/enterprise/ui-task-store-flags";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getUiTaskStoreFeatureFlagRelease());
}
