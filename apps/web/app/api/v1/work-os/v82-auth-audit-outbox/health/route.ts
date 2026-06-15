import { NextResponse } from "next/server";
import { V82_RELEASE_VERSION, v82ReadinessSummary } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, version: V82_RELEASE_VERSION, health: "ready", summary: v82ReadinessSummary() });
}
