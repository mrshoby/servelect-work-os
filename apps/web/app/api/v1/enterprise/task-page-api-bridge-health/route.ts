import { NextResponse } from "next/server";
import { getTaskPageApiBridgeHealth } from "@/lib/enterprise/task-page-api-bridge";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getTaskPageApiBridgeHealth()); }
