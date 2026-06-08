import { NextResponse } from "next/server";
import { getV58CutoverSummary, v58StatusMetrics } from "@/lib/enterprise/work-os-prisma-cutover";

export async function GET() {
  return NextResponse.json({ ok: true, summary: getV58CutoverSummary(), statusMetrics: v58StatusMetrics });
}
