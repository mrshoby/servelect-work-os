import { NextResponse } from "next/server";
import { getTaskPageApiBridgePlan } from "@/lib/enterprise/task-page-api-bridge";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getTaskPageApiBridgePlan()); }
