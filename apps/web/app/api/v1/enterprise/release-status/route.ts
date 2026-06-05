import { NextResponse } from "next/server";
import { getReleaseStatus } from "@/lib/enterprise/release-dashboard";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getReleaseStatus()); }
