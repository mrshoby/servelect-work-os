import { NextResponse } from "next/server";
import { getV61WorkflowAutomationSnapshot, simulateV61WorkflowRun } from "../../../../../../lib/enterprise/work-os-v61-workflow-automation";

export async function GET() {
  const snapshot = getV61WorkflowAutomationSnapshot();
  return NextResponse.json({ version: snapshot.version, release: snapshot.release, rules: snapshot.rules, parity: snapshot.parity });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as { ruleId?: string }));
  return NextResponse.json({ ok: true, writeMode: "shadow-safe", result: simulateV61WorkflowRun(body.ruleId ?? "wf-iot-maintenance-task") });
}
