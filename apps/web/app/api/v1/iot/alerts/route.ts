import { repository } from "@/lib/backend/repository";
import { getPagination, jsonList, paginate } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { limit, offset } = getPagination(searchParams);
  const items = repository.listAlerts();
  return jsonList(paginate(items, limit, offset), { total: items.length, limit, offset });
}
