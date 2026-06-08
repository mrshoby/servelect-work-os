import { NextRequest, NextResponse } from "next/server";
import { simulateV58Mutation, v58MutationContracts } from "@/lib/enterprise/work-os-prisma-cutover";

export async function GET() {
  return NextResponse.json({ ok: true, writeMode: process.env.SERVELECT_WORK_OS_WRITE_MODE ?? "off", contracts: v58MutationContracts });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { contractId?: string };
  const contractId = body.contractId ?? v58MutationContracts[0]?.id ?? "";
  return NextResponse.json(simulateV58Mutation(contractId));
}
