import { NextResponse } from "next/server";
import { v58RollbackDrills } from "@/lib/enterprise/work-os-prisma-cutover";

export async function GET() {
  const passed = v58RollbackDrills.filter((drill) => drill.drillStatus === "passed").length;
  return NextResponse.json({ ok: true, passed, total: v58RollbackDrills.length, drills: v58RollbackDrills });
}
