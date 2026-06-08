import { NextResponse } from "next/server";
import { getGoodDayComplianceAudit, getGoodDayComplianceScores } from "@/lib/enterprise/work-os-enterprise-accounts";

export function GET() {
  return NextResponse.json({ ok: true, data: { scores: getGoodDayComplianceScores(), audit: getGoodDayComplianceAudit() } });
}
