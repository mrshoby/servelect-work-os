import { NextResponse } from "next/server";
import { V81_RELEASE_VERSION, v81ReadinessSummary } from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  return NextResponse.json({ ok: true, version: V81_RELEASE_VERSION, health: "ready", summary: v81ReadinessSummary() });
}
