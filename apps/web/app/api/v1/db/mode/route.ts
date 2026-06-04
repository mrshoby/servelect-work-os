import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk(getDatabaseStatus());
}
