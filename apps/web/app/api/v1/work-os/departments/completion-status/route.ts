import { NextResponse } from "next/server";
import { completionStatusV62, explainAuditConcepts } from "../../../../../../lib/enterprise/work-os-v62-department-rbac";

export async function GET() {
  return NextResponse.json({ version: "6.2.0", completion: completionStatusV62, auditConcepts: explainAuditConcepts() });
}
