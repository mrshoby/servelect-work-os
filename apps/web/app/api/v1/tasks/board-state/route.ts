import { NextResponse } from "next/server";
import { getTaskBoardState } from "@/lib/enterprise/task-board-drawer";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(getTaskBoardState()); }
