import { NextResponse } from "next/server";
import { getV83ApiPayload } from "./data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV83ApiPayload());
}
