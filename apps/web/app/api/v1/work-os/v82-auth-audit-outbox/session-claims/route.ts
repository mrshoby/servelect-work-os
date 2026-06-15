import { NextResponse } from "next/server";
import { v82EvaluatePolicy, v82SessionClaims } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, claims: v82SessionClaims, checks: { escalation: v82EvaluatePolicy("usr-audit-manager", "tickets:escalate", "Audit energetic"), blocked: v82EvaluatePolicy("usr-comercial", "admin:acl", "Comercial") } });
}
