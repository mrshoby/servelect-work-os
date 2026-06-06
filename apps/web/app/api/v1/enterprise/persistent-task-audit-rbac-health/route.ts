import { NextResponse } from "next/server";

import { getPersistentTaskAuditRbacHealth } from "@/lib/enterprise/persistent-task-audit-rbac-enforcement";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPersistentTaskAuditRbacHealth());
}
