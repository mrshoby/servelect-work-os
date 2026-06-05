import { NextResponse } from "next/server";

import { getTaskApiWiringHealth, getTaskApiWiringStatus, taskApiWiringPlan } from "@/lib/enterprise/task-api-wiring";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(({ ok: true, version: "2.6.0", generatedAt: new Date().toISOString(), contract: { tasks: ["GET /api/v1/tasks", "POST /api/v1/tasks", "PATCH /api/v1/tasks/:id", "DELETE /api/v1/tasks/:id"], projects: ["GET /api/v1/projects"], mode: "api-read + local fallback" } }));
}
