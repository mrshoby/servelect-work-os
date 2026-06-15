import { NextResponse } from "next/server";
import { v82EvaluatePolicy, v82PolicyRules } from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

export async function GET() {
  return NextResponse.json({ ok: true, rules: v82PolicyRules, simulations: [v82EvaluatePolicy("usr-super-admin", "workos:rollback", "Producție"), v82EvaluatePolicy("usr-productie-admin", "providers:outbox", "Producție"), v82EvaluatePolicy("usr-comercial", "admin:acl", "Comercial")] });
}
