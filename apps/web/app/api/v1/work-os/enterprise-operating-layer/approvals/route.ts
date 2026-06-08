import { NextResponse } from "next/server";
import { canApproveRequest, getUserById, v60Approvals } from "../../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = getUserById(searchParams.get("userId") ?? "u1");
  const approvals = user ? v60Approvals.filter((approval) => canApproveRequest(user, approval)) : v60Approvals;
  return NextResponse.json({ version: "6.0.0", approvals });
}
