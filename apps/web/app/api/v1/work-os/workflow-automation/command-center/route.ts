import { NextResponse } from "next/server";
import { getV61WorkflowAutomationSnapshot } from "../../../../../../lib/enterprise/work-os-v61-workflow-automation";

export async function GET() {
  return NextResponse.json(getV61WorkflowAutomationSnapshot());
}
