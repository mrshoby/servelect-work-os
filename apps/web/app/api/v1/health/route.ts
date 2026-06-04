import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk({
    service: "SERVELECT WORK OS API",
    version: "0.5.0",
    status: "ok",
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
}
