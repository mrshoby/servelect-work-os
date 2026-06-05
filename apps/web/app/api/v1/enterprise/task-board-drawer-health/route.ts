import { NextResponse } from "next/server";
import { getTaskBoardDrawerHealth } from "@/lib/enterprise/task-board-drawer";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getTaskBoardDrawerHealth()); }
