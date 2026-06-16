import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, version: "10.0.3", surface: "Taskuri", writes: "off-pilot-gated" });
}
