import { NextResponse } from "next/server";
import { listWorkOsStock, reserveWorkOsStock } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsStock());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(reserveWorkOsStock(payload), { status: 202 });
}

