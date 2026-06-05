import { NextResponse } from "next/server";

import { getDataFoundationRelease } from "@/lib/enterprise/data-foundation";

export const dynamic = "force-dynamic";

export async function GET() {
  const release = getDataFoundationRelease();
  const completed = release.checklist.filter((item) => item.done).length;
  const total = release.checklist.length;

  return NextResponse.json({
    ok: true,
    version: release.version,
    generatedAt: release.generatedAt,
    readiness: {
      completed,
      total,
      percent: Math.round((completed / Math.max(total, 1)) * 100)
    },
    blockers: release.checklist.filter((item) => !item.done),
    nextMajorBuild: release.nextMajorBuild
  });
}
