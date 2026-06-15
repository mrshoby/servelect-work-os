import { NextResponse } from "next/server";
import { getV84ApiPayload } from "./data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV84ApiPayload());
}
