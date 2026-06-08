import { NextResponse } from "next/server";
import { getV56MaturityAreas, getV56PersistentRecordsReport } from "@/lib/enterprise/work-os-persistent-records";

export function GET() {
  const report = getV56PersistentRecordsReport();
  return NextResponse.json({
    ok: true,
    version: "5.6.0",
    overall: report.overall,
    areas: getV56MaturityAreas(),
    next: report.nextRecommendedVersion
  });
}
