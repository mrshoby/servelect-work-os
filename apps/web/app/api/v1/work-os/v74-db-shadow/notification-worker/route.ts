import { NextResponse } from "next/server";
import { createV74RuntimeState, processV74NotificationQueue, V74_RELEASE_VERSION } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

export async function GET() {
  const before = createV74RuntimeState();
  const after = processV74NotificationQueue(before);
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, before: before.queue, after: after.queue, worker: { mode: "in_app_ready", providers: { email: "ready_not_configured", push: "ready_not_configured", websocket: "ready_not_configured" } } });
}

export async function POST() {
  const after = processV74NotificationQueue(createV74RuntimeState());
  return NextResponse.json({ ok: true, version: V74_RELEASE_VERSION, queue: after.queue });
}
