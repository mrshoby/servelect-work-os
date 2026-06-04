import { repository } from "@/lib/backend/repository";
import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk(await repository.listApprovals());
}
