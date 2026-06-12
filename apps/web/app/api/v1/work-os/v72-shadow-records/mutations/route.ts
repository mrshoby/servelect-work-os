import { NextResponse } from "next/server";
import { applyV72ShadowMutation, createV72RuntimeState, type V72MutationPayload } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

export async function GET() {
  const runtime = createV72RuntimeState();
  const outcome = applyV72ShadowMutation(runtime, { entity: "task", action: "update", payload: { taskId: "t_pif_docs", comment: "GET smoke mutation v7.2" } });
  return NextResponse.json({ ok: true, mutation: outcome.result, shadowRecord: outcome.record, rollback: outcome.rollback, notification: outcome.notification });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as Partial<V72MutationPayload>;
  const runtime = createV72RuntimeState(body.writeMode ?? "prisma_shadow_ready");
  const outcome = applyV72ShadowMutation(runtime, {
    entity: body.entity ?? "task",
    action: body.action ?? "update",
    payload: body.payload ?? { taskId: "t_pif_docs", comment: "POST smoke mutation v7.2" },
    actorId: body.actorId,
    role: body.role,
    department: body.department,
    writeMode: body.writeMode
  });
  return NextResponse.json({ ok: outcome.result.ok, runtime: outcome.runtime, result: outcome.result, shadowRecord: outcome.record, rollback: outcome.rollback, notification: outcome.notification });
}
