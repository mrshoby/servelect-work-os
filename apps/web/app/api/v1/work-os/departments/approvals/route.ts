import { NextResponse } from "next/server";
import { departmentApprovalsV62 } from "../../../../../../lib/enterprise/work-os-v62-department-rbac";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const departmentId = url.searchParams.get("departmentId");
  const approvals = departmentId ? departmentApprovalsV62.filter((approval) => approval.departmentId === departmentId) : departmentApprovalsV62;
  return NextResponse.json({ version: "6.2.0", count: approvals.length, approvals });
}
