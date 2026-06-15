import { NextResponse } from "next/server";
import { getV93GoodDayWorkspaceUxHardening, getV93Slice } from "@/lib/enterprise/work-os-v93-goodday-workspace-ux-hardening";

export async function GET() {
  const payload = getV93GoodDayWorkspaceUxHardening();
  return NextResponse.json(getV93Slice("keyboard"));
}
