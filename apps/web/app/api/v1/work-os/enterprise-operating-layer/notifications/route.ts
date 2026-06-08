import { NextResponse } from "next/server";
import { v60Notifications } from "../../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  return NextResponse.json({ version: "6.0.0", notifications: userId ? v60Notifications.filter((notification) => notification.userId === userId) : v60Notifications });
}
