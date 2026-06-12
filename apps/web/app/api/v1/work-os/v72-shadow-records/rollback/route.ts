import { NextResponse } from "next/server";
import { applyV72ShadowMutation, createV72RuntimeState, rollbackV72ShadowRecord } from "@/lib/enterprise/work-os-v72-prisma-shadow-records";

export async function GET() {
  const runtime = createV72RuntimeState();
  const outcome = applyV72ShadowMutation(runtime, { entity: "ticket", action: "update", payload: { ticketId: "ticket_inverter", status: "Escaladat" } });
  const rolledBack = rollbackV72ShadowRecord(outcome.runtime, outcome.record.id);
  return NextResponse.json({ ok: true, created: outcome.record, rollbackEvidence: outcome.rollback, rolledBack: rolledBack.shadowRecords[0] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { shadowRecordId?: string };
  const runtime = createV72RuntimeState();
  const outcome = applyV72ShadowMutation(runtime, { entity: "task", action: "update", payload: { taskId: "t_pif_docs" } });
  const rolledBack = rollbackV72ShadowRecord(outcome.runtime, body.shadowRecordId ?? outcome.record.id);
  return NextResponse.json({ ok: true, runtime: rolledBack });
}
