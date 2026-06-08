import { NextResponse } from "next/server";
import { getV56PersistentRecordsReport } from "@/lib/enterprise/work-os-persistent-records";

export function GET() {
  return NextResponse.json({
    ok: true,
    release: "v5.6.0",
    report: getV56PersistentRecordsReport()
  });
}
