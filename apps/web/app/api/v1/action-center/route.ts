import { jsonOk } from "@/lib/backend/http";
import { getActionCenterItems, getActionCenterSummary } from "@/lib/action-center/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk({
    version: "0.9.0",
    summary: getActionCenterSummary(),
    items: getActionCenterItems()
  });
}
