import { jsonOk } from "@/lib/backend/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return jsonOk({
    status: "ok",
    app: "SERVELECT WORK OS",
    version: "0.4.0-backend-foundation",
    mode: process.env.DATABASE_URL ? "database-ready" : "mock-api",
    timestamp: new Date().toISOString()
  });
}
