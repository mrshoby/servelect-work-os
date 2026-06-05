import { NextResponse } from "next/server";

import { getDbProviderRuntimeRelease } from "@/lib/enterprise/db-provider-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getDbProviderRuntimeRelease();

  return NextResponse.json({
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    provider: release.provider,
    runtimePlan: release.runtimePlan,
    nextBuild: release.nextBuild
  });
}
