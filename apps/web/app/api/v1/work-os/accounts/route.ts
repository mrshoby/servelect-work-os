import { NextResponse } from "next/server";
import { getAccountSystemSummary, v59Users } from "@/lib/enterprise/work-os-enterprise-accounts";

export function GET() {
  return NextResponse.json({ ok: true, data: { summary: getAccountSystemSummary(), users: v59Users } });
}
