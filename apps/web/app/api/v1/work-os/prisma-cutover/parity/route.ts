import { NextResponse } from "next/server";
import { v58SeedParityChecks } from "@/lib/enterprise/work-os-prisma-cutover";

export async function GET() {
  const blockers = v58SeedParityChecks.filter((check) => check.status === "blocked");
  return NextResponse.json({ ok: blockers.length === 0, blockers: blockers.length, checks: v58SeedParityChecks });
}
