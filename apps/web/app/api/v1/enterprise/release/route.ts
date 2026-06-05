import { NextResponse } from "next/server";

import { getEnterpriseReleaseManifest } from "@/lib/enterprise/v11";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: getEnterpriseReleaseManifest()
  });
}
