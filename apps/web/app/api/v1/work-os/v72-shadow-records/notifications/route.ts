import { NextResponse } from "next/server";
import { applyV72ShadowMutation, createV72RuntimeState, markV72ServerNotificationRead } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

export async function GET() {
  const runtime = createV72RuntimeState();
  const outcome = applyV72ShadowMutation(runtime, { entity: "notification", action: "create", payload: { title: "Server notification smoke", body: "v7.2 notification store probe" } });
  return NextResponse.json({ ok: true, notifications: outcome.runtime.serverNotifications, unread: outcome.runtime.serverNotifications.filter((item) => !item.read).length });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { notificationId?: string };
  const runtime = createV72RuntimeState();
  const marked = markV72ServerNotificationRead(runtime, body.notificationId);
  return NextResponse.json({ ok: true, notifications: marked.serverNotifications, unread: marked.serverNotifications.filter((item) => !item.read).length });
}
