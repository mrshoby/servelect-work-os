import { NextResponse } from "next/server";
import { getRoleAwareDashboard, v60Users } from "../../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

export async function GET() {
  return NextResponse.json({ version: "6.0.0", users: v60Users, dashboards: v60Users.map((user) => getRoleAwareDashboard(user.id)) });
}
