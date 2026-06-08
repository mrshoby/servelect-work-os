import { NextResponse } from "next/server";
import { getTeamStatusForUser, v59Users } from "@/lib/enterprise/work-os-enterprise-accounts";

export function GET() {
  const currentUser = v59Users[0];
  return NextResponse.json({ ok: true, data: { currentUser, team: getTeamStatusForUser(currentUser) } });
}
