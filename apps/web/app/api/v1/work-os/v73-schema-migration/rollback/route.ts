import { NextResponse } from "next/server";
import { applyV73ShadowWrite, createV73RuntimeState } from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

export async function GET() {
  const runtime = applyV73ShadowWrite(createV73RuntimeState(), { entity: "task", action: "rollback_probe", payload: { id: "rollback_probe" } });
  return NextResponse.json({ ok: true, rollback: runtime.rollbackCheckpoints, shadowWrites: runtime.shadowWrites });
}
