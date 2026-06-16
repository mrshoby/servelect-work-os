import { NextResponse } from "next/server";
import { getV98GoodDayParitySummary } from "@/lib/enterprise/work-os-v98-goodday-ui-content-function-parity";

export async function GET() {
  return NextResponse.json({ ok: true, version: "9.8.0", canonical: "Taskuri", writes: "OFF / pilot gated" });
}
