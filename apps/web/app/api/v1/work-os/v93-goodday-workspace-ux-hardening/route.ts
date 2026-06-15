import { NextResponse } from "next/server";
import { getV93GoodDayWorkspaceUxHardening } from "@/lib/enterprise/work-os-v93-goodday-workspace-ux-hardening";

export async function GET() {
  return NextResponse.json({ ok: true, ...getV93GoodDayWorkspaceUxHardening() });
}
