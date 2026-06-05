import { NextResponse } from "next/server";
import { getNextUpdates } from "@/lib/enterprise/release-dashboard";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getNextUpdates()); }
