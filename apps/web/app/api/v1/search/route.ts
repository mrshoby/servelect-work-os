import { repository } from "@/lib/backend/repository";
import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  return jsonOk(repository.search(query));
}
