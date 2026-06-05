import { jsonOk } from "@/lib/backend/http";
import { workflowTemplates } from "@/lib/workflows/templates";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk(workflowTemplates);
}
