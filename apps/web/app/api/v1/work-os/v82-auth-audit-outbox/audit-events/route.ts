import { NextResponse } from "next/server";
import { v82AuditEvents, v82AuditSummary } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, summary: v82AuditSummary(), events: v82AuditEvents });
}
