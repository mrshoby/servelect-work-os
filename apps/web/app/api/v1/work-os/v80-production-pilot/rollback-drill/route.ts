import { NextResponse } from "next/server";
import { v80RollbackDrill } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  return NextResponse.json({ ok: true, drill: v80RollbackDrill });
}

export async function POST() {
  const simulated = v80RollbackDrill.map((step) => ({ ...step, simulatedAt: new Date().toISOString(), canProceed: step.status !== "blocked" }));
  return NextResponse.json({ ok: true, mode: "simulated_rollback_drill", simulated });
}
