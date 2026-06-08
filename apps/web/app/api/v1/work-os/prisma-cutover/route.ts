import { NextResponse } from "next/server";
import { getV58CutoverPayload } from "@/lib/enterprise/work-os-prisma-cutover";

export async function GET() {
  return NextResponse.json(getV58CutoverPayload());
}
