import { NextResponse } from "next/server";
import { createV73RuntimeState, processV73NotificationQueue } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

export async function GET() {
  const runtime = createV73RuntimeState();
  return NextResponse.json({ ok: true, queue: runtime.notificationQueue });
}

export async function POST() {
  const runtime = processV73NotificationQueue(createV73RuntimeState());
  return NextResponse.json({ ok: true, delivered: runtime.notificationQueue.filter((item) => item.status === "delivered").length, queue: runtime.notificationQueue });
}
