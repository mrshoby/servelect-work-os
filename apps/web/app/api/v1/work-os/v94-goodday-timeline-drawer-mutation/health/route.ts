import { NextResponse } from "next/server";
import { getV94GoodDayTimelineDrawerMutation } from "@/lib/enterprise/work-os-v94-goodday-timeline-drawer-mutation";

export async function GET() {
  const payload = getV94GoodDayTimelineDrawerMutation();
  return NextResponse.json({ ok: true, version: payload.version, status: "healthy", productionWrites: payload.productionWrites });
}
