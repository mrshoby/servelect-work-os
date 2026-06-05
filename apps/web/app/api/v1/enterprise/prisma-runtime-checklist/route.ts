import { NextResponse } from "next/server";

import { getDbProviderRuntimeRelease } from "@/lib/enterprise/db-provider-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getDbProviderRuntimeRelease();

  return NextResponse.json({
    ok: true,
    version: release.version,
    generatedAt: new Date().toISOString(),
    safetyGates: release.safetyGates,
    entities: release.entities.map((entity) => ({
      id: entity.id,
      label: entity.label,
      table: entity.table,
      prismaModel: entity.prismaModel,
      status: entity.status,
      migrationStep: entity.migrationStep
    }))
  });
}
