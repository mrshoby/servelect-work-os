import { NextResponse } from "next/server";
import { applyV73ShadowWrite, createV73RuntimeState } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

export async function GET() {
  const runtime = createV73RuntimeState();
  return NextResponse.json({ ok: true, shadowWrites: runtime.shadowWrites, tables: runtime.tables });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const runtime = applyV73ShadowWrite(createV73RuntimeState(), { entity: String(body.entity ?? "task"), action: String(body.action ?? "update"), payload: body.payload ?? { id: "api_shadow_probe" }, source: "api_shadow" });
  return NextResponse.json({ ok: true, result: runtime.shadowWrites[0], rollback: runtime.rollbackCheckpoints[0], queue: runtime.notificationQueue[0] });
}
