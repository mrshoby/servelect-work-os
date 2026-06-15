import { NextResponse } from "next/server";
import { getV86Release } from "@/lib/enterprise/work-os-v86-auth-rls-department-pilot";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getV86Release());
}
