import { NextResponse } from "next/server";

import { getDatabaseActivationRelease } from "@/lib/enterprise/database-activation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getDatabaseActivationRelease()
  });
}
