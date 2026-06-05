import { NextResponse } from "next/server";

import { currentEnterpriseVersion, releaseChangelog } from "@/lib/enterprise/release-status";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, version: currentEnterpriseVersion, generatedAt: new Date().toISOString(), releases: releaseChangelog });
}
