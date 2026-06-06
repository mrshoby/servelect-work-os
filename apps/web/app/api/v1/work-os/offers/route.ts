import { NextResponse } from "next/server";
import { listWorkOsOffers, createWorkOsOffer } from "@/lib/enterprise/work-os-core-modules";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listWorkOsOffers());
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(createWorkOsOffer(payload), { status: 202 });
}

