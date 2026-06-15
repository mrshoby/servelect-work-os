import { NextResponse } from "next/server";
import { getV94Slice } from "@/lib/enterprise/work-os-v94-goodday-timeline-drawer-mutation";

export async function GET() {
  return NextResponse.json(getV94Slice("readiness"));
}
