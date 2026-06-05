import { repository } from "@/lib/backend/repository";
import { jsonOk } from "@/lib/backend/http";
import { getServelectSystemStatus } from "@/lib/system/status";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getServelectSystemStatus();
  const dashboard = await repository.dashboard().catch((error: unknown) => ({
    error: error instanceof Error ? error.message : "Repository dashboard unavailable"
  }));

  return jsonOk({
    ...status,
    dashboard
  });
}
