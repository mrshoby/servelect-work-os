import { NextResponse } from "next/server";
import { v60GoodDayCompliance } from "../../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

export async function GET() {
  const average = Math.round((v60GoodDayCompliance.reduce((sum, row) => sum + row.quality, 0) / v60GoodDayCompliance.length) * 100) / 100;
  return NextResponse.json({ version: "6.0.0", average, audit: v60GoodDayCompliance });
}
