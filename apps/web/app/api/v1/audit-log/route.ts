import { jsonOk } from "@/lib/backend/http";
import { listAuditEvents } from "@/lib/backend/audit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 500);
  return jsonOk(listAuditEvents(limit));
}
