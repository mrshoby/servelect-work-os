import { jsonOk } from "@/lib/backend/http";
import { getWorkflowExecutionSummary, listWorkflowExecutions } from "@/lib/workflows/executions";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk({
    version: "0.9.0",
    summary: getWorkflowExecutionSummary(),
    executions: listWorkflowExecutions()
  });
}
