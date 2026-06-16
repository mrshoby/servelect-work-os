import { NextResponse } from "next/server";
import { getV98GoodDayParitySummary } from "@/lib/enterprise/work-os-v98-goodday-ui-content-function-parity";

export async function GET() {
  const data = getV98GoodDayParitySummary(); return NextResponse.json({ ok: true, writes: data.productionWrites, visualSimilarityTarget: data.visualSimilarityTarget, functionalParityTarget: data.functionalParityTarget, gates: ["no parallel shell", "dense Taskuri UI", "interactive local persistence", "button audit", "flow audit"] });
}
