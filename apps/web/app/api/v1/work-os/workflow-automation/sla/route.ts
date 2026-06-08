import { NextResponse } from "next/server";
import { getV61WorkflowAutomationSnapshot } from "../../../../../../lib/enterprise/work-os-v61-workflow-automation";

export async function GET() {
  const snapshot = getV61WorkflowAutomationSnapshot();
  return NextResponse.json({ version: snapshot.version, policies: snapshot.slaPolicies, breachedSla: snapshot.breachedSla });
}
