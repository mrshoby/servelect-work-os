import { NextResponse } from "next/server";

import { repository } from "@/lib/backend/repository";
import { getServelectSystemStatus } from "@/lib/system/status";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getServelectSystemStatus();

  let dashboard: unknown;

  try {
    dashboard = await Promise.resolve(repository.dashboard());
  } catch (error: unknown) {
    dashboard = {
      error: error instanceof Error ? error.message : "Repository dashboard unavailable"
    };
  }

  return NextResponse.json({
    ok: true,
    version: "0.9.0",
    generatedAt: new Date().toISOString(),
    status,
    dashboard
  });
}
