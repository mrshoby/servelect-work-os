import { NextResponse } from "next/server";
import { getV83ApiPayload } from "../data";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = getV83ApiPayload();
  return NextResponse.json(payload.health);
}
