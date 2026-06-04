import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { jsonError, jsonOk } from "@/lib/backend/http";
import { testPrismaConnection } from "@/lib/backend/prisma-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getDatabaseStatus();
  if (status.active !== "prisma") return jsonOk(status);

  try {
    await testPrismaConnection();
    return jsonOk({ ...status, connection: "ok" });
  } catch (error) {
    return jsonError("INTERNAL_ERROR", "Conexiunea Prisma/PostgreSQL a eșuat.", 500, error instanceof Error ? error.message : error);
  }
}
