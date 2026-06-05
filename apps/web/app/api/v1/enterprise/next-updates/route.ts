import { NextResponse } from "next/server";

import { getProductCompletion, getReleaseStatus, changelog, currentRelease, nextUpdates } from "@/lib/enterprise/release-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(({ ok: true, version: currentRelease.version, generatedAt: new Date().toISOString(), nextUpdates }));
}
