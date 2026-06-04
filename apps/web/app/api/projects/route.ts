import { NextResponse } from "next/server";
import { projects } from "@servelect/shared";

export async function GET() {
  return NextResponse.json({ data: projects });
}
