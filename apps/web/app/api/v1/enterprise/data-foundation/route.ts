import { NextResponse } from "next/server";

import { getDataFoundationRelease } from "@/lib/enterprise/data-foundation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getDataFoundationRelease()
  });
}
